const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true  // Asegúrate de que el deviceId sea único
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true  // Opcional: guarda automáticamente la fecha de creación y actualización de cada documento
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
