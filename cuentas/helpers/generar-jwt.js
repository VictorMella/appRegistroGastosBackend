"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const config_1 = require("../config");
exports.generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, config_1.config.SECRETORPRIVATEKEY, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
};
