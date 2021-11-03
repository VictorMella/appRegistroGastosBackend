"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./clases/server"));
const cors_1 = __importDefault(require("cors"));
const t_debito_1 = __importDefault(require("./rutas/t-debito"));
const t_creditoNacional_1 = __importDefault(require("./rutas/t-creditoNacional"));
const t_creditoInternacional_1 = __importDefault(require("./rutas/t-creditoInternacional"));
const server = new server_1.default;
//BODY PARSER
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
const options = {
    useNewUrlParser: true
};
//CONECTAR BD
mongoose_1.default.connect('mongodb://localhost:27017/gastosBD', options);
//Rutas del proyecto
server.app.use('/debito', t_debito_1.default);
server.app.use('/credito', t_creditoNacional_1.default);
server.app.use('/credito-internacional', t_creditoInternacional_1.default);
//Levantar servidor
server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`));
