"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSearch = (obj) => {
    let payload = {
        activo: true
    };
    if (obj.mes !== '0') {
        payload.mes = parseInt(obj.mes);
    }
    if (obj.mes !== '0') {
        payload.anio = parseInt(obj.anio);
    }
    return payload;
};
