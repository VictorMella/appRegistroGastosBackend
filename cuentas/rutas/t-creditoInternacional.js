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
const tCreditoInternacionalRutas = express_1.Router();
//Crear registro
tCreditoInternacionalRutas.post('/crear-registro', (req, res) => {
    let body = formatPayloadLsCredito(req.body);
    tCreditoInternacional_1.TCreditoInternacional.create(body)
        .then(registroCreditoInternacional => {
        res.json({
            ok: true,
            registroCreditoInternacional
        });
    })
        .catch(err => {
        res.json({
            err
        });
    });
});
// Registos paginados
tCreditoInternacionalRutas.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let saltar = pagina - 1;
    const registrosPorPagina = 10;
    saltar = saltar * registrosPorPagina;
    const registrosTCreditoInternacional = yield tCreditoInternacional_1.TCreditoInternacional.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .sort({ _id: -1 })
        .skip(saltar)
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec();
    const totalRegistrosCreditoInternacional = yield tCreditoInternacional_1.TCreditoInternacional.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .exec();
    res.json({
        ok: totalRegistrosCreditoInternacional.length ? true : false,
        mensaje: totalRegistrosCreditoInternacional.length ? '' : 'Busqueda sin resultados',
        data: [{
                pagina,
                cantidadRegistros: registrosTCreditoInternacional.length,
                registrosPorPagina: registrosPorPagina,
                totalRegistros: totalRegistrosCreditoInternacional.length,
                registrosTCreditoInternacional,
            }]
    });
}));
// ACTUALIZAR 
tCreditoInternacionalRutas.post('/update/:id', (req, res) => {
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
tCreditoInternacionalRutas.get('/anio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const añosConRegistros = yield tCreditoInternacional_1.TCreditoInternacional.find({ activo: true })
        .sort({ anio: -1 }) // Ordenar lista
        .exec();
    res.json({
        ok: true,
        mensaje: '',
        data: [...new Set(añosConRegistros.filter(item => item.anio).map(item => item.anio))]
    });
}));
// Eliminar registro 
tCreditoInternacionalRutas.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    const payload = {
        activo: true
    };
    tCreditoInternacional_1.TCreditoInternacional.findByIdAndUpdate(id, payload, { new: true }, (err, registroCreditoInternacional) => {
        if (err)
            throw err;
        if (!registroCreditoInternacional) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos'
            });
        }
        res.json({
            ok: true,
            registroCreditoInternacional
        });
    });
});
const formatPayloadLsCredito = (lsRegistro) => {
    const identificador = makeRandomId(12);
    const date = lsRegistro.fechaCompra.toString();
    lsRegistro.facturacionInmediata = true;
    lsRegistro.mes = parseInt(date.split('-')[1]);
    lsRegistro.anio = parseInt(date.split('-')[0]);
    lsRegistro.identificador = identificador;
    lsRegistro.nCuota = 1;
    return lsRegistro;
};
const makeRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.default = tCreditoInternacionalRutas;
