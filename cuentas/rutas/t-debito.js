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
const tDebitoRutas = express_1.Router();
//Crear registro
tDebitoRutas.post('/crear-registro', (req, res) => {
    let body = req.body;
    body.mes = parseInt(body.fechaCompra.split('-')[1]);
    body.anio = parseInt(body.fechaCompra.split('-')[0]);
    tDebito_1.TDebito.create(body)
        .then(registroDebito => {
        res.json({
            ok: true,
            mensaje: 'Registro creado correctamente',
            data: [registroDebito]
        });
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: err,
            data: []
        });
    });
});
// Registos paginados
tDebitoRutas.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let saltar = pagina - 1;
    const registrosPorPagina = Number(req.query.registrosPorPagina) || 10;
    saltar = saltar * registrosPorPagina;
    const registrosTDebito = yield tDebito_1.TDebito.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .sort({ fechaCompra: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec();
    const totalRegistrosDebito = yield tDebito_1.TDebito.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .exec();
    res.json({
        ok: totalRegistrosDebito.length ? true : false,
        mensaje: totalRegistrosDebito.length ? '' : 'Busqueda sin resultados',
        data: [{
                pagina,
                cantidadRegistros: registrosTDebito.length,
                registrosPorPagina: registrosPorPagina,
                totalRegistros: totalRegistrosDebito.length,
                registrosTDebito,
            }]
    });
}));
// Años con registros
tDebitoRutas.get('/anio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const añosConRegistros = yield tDebito_1.TDebito.find({ activo: true })
            .sort({ anio: -1 }) // Ordenar lista    
            .exec();
        res.json({
            ok: true,
            mensaje: '',
            data: [...new Set(añosConRegistros.map(item => item.anio))]
        });
    }
    catch (err) {
        return res.json({
            ok: false,
            mensaje: 'Datos incorrectos',
            data: []
        });
    }
}));
// ACTUALIZAR 
tDebitoRutas.post('/update', (req, res) => {
    const payload = {
        id: req.body._id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        fechaCompra: req.body.fechaCompra,
        mes: parseInt(req.body.fechaCompra.split('-')[1]),
        anio: parseInt(req.body.fechaCompra.split('-')[0])
    };
    tDebito_1.TDebito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroDebito) => {
        if (err)
            throw err;
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            });
        }
        res.json({
            ok: true,
            mensaje: 'Registro actualizado correctamente',
            data: [registroDebito]
        });
    });
});
// Eliminar registro 
tDebitoRutas.post('/delete', (req, res) => {
    const payload = {
        activo: false,
        id: req.body._id
    };
    tDebito_1.TDebito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroDebito) => {
        if (err)
            throw err;
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            });
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [registroDebito]
        });
    });
});
exports.default = tDebitoRutas;
