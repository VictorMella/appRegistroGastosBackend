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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const db_validators_1 = require("../helpers/db-validators");
const validar_campos_1 = require("../middelwares/validar-campos");
const usuario_1 = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const usuario = express_1.Router();
usuario.post('/create', [
    express_validator_1.check('id', 'No es un ID válido').isMongoId(),
    express_validator_1.check('id').custom(db_validators_1.existeUsuarioPorId),
    express_validator_1.check('correo').custom(db_validators_1.emailExiste),
    validar_campos_1.validarCampos
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, correo, password } = req.body;
        const usuario = new usuario_1.Usuario({ nombre, correo, password });
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
        //Crear identificador del usuario
        usuario.identificador = yield db_validators_1.cantidadUsuarios();
        // Guardar en BD
        yield usuario_1.Usuario.create(usuario)
            .then(user => {
            res.json({
                ok: true,
                mensaje: `${user.nombre} Registro creado correctamente`,
                data: [user]
            });
        })
            .catch(err => {
            res.json({
                ok: false,
                mensaje: err,
                data: []
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        });
    }
}));
usuario.post('/edit', [
    express_validator_1.check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    express_validator_1.check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    express_validator_1.check('correo', 'El correo no es válido').isEmail(),
    express_validator_1.check('correo').custom(db_validators_1.emailExiste),
    validar_campos_1.validarCampos
], (req, res) => {
    try {
        const _a = req.body, { _id, password, google, correo } = _a, resto = __rest(_a, ["_id", "password", "google", "correo"]);
        if (password) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }
        // Guardar en BD
        usuario_1.Usuario.findByIdAndUpdate(_id, resto, { new: true }, (err, usuarioEditado) => {
            if (err)
                throw err;
            if (!usuarioEditado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Datos incorrectos',
                    data: []
                });
            }
            res.json({
                ok: true,
                mensaje: 'Registro actualizado correctamente',
                data: [usuarioEditado]
            });
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        });
    }
});
usuario.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsuarios = yield usuario_1.Usuario.find({ activo: true });
        res.json({
            ok: true,
            mensaje: '',
            data: [totalUsuarios]
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        });
    }
}));
exports.default = usuario;
