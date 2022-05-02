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
const otros_gastos_1 = require("../models/otros-gastos");
const otrosGastosRutas = (0, express_1.Router)();
//Crear registro
otrosGastosRutas.post('/crear-registro', (req, res) => {
    let body = req.body;
    console.log(body);
    body.mes = parseInt(body.fechaCompra.split('-')[1]);
    body.anio = parseInt(body.fechaCompra.split('-')[0]);
    otros_gastos_1.OtrosGastos.create(body)
        .then(otrosGastos => {
        res.json({
            ok: true,
            mensaje: 'Registro creado correctamente',
            data: [otrosGastos]
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
otrosGastosRutas.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let saltar = pagina - 1;
    const registrosPorPagina = Number(req.query.registrosPorPagina) || 10;
    saltar = saltar * registrosPorPagina;
    const otrosGastos = yield otros_gastos_1.OtrosGastos.find({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .sort({ fechaCompra: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec();
    const totalRegistrosOtrosGastos = yield otros_gastos_1.OtrosGastos.find({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .exec();
    const totalMontoMesOtrosGastos = yield otros_gastos_1.OtrosGastos.find({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .exec();
    const ingresos = totalMontoMesOtrosGastos.filter(item => item.tipo === 'Ingreso');
    const egresos = totalMontoMesOtrosGastos.filter(item => item.tipo === 'Egreso');
    res.json({
        ok: totalRegistrosOtrosGastos.length ? true : false,
        mensaje: totalRegistrosOtrosGastos.length ? '' : 'Busqueda sin resultados',
        data: [{
                pagina,
                cantidadRegistros: otrosGastos.length,
                registrosPorPagina: registrosPorPagina,
                totalRegistros: totalRegistrosOtrosGastos.length,
                otrosGastos,
                totalMontoMes: ingresos.reduce((acc, curr) => acc + curr.monto, 0) - egresos.reduce((acc, curr) => acc + curr.monto, 0)
            }]
    });
}));
// Años con registros
otrosGastosRutas.get('/anio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const añosConRegistros = yield otros_gastos_1.OtrosGastos.find({ activo: true, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .sort({ anio: -1 }) // Ordenar lista
        .exec();
    res.json({
        ok: true,
        mensaje: '',
        data: [...new Set(añosConRegistros.map(item => item.anio))]
    });
}));
// ACTUALIZAR 
otrosGastosRutas.post('/update', (req, res) => {
    const payload = {
        id: req.body._id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        fechaCompra: req.body.fechaCompra,
        mes: parseInt(req.body.fechaCompra.split('-')[1]),
        anio: parseInt(req.body.fechaCompra.split('-')[0])
    };
    otros_gastos_1.OtrosGastos.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroOtrosGastos) => {
        if (err)
            throw err;
        if (!registroOtrosGastos) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            });
        }
        res.json({
            ok: true,
            mensaje: 'Registro actualizado correctamente',
            data: [registroOtrosGastos]
        });
    });
});
// Eliminar registro 
otrosGastosRutas.post('/delete', (req, res) => {
    const payload = {
        activo: false,
        id: req.body._id
    };
    otros_gastos_1.OtrosGastos.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroOtrosGastos) => {
        if (err)
            throw err;
        if (!registroOtrosGastos) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            });
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [registroOtrosGastos]
        });
    });
});
exports.default = otrosGastosRutas;
