"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tCreditoInternacional_1 = require("../models/tCreditoInternacional");
const tCreditoRutasInternacional = (0, express_1.Router)();
//Crear registro
tCreditoRutasInternacional.post('/crear-registro', (req, res) => {
    const body = req.body;
    tCreditoInternacional_1.TCreditoInternacional.create(body)
        .then(registroDebito => {
        res.json({
            ok: true,
            registroDebito
        });
    })
        .catch(err => {
        res.json({
            err
        });
    });
});
// Registos paginados
tCreditoRutasInternacional.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let saltar = pagina - 1;
    const registrosPorPagina = 10;
    saltar = saltar * registrosPorPagina;
    const registrosTDebito = yield tCreditoInternacional_1.TCreditoInternacional.find({ activo: true })
        .sort({ _id: -1 })
        .skip(saltar)
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec();
    const totalRegistrosDebito = yield tCreditoInternacional_1.TCreditoInternacional.find({ activo: true })
        .exec();
    res.json({
        ok: true,
        pagina,
        cantidadRegistros: registrosTDebito.length,
        registrosPorPagina: registrosPorPagina,
        totalRegistros: totalRegistrosDebito.length,
        registrosTDebito,
    });
}));
// ACTUALIZAR 
tCreditoRutasInternacional.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const payload = {
        monto: req.body.monto,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        idUsuarioCreacion: req.body.idUsuarioCreacion,
        activo: req.body.activo
    };
    tCreditoInternacional_1.TCreditoInternacional.findByIdAndUpdate(id, payload, { new: true }, (err, registroDebito) => {
        if (err)
            throw err;
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos'
            });
        }
        res.json({
            ok: true,
            registroDebito
        });
    });
});
// Eliminar registro 
tCreditoRutasInternacional.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    const payload = {
        activo: true
    };
    tCreditoInternacional_1.TCreditoInternacional.findByIdAndUpdate(id, payload, { new: true }, (err, registroDebito) => {
        if (err)
            throw err;
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos'
            });
        }
        res.json({
            ok: true,
            registroDebito
        });
    });
});
exports.default = tCreditoRutasInternacional;
