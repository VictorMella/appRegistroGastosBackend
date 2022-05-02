"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCredito = void 0;
const mongoose_1 = require("mongoose");
const tCreditoShema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    fechaCompra: {
        type: Date
    },
    totalCompra: {
        type: Number
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
    nCuota: {
        type: Number
    },
    anio: {
        type: Number
    },
    identificador: {
        type: String
    },
    nacional: {
        type: Boolean
    }
});
tCreditoShema.pre('save', function (next) {
    this.created = new Date();
    this.activo = true;
    next();
});
exports.TCredito = (0, mongoose_1.model)('TCredito', tCreditoShema);
