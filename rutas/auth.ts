import { Router, Request, Response } from "express"
import { check } from 'express-validator'
import { validarCampos } from "../middelwares/validar-campos"
import { Usuario } from "../models/usuario"
import { generarJWT } from "../helpers/generar-jwt"

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
                mensaje: 'Usuario / password no son correctos'
            })
        }
        //Verificar si el usuario esta activo
        if (!usuario.activo) {
            return res.status(400).json({
                mensaje: 'Usuario / password no son correctos'
            })
        }
        //Verificar la contraseña
        const validPass = bcryptjs.compareSync(password, usuario.password)
        if (!validPass) {
            return res.status(400).json({
                mensaje: 'Usuario / password no son correctos'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id)

        res.json({
            msg: 'LoginOk',
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        })
    }

})



export default auth