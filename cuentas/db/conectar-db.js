"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conectarDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    driverInfo: { name: 'Mongoose', version: '6.0.12' }
};
// Cacheado a nivel de módulo: sobrevive entre invocaciones dentro del mismo
// proceso/contenedor (local, y en Vercel mientras el lambda siga "tibio").
let conexion = null;
const conectarDB = () => {
    if (mongoose_1.default.connection.readyState === 1) {
        // ya conectado (p.ej. invocación reentrante en el mismo proceso)
        return Promise.resolve(mongoose_1.default);
    }
    if (!conexion) {
        mongoose_1.default.Promise = global.Promise;
        conexion = mongoose_1.default.connect(config_1.config.db, options);
    }
    return conexion;
};
exports.conectarDB = conectarDB;
