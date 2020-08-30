const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');
let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es valido!'
};




let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre es un Campo Obligatorio']
    },
    email: {
        type: String,
        require: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'El password es necesario']
    },
    img: {
        require: [false],
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    estado: {
        type: Boolean,
        default: true
    }
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let usearO = user.toObject();
    delete usearO.password;
    return usearO;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico!' })

module.exports = mongoose.model('Usuario', usuarioSchema);