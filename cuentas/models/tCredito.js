"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tCreditoShema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    fechaCompra: {
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
    tipo: {
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
    },
    mes: {
        type: Number
    },
    anio: {
        type: Number
    },
    identificador: {
        type: String
    },
    nCuota: {
        type: Number
    }
});
tCreditoShema.pre('save', function (next) {
    this.created = new Date();
    this.idUsuarioCreacion = 1;
    this.activo = true;
    next();
});
exports.TCredito = mongoose_1.model('TCredito', tCreditoShema);
