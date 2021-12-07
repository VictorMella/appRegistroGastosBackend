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
const tCredito_1 = require("../models/tCredito");
const moment = require('moment');
const tCreditoRutas = express_1.Router();
//Crear registro
tCreditoRutas.post('/crear-registro', (req, res) => {
    let body = formatPayloadLsCredito(req.body);
    tCredito_1.TCredito.create(body)
        .then(registroCredito => {
        res.json({
            ok: true,
            mensaje: 'Registro creado correctamente',
            data: [registroCredito]
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
tCreditoRutas.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let saltar = pagina - 1;
    const registrosPorPagina = Number(req.query.registrosPorPagina) || 10;
    saltar = saltar * registrosPorPagina;
    const registrosTCredito = yield tCredito_1.TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .sort({ fechaCompra: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec();
    const totalRegistrosCredito = yield tCredito_1.TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .exec();
    res.json({
        ok: true,
        mensaje: '',
        data: [{
                pagina,
                cantidadRegistros: registrosTCredito.length,
                registrosPorPagina: registrosPorPagina,
                totalRegistros: totalRegistrosCredito.length,
                registrosTCredito,
            }]
    });
}));
// // Años con registros
tCreditoRutas.get('/anio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const añosConRegistros = yield tCredito_1.TCredito.find({ activo: true })
        .sort({ anio: -1 }) // Ordenar lista
        .exec();
    res.json({
        ok: true,
        mensaje: '',
        data: [...new Set(añosConRegistros.filter(item => item.anio).map(item => item.anio))]
    });
}));
// ACTUALIZAR 
tCreditoRutas.post('/update/:id', (req, res) => {
    const payload = {
        id: req.body._id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        cuotas: req.body.cuotas,
        nCuota: req.body.nCuotas,
        facturacionInmediata: req.body.facturacionInmediata,
        descripcion: req.body.descripcion,
        fechaCompra: req.body.fechaCompra,
        mes: parseInt(req.body.fechaCompra.split('-')[1]),
        anio: parseInt(req.body.fechaCompra.split('-')[0])
    };
    tCredito_1.TCredito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroCredito) => {
        if (err)
            throw err;
        if (!registroCredito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            });
        }
        res.json({
            ok: true,
            mensaje: 'Registro actualizado correctamente',
            data: [registroCredito]
        });
    });
});
// Eliminar registro 
tCreditoRutas.post('/delete', (req, res) => {
    const payload = {
        activo: false,
        id: req.body._id
    };
    tCredito_1.TCredito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroCredito) => {
        if (err)
            throw err;
        if (!registroCredito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            });
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [registroCredito]
        });
    });
});
const formatPayloadLsCredito = (lsRegistro) => {
    const identificador = makeRandomId(12);
    let totalCompra = lsRegistro.monto;
    if (lsRegistro.cuotas === 1) {
        const date = lsRegistro.fechaCompra.toString();
        lsRegistro.facturacionInmediata = true;
        lsRegistro.mes = parseInt(date.split('-')[1]);
        lsRegistro.anio = parseInt(date.split('-')[0]);
        lsRegistro.identificador = identificador;
        lsRegistro.nCuota = 1;
        return lsRegistro;
    }
    if (lsRegistro.cuotas > 1) {
        let contador = 0;
        let cuotas = lsRegistro.cuotas, newMes = new Date(lsRegistro.fechaCompra);
        const valorAddMes = lsRegistro.facturacionInmediata ? 0 : 1;
        while (contador < cuotas) {
            const addNewMes = moment(newMes).add((contador + valorAddMes), 'months');
            const formatMes = moment(addNewMes).format('YYYY-MM-DD').toString();
            const addanio = parseInt(formatMes.split('-')[0]), addmes = parseInt(formatMes.split('-')[1]);
            lsRegistro.mes = addmes;
            lsRegistro.anio = addanio;
            lsRegistro.nCuota = contador + 1;
            lsRegistro.monto = Math.round(totalCompra / cuotas);
            lsRegistro.identificador = identificador;
            crearRegistros(lsRegistro);
            contador += 1;
        }
    }
};
const crearRegistros = (lsRegistro) => {
    let res;
    tCredito_1.TCredito.create(lsRegistro)
        .then(() => {
        console.log('registroCredito ok');
    })
        .catch(err => {
        console.log('badRequest', err);
    });
};
const makeRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.default = tCreditoRutas;
