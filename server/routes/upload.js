const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');


const Usuario = require('../models/usuario')


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: 'No files were uploaded.'
            });
    }

    let validTypes = ['productos', 'usuarios'];
    if (!validTypes.includes(tipo)) {
        return res.status(400)
            .json({
                ok: false,
                err: `Tipo no valido. Los aceptados son ${validTypes.join(', ')}`
            });
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.archivo;

    //extensiones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = sampleFile.name.split('.');

    let extension = nombreArchivo.pop();

    if (!extensiones.includes(extension)) {
        return res.status(401).json({
            ok: false,
            err: 'Extension no permitida'
        })
    }

    //cambiar nombre al archivo
    let nombreFile = `${ id } - ${ new Date().getMilliseconds() } . ${extension}`

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${tipo}/${nombreFile}`, function(err) {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        // la imagen ha sido cargada
        imagenUsuario(id, res, nombreFile);



    });

});


function imagenUsuario(id, res, name) {
    Usuario.findById(id, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'error al guarar la imagen'
            })
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }

        let pathImg = path.resolve(__dirname, `../../uploads/usuarios/${name}`);
    })
}


module.exports = app;