"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TDebito = void 0;
const mongoose_1 = require("mongoose");
const tDebitoShema = new mongoose_1.Schema({
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
tDebitoShema.pre('save', function (next) {
    this.created = new Date();
    this.activo = true;
    next();
});
exports.TDebito = (0, mongoose_1.model)('TDebito', tDebitoShema);
