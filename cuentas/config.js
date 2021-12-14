"use strict";
module.exports = {
    // base: 'mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD?retryWrites=true&w=majority' || 'mongodb://localhost:27017/gastosBD',
    serverport: Number(process.env.PORT) || 3000,
    db: 'mongodb://localhost:27017/gastosBD',
};
