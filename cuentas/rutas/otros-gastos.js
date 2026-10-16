"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otros_gastos_1 = require("../models/otros-gastos");
const crear_ledger_router_1 = require("../helpers/crear-ledger-router");
const otrosGastosRutas = (0, crear_ledger_router_1.crearLedgerRouter)(otros_gastos_1.OtrosGastos, {
    nombreListado: 'otrosGastos',
    calcularTotalMontoMes: (registros) => {
        const ingresos = registros.filter(item => item.tipo === 'Ingreso');
        const egresos = registros.filter(item => item.tipo === 'Egreso');
        return ingresos.reduce((acc, curr) => acc + curr.monto, 0) - egresos.reduce((acc, curr) => acc + curr.monto, 0);
    }
});
exports.default = otrosGastosRutas;
