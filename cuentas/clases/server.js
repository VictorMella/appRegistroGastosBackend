"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
class Server {
    constructor() {
        this.port = 3000;
        this.app = express_1.default();
        this.port = config_1.serverport;
        this.db = config_1.db;
    }
    start(res) {
        this.app.listen(this.port, res);
    }
}
exports.default = Server;
