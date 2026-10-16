import { NextFunction, Response } from "express"
import { Model } from "mongoose"

/**
 * Verifica que el registro referenciado por `req.body._id` pertenezca al usuario
 * autenticado (comparando `idUsuarioCreacion` contra `req.usuario.identificador`)
 * antes de permitir que el handler de update/delete continúe.
 */
export const validarPropietarioPorId = (RegistroModel: Model<any>) => {
    return async (req: any, res: Response, next: NextFunction) => {
        const registro = await RegistroModel.findById(req.body._id)

        if (!registro) {
            // Dejar que el handler responda "Datos incorrectos" como antes
            return next()
        }

        if (registro.idUsuarioCreacion !== req.usuario.identificador) {
            return res.status(403).json({
                ok: false,
                mensaje: 'No tiene permisos sobre este registro',
                data: []
            })
        }

        next()
    }
}
