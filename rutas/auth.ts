import { Router, Request, Response } from "express"
import { check } from 'express-validator'
import { validarCampos } from "../middelwares/validar-campos"
import { Usuario } from "../models/usuario"
import { generarJWT } from "../helpers/generar-jwt"
import { validarJWT } from "../middelwares/validar-jwt"

const bcryptjs = require('bcryptjs')
const auth = Router()

auth.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], async (req: Request, res: Response) => {
    const { correo, password } = req.body
    try {
        //Verificar si el usuario existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario asociado a ese correo'
            })
        }
        //Verificar si el usuario esta activo
        if (!usuario.activo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario seencuentra inactivo'
            })
        }
        //Verificar la contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password)
        if (!validPass) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña no es correcta'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            mensaje: '',
            data: {
                usuario,
                token
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            mensaje: 'Algo salio mal'
        })
    }

})

auth.get('/renew', [
    validarJWT
], async (req: any, res: Response) => {
    const { _id } = req.usuario

    // Leer la base de datos
    const usuario = await Usuario.findById(_id)

    // Generar el JWT
    const token = await generarJWT(_id)

    return res.json({
        ok: true,
        mensaje: '',
        data: {
            usuario,
            token
        }
    })
})

export default auth