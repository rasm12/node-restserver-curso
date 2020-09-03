//verificar token

const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {

    process.env.SEED = process.env.SEED || 'secret'

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.data

        next()
    });


};

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            'err': 'No tiene permisos para acceder a este recurso'
        });
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdminRole
};