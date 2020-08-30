const express = require('express');
const bCrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();

const jwt = require('jsonwebtoken')

app.post('/login', (req, response) => {

    let body = req.body;

    console.log(bCrypt.hashSync(body.password, 10));

    Usuario.findOne({ email: body.email }, (err, usDB) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                err
            });
        }

        console.log(usDB);
        if (!usDB) {
            return response.status(404).json({
                ok: false,
                err: `(usuario) con email o password incorrectos!`
            });
        }

        let match = bCrypt.compareSync(body.password, usDB.password);
        if (!match) {
            return response.status(404).json({
                ok: false,
                err: `usuario con email o (password) incorrectos!`
            });
        }

        let token = jwt.sign({
            data: usDB
        }, 'secret', { expiresIn: 60 * 60 })

        return response.json({
            ok: true,
            data: usDB,
            token
        })

    });

});




module.exports = app;