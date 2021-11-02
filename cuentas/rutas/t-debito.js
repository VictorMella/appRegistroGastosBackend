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
const tDebito_1 = require("../models/tDebito");
const tDebitoRutas = (0, express_1.Router)();
//Crear registro
tDebitoRutas.post('/crear-registro', (req, res) => {
    const body = req.body;
    tDebito_1.TDebito.create(body)
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
tDebitoRutas.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let saltar = pagina - 1;
    const registrosPorPagina = 10;
    saltar = saltar * registrosPorPagina;
    const registrosTDebito = yield tDebito_1.TDebito.find()
        .sort({ _id: -1 })
        .skip(saltar)
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec();
    const totalRegistrosDebito = yield tDebito_1.TDebito.find()
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
tDebitoRutas.post('/update/:id', (req, res) => {
    const id = req.params.id;
    // const sobreMi = {
    //     texto1: req.body.texto1,
    //     texto2: req.body.texto2,
    //     texto3: req.body.texto3,
    //     texto4: req.body.texto4,
    //     texto5: req.body.texto5
    // }
    tDebito_1.TDebito.findByIdAndUpdate(id, { new: true }, (err, registroDebito) => {
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
exports.default = tDebitoRutas;
