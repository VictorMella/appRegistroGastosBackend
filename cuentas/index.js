"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./clases/server"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const t_debito_1 = __importDefault(require("./rutas/t-debito"));
const t_creditoNacional_1 = __importDefault(require("./rutas/t-creditoNacional"));
const t_creditoInternacional_1 = __importDefault(require("./rutas/t-creditoInternacional"));
const key = require('./environment/environment');
const server = new server_1.default;
//BODY PARSER
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
server.app.use((req, res, next) => {
    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
const options = {
    useNewUrlParser: true
};
//CONECTAR BD
// let mongoDB: string
// if (process.env && process.env.NODE_ENV === 'production') {
//     mongoDB = `mongodb+srv://AdminRegister:${key}@registrocuentas.09jiw.mongodb.nett/gastosBD`
// } else {
//     mongoDB = 'mongodb://localhost:27017/gastosBD'
// }
mongoose_1.default.connect('mongodb://localhost:27017/gastosBD', options);
//Rutas del proyecto
server.app.use(express_1.default.static(path_1.default.join((__dirname + '/public'))));
server.app.use('/debito', t_debito_1.default);
server.app.use('/credito', t_creditoNacional_1.default);
server.app.use('/internacional', t_creditoInternacional_1.default);
//Levantar servidor
server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`));
