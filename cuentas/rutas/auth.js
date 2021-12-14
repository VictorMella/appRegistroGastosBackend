"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middelwares/validar-campos");
const auth = express_1.Router();
auth.post('/login', [
    express_validator_1.check('correo', 'El correo es obligatorio').isEmail(),
    express_validator_1.check('password', 'El password es obligatorio').not().isEmpty(),
    validar_campos_1.validarCampos
], (req, res) => {
    try {
        //Verificar si el usuario existe
        //Verificar siel usuario esta activo
        //Verificar la contraseña
        //Generar JWT
        const { correo, password } = req.body;
        res.json({
            msg: 'LoginOk',
            correo,
            password
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        });
    }
});
exports.default = auth;
