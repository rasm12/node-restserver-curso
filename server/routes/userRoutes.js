const express = require('express');
const bCrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const _ = require('underscore');

const app = express();

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/get-all-users', [verificaToken, verificaAdminRole], (req, response) => {


    Usuario.find({}, 'nombre email')
        .exec((err, res) => {
            if (err) {
                return response.status(400).json({
                    success: false,
                    err
                });


            }


            Usuario.countDocuments({}, (err, conteo) => {
                response.json({
                    success: true,
                    users: res,
                    total: conteo
                })
            })


        });
});

app.get('/usuarios', verificaToken, function(req, response) {

    let from = req.query.from || 0;

    from = Number(from);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'nombre email')
        .skip(from)
        .limit(limite)
        .exec((err, res) => {
            if (err) {
                return response.status(400).json({
                    success: false,
                    err
                });


            }


            Usuario.countDocuments({ estado: false }, (err, conteo) => {
                response.json({
                    success: true,
                    users: res,
                    total: conteo
                })
            })


        });
});

app.post('/usuario', verificaToken, function(req, res) {

    let body = req.body;
    // let usuario = new Usuario({
    //     nombre: body.nombre,
    //     email: body.email,
    //     password: bCrypt.hashSync(body.password, 10),
    //     role: body.role
    // });

    for (let i = 0; i < 15; i++) {
        let usuario = new Usuario({
            nombre: `Nombre ${i}`,
            email: 'email' + i + '@email.com',
            password: bCrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, uDB) => {
            if (err) {
                //return res.status(400).json({ success: false, 'message': err })
            }

            //res.json({ success: true, user: uDB })
        });
    }

    //res.json({ success: true, user: null })

});


app.put('/usuario/:id', verificaToken, function(req, res) {

    let id = req.params.id;


    // seleccionar campoos a mostrar
    let body = _.pick(req.body, ['nombre', 'email', 'role']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, us) => {
        if (err) {
            return res.status(400).json({ success: false, 'message': err })
        }
        res.json({ success: true, usuario: us });
    });


});

app.delete('/usuario/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, u) => {
    //     if (err) {
    //         return res.status(400).json({ success: true, message: 'Error al eliminar', err })
    //     }

    //     res.json({ success: true, message: 'Registro Eliminado', u })
    // })

    let fields = {
        estado: true
    }
    Usuario.findByIdAndUpdate(id, fields, { new: true, runValidators: true }, (err, us) => {
        if (err) {
            return res.status(400).json({ success: false, 'message': err })
        }
        res.json({ success: true, usuario: us });
    })




});

module.exports = app;