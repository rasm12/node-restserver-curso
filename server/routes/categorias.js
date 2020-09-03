const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


let Categoria = require('../models/categoria');


app.post('/create-category', [], (req, res) => {

    let body = req.body

    let categoria = new Categoria();

    categoria.nombre = req.body.nombre;
    categoria.estado = true;
    categoria.save((err, cat) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            message: 'Created successfully!'
        });
    })
});


app.get('/categoria/:id', [], (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, cat) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cat) {
            return res.status(404).json({
                ok: false,
                msg: `La categoria ${id} no existe`
            })
        }

        return res.json({
            ok: true,
            categoria: cat
        })
    })
});


app.get('/categorias', [], (req, res) => {
    let id = req.params.id;

    Categoria.find({}, (err, cat) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: cat
        });
    }).sort('id')
})



module.exports = app;