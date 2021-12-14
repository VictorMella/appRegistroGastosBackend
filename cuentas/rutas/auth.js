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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middelwares/validar-campos");
const usuario_1 = require("../models/usuario");
const generar_jwt_1 = require("../helpers/generar-jwt");
const bcryptjs = require('bcryptjs');
const auth = express_1.Router();
auth.post('/login', [
    express_validator_1.check('correo', 'El correo es obligatorio').isEmail(),
    express_validator_1.check('password', 'El password es obligatorio').not().isEmpty(),
    validar_campos_1.validarCampos
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, password } = req.body;
    try {
        //Verificar si el usuario existe
        const usuario = yield usuario_1.Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                mensaje: 'Usuario / password no son correctos'
            });
        }
        //Verificar si el usuario esta activo
        if (!usuario.activo) {
            return res.status(400).json({
                mensaje: 'Usuario / password no son correctos'
            });
        }
        //Verificar la contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                mensaje: 'Usuario / password no son correctos'
            });
        }
        //Generar JWT
        const token = yield generar_jwt_1.generarJWT(usuario.id);
        res.json({
            msg: 'LoginOk',
            usuario,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        });
    }
}));
exports.default = auth;
