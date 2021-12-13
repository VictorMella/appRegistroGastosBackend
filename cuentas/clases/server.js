"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverport = Number(process.env.PORT) || 3000;
const db = 'mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD?retryWrites=true&w=majority' || 'mongodb://localhost:27017/gastosBD';
//mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD
//mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD?retryWrites=true&w=majority
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
