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
exports.crearLedgerRouter = exports.parseMesAnio = void 0;
const express_1 = require("express");
const validar_jwt_1 = require("../middelwares/validar-jwt");
const validar_propietario_1 = require("../middelwares/validar-propietario");
const parseMesAnio = (fechaCompra) => ({
    mes: parseInt(fechaCompra.split('-')[1]),
    anio: parseInt(fechaCompra.split('-')[0])
});
exports.parseMesAnio = parseMesAnio;
const crearLedgerRouter = (RegistroModel, opciones) => {
    var _a, _b;
    const router = (0, express_1.Router)();
    router.use(validar_jwt_1.validarJWT);
    router.post('/crear-registro', (_a = opciones.crearRegistro) !== null && _a !== void 0 ? _a : ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const body = Object.assign(Object.assign({}, req.body), (0, exports.parseMesAnio)(req.body.fechaCompra));
            const registro = yield RegistroModel.create(body);
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: [registro]
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
    })));
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pagina = Number(req.query.pagina) || 1;
        const registrosPorPagina = Number(req.query.registrosPorPagina) || 10;
        const saltar = (pagina - 1) * registrosPorPagina;
        const filtro = Object.assign({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion }, (opciones.filtrosExtra ? opciones.filtrosExtra(req.query) : {}));
        const [registros, totalRegistros] = yield Promise.all([
            RegistroModel.find(filtro).sort({ fechaCompra: -1 }).skip(saltar).limit(registrosPorPagina).exec(),
            RegistroModel.find(filtro).exec()
        ]);
        const totalMontoMes = opciones.calcularTotalMontoMes
            ? opciones.calcularTotalMontoMes(totalRegistros)
            : totalRegistros.reduce((acc, curr) => acc + curr.monto, 0);
        res.json({
            ok: totalRegistros.length > 0,
            mensaje: totalRegistros.length ? '' : 'Busqueda sin resultados',
            data: [{
                    pagina,
                    cantidadRegistros: registros.length,
                    registrosPorPagina,
                    totalRegistros: totalRegistros.length,
                    [opciones.nombreListado]: registros,
                    totalMontoMes
                }]
        });
    }));
    router.get('/anio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const filtro = Object.assign({ activo: true, idUsuarioCreacion: req.query.idUsuarioCreacion }, (opciones.filtrosExtra ? opciones.filtrosExtra(req.query) : {}));
        const registros = yield RegistroModel.find(filtro).sort({ anio: -1 }).exec();
        res.json({
            ok: true,
            mensaje: '',
            data: [...new Set(registros.filter(item => item.anio).map(item => item.anio))]
        });
    }));
    router.post('/update', (0, validar_propietario_1.validarPropietarioPorId)(RegistroModel), (req, res) => {
        const payload = opciones.construirPayloadActualizacion
            ? opciones.construirPayloadActualizacion(req.body)
            : Object.assign(Object.assign({}, req.body), (0, exports.parseMesAnio)(req.body.fechaCompra));
        RegistroModel.findByIdAndUpdate(req.body._id, payload, { new: true })
            .then(registro => {
            if (!registro) {
                return res.json({ ok: false, mensaje: 'Datos incorrectos', data: [] });
            }
            res.json({ ok: true, mensaje: 'Registro actualizado correctamente', data: [registro] });
        })
            .catch(err => {
            console.log(err);
            res.json({ ok: false, mensaje: 'No se pudo actualizar el registro', data: [] });
        });
    });
    router.post('/delete', (_b = opciones.eliminarRegistro) !== null && _b !== void 0 ? _b : [
        (0, validar_propietario_1.validarPropietarioPorId)(RegistroModel),
        (req, res) => {
            RegistroModel.findByIdAndUpdate(req.body._id, { activo: false }, { new: true })
                .then(registro => {
                if (!registro) {
                    return res.json({ ok: false, mensaje: 'Datos incorrectos', data: [] });
                }
                res.json({ ok: true, mensaje: 'Registro eliminado correctamente', data: [registro] });
            })
                .catch(err => {
                console.log(err);
                res.json({ ok: false, mensaje: 'No se pudo eliminar el registro', data: [] });
            });
        }
    ]);
    return router;
};
exports.crearLedgerRouter = crearLedgerRouter;
