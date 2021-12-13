"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverport = 3000 || Number(process.env.PORT) || 3000;
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/gastosBD';
class Server {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
        this.port = serverport;
        this.db = db;
    }
    start(res) {
        this.app.listen(this.port, res);
    }
}
exports.default = Server;
