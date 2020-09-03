const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');


const { verificaTokenImg } = require('../middlewares/autenticacion')


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./uploads/${ tipo }/${ img }`;

    let fullPath = path.resolve(__dirname, '../assets/no-image.jpg')

    //res.sendfile('./server/assets/no-image.jpg');
    res.sendFile(fullPath);



});


module.exports = app;