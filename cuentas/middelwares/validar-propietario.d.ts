import { NextFunction, Response } from "express";
import { Model } from "mongoose";
/**
 * Verifica que el registro referenciado por `req.body._id` pertenezca al usuario
 * autenticado (comparando `idUsuarioCreacion` contra `req.usuario.identificador`)
 * antes de permitir que el handler de update/delete continúe.
 */
export declare const validarPropietarioPorId: (RegistroModel: Model<any>) => (req: any, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
