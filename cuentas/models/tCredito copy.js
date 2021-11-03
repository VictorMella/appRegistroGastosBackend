"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCredito = void 0;
const mongoose_1 = require("mongoose");
const tcreditoShema = new mongoose_1.Schema({
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
tcreditoShema.pre('save', function (next) {
    this.created = new Date();
    this.idUsuarioCreacion = 1;
    next();
});
exports.TCredito = (0, mongoose_1.model)('TCredito', tcreditoShema);
