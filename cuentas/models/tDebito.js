"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TDebito = void 0;
const mongoose_1 = require("mongoose");
const tDebitoShema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    monto: {
        type: Number,
        // required: [true]
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
    }
});
tDebitoShema.pre('save', function (next) {
    this.created = new Date();
    this.idUsuarioCreacion = 1;
    next();
});
exports.TDebito = (0, mongoose_1.model)('TDebito', tDebitoShema);
