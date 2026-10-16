"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require('dotenv').config();
exports.config = {
    serverport: Number(process.env.PORT) || 3000,
    db: process.env.DB_CNN || 'mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD?retryWrites=true&w=majority',
    SECRETORPRIVATEKEY: process.env.SECRETORPRIVATEKEY || 'E5M1CAV3'
};
