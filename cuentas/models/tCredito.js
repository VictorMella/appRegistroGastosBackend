"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tCreditoShema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    monto: {
        type: Number
    },
    cuotas: {
        type: Number
    },
    descripcion: {
        type: String
    },
    facturacionInmediata: {
        type: Boolean
    },
    idUsuarioCreacion: {
        type: Number
    },
    activo: {
        type: Boolean
    }
});
tCreditoShema.pre('save', function (next) {
    this.created = new Date();
    this.idUsuarioCreacion = 1;
    next();
});
exports.TCredito = mongoose_1.model('TCredito', tCreditoShema);
