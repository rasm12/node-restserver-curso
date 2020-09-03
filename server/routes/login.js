const express = require('express');
const bCrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();

const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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
        }, process.env.SEED, { expiresIn: 60 * 60 })

        return response.json({
            ok: true,
            data: usDB,
            token
        })

    });

});


///configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        eamil: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/sign-in-google', async(req, response) => {
    let token = req.body.idtoken;

    //verificar usuario en google
    let googleUser = await verify(token)
        .catch(err => {
            return response.status(403).json({
                ok: false,
                err
            })
        });


    //buscar si existe el usuario en nuestr BD
    Usuario.findOne({ email: googleUser.email }, (err, us) => {

        //si ha ocurrido un error
        if (err) {
            return response.status(500).json({
                ok: false,
                err
            });
        }

        //si encontro el usar, verificar que no este logueado
        if (us) {
            if (us.google === false) {
                return response.status(400).json({
                    ok: false,
                    err: 'Debe usar su auth normal'
                });
            }

            //refrescar el token
            let token = jwt.sign({
                data: us
            }, process.env.SEED, { expiresIn: 60 * 60 });

            return response.json({
                ok: true,
                data: us,
                token: token
            })


        } else {
            // si el usuario no existe en nuestra Bd crear
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.password = ':)';

            usuario.save((err, sav) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    data: us
                }, process.env.SEED, { expiresIn: 60 * 60 });

                return response.json({
                    ok: true,
                    data: us,
                    token: token
                })
            })
        }
    });


    return response.json({
        googleUser
    });

});


module.exports = app;