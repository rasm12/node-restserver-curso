const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');



let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre es un Campo Obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    }
});
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} ya existe en la BD!' })
module.exports = mongoose.model('Categoria', categoriaSchema);