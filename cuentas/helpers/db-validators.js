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
exports.cantidadUsuarios = exports.existeUsuarioPorId = exports.emailExiste = void 0;
const usuario_1 = require("../models/usuario");
const emailExiste = (correo = '') => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el correo existe
    const existeEmail = yield usuario_1.Usuario.findOne({ correo, activo: true });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
});
exports.emailExiste = emailExiste;
const existeUsuarioPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el correo existe
    const existeUsuario = yield usuario_1.Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
});
exports.existeUsuarioPorId = existeUsuarioPorId;
const cantidadUsuarios = () => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el correo existe
    const totalRegistrosUsuario = yield usuario_1.Usuario.find({ activo: true })
        .exec();
    return totalRegistrosUsuario.length + 1;
});
exports.cantidadUsuarios = cantidadUsuarios;
