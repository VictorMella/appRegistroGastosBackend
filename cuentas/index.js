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
const server = new server_1.default;
//BODY PARSER
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    driverInfo: { name: 'Mongoose', version: '6.0.12' }
};
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(server.db, options);
//Rutas del proyecto
// server.app.use(express.static(path.join((__dirname + '/public'))))
server.app.use('/debito', t_debito_1.default);
server.app.use('/credito', t_creditoNacional_1.default);
//Levantar servidor
server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`));
