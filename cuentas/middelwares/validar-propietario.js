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
exports.validarPropietarioPorId = void 0;
/**
 * Verifica que el registro referenciado por `req.body._id` pertenezca al usuario
 * autenticado (comparando `idUsuarioCreacion` contra `req.usuario.identificador`)
 * antes de permitir que el handler de update/delete continúe.
 */
const validarPropietarioPorId = (RegistroModel) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const registro = yield RegistroModel.findById(req.body._id);
        if (!registro) {
            // Dejar que el handler responda "Datos incorrectos" como antes
            return next();
        }
        if (registro.idUsuarioCreacion !== req.usuario.identificador) {
            return res.status(403).json({
                ok: false,
                mensaje: 'No tiene permisos sobre este registro',
                data: []
            });
        }
        next();
    });
};
exports.validarPropietarioPorId = validarPropietarioPorId;
