import { Router, Request, Response } from "express"
import { check } from 'express-validator'
import { validarCampos } from "../middelwares/validar-campos"


const auth = Router()

auth.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], (req: Request, res: Response) => { 
    try {

        //Verificar si el usuario existe

        //Verificar siel usuario esta activo

        //Verificar la contraseña

        //Generar JWT
        
    const { correo, password } = req.body
    res.json({
        msg: 'LoginOk',
        correo, 
        password
    })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        });
    }

})



export default auth