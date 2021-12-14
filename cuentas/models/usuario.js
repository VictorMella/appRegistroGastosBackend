"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsuarioSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    activo: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    identificador: {
        type: Number
    },
});
UsuarioSchema.pre('save', function (next) {
    this.created = new Date();
    this.idUsuarioCreacion = 1;
    next();
});
exports.Usuario = mongoose_1.model('Usuario', UsuarioSchema);
