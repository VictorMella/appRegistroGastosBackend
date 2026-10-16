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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const server_1 = __importDefault(require("./clases/server"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const t_debito_1 = __importDefault(require("./rutas/t-debito"));
const t_creditoNacional_1 = __importDefault(require("./rutas/t-creditoNacional"));
const auth_1 = __importDefault(require("./rutas/auth"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const otros_gastos_1 = __importDefault(require("./rutas/otros-gastos"));
const conectar_db_1 = require("./db/conectar-db");
const server = new server_1.default;
//BODY PARSER
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
const iniciar = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, conectar_db_1.conectarDB)();
    //Rutas del proyecto
    server.app.use(express_1.default.static(path_1.default.join((__dirname + '/public'))));
    server.app.use('/auth', auth_1.default);
    server.app.use('/usuario', usuario_1.default);
    server.app.use('/debito', t_debito_1.default);
    server.app.use('/credito', t_creditoNacional_1.default);
    server.app.use('/otros-gastos', otros_gastos_1.default);
    //Levantar servidor
    server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`));
});
iniciar().catch(err => {
    console.error('No se pudo conectar a la base de datos', err);
    process.exit(1);
});
