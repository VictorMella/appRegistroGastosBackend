import { NextFunction, response, request } from "express"
import { Usuario } from "../models/usuario"
import { config } from '../config'
const jwt = require('jsonwebtoken')

export const validarJWT = async (req: any = request, res = response, next: NextFunction) => {

    const token = req.header('appToken')

    if (!token) {
        return res.status(401).json({
            ok: false,
            mensaje: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify(token, config.SECRETORPRIVATEKEY)
        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid)

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (!usuario.activo) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no válido - usuario con estado: false'
            })
        }

        req.usuario = usuario
    
        next()

    } catch (error) {

        console.log(error)
        res.status(401).json({
            ok: false,
            mensaje: 'Token no válido'
        })
    }
}

