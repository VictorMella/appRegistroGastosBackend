"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tDebito_1 = require("../models/tDebito");
const crear_ledger_router_1 = require("../helpers/crear-ledger-router");
const tDebitoRutas = (0, crear_ledger_router_1.crearLedgerRouter)(tDebito_1.TDebito, {
    nombreListado: 'registrosTDebito'
});
exports.default = tDebitoRutas;
