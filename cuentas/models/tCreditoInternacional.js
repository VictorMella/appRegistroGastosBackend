"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCreditoInternacional = void 0;
const mongoose_1 = require("mongoose");
const tCreditoInternacionalShema = new mongoose_1.Schema({
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
tCreditoInternacionalShema.pre('save', function (next) {
    this.created = new Date();
    this.idUsuarioCreacion = 1;
    next();
});
exports.TCreditoInternacional = (0, mongoose_1.model)('TCreditoInternacional', tCreditoInternacionalShema);
