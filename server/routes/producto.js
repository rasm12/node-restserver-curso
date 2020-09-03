const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


let Producto = require('../models/producto');

app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });
        })
});

app.post('/producto', (req, res) => {
    let body = req.body;


    let producto = new Producto();
    producto.nombre = body.nombre;
    producto.precioUni = body.precioUni;
    producto.usuario = body.usuario;
    producto.descripcion = body.descripcion;

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        return res.json({
            ok: true,
            producto: productoBD
        });
    })



});

module.exports = app;