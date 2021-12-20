"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otrosShema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    fechaCompra: {
        type: Date
    },
    monto: {
        type: Number
    },
    tipo: {
        type: String
    },
    descripcion: {
        type: String
    },
    idUsuarioCreacion: {
        type: Number
    },
    activo: {
        type: Boolean
    },
    mes: {
        type: Number
    },
    anio: {
        type: Number
    }
});
otrosShema.pre('save', function (next) {
    this.created = new Date();
    this.activo = true;
    next();
});
exports.TDebito = mongoose_1.model('TDebito', otrosShema);
