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
const tCredito_1 = require("../models/tCredito");
const crear_ledger_router_1 = require("../helpers/crear-ledger-router");
const moment = require('moment');
const tCreditoRutas = (0, crear_ledger_router_1.crearLedgerRouter)(tCredito_1.TCredito, {
    nombreListado: 'registrosTCredito',
    filtrosExtra: (query) => ({ nacional: query.registrosNacionales }),
    crearRegistro: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payloadsCuotas = construirCuotasCredito(req.body);
            const registros = yield Promise.all(payloadsCuotas.map(payload => tCredito_1.TCredito.create(payload)));
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: registros
            });
        }
        catch (err) {
            console.log(err);
            res.json({
                ok: false,
                mensaje: 'No se pudo crear el registro',
                data: []
            });
        }
    }),
    construirPayloadActualizacion: (body) => (Object.assign({ monto: body.monto, tipo: body.tipo, cuotas: body.cuotas, nCuota: body.nCuotas, facturacionInmediata: body.facturacionInmediata, descripcion: body.descripcion, fechaCompra: body.fechaCompra }, (0, crear_ledger_router_1.parseMesAnio)(body.fechaCompra))),
    eliminarRegistro: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const identificador = req.body.identificador;
        const registros = yield tCredito_1.TCredito.find({ identificador });
        if (registros.length === 0) {
            return res.json({ ok: false, mensaje: 'Datos incorrectos', data: [] });
        }
        if (registros[0].idUsuarioCreacion !== req.usuario.identificador) {
            return res.status(403).json({ ok: false, mensaje: 'No tiene permisos sobre este registro', data: [] });
        }
        yield Promise.all(registros.map(registro => tCredito_1.TCredito.findByIdAndUpdate(registro._id, { activo: false })));
        res.json({ ok: true, mensaje: 'Registro eliminado correctamente', data: [] });
    })
});
/** Construye un payload de TCredito por cada cuota del registro. */
const construirCuotasCredito = (lsRegistro) => {
    const identificador = makeRandomId(12);
    const totalCompra = lsRegistro.monto;
    const cuotas = lsRegistro.cuotas;
    if (cuotas === 1) {
        const date = lsRegistro.fechaCompra.toString();
        return [Object.assign(Object.assign({}, lsRegistro), { facturacionInmediata: true, mes: parseInt(date.split('-')[1]), anio: parseInt(date.split('-')[0]), identificador, nCuota: 1, totalCompra })];
    }
    const payloadsCuotas = [];
    const valorAddMes = lsRegistro.facturacionInmediata ? 0 : 1;
    for (let contador = 0; contador < cuotas; contador++) {
        const addNewMes = moment(new Date(lsRegistro.fechaCompra)).add(contador + valorAddMes, 'months');
        const formatMes = moment(addNewMes).format('YYYY-MM-DD').toString();
        const anio = parseInt(formatMes.split('-')[0]);
        const mes = parseInt(formatMes.split('-')[1]);
        payloadsCuotas.push(Object.assign(Object.assign({}, lsRegistro), { mes,
            anio, nCuota: contador + 1, monto: Math.round(totalCompra / cuotas), identificador,
            totalCompra }));
    }
    return payloadsCuotas;
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
