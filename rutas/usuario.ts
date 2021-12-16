import { Router, Request, Response } from "express"
import { check } from 'express-validator'
import { cantidadUsuarios, emailExiste, existeUsuarioPorId } from "../helpers/db-validators"
import { generarJWT } from "../helpers/generar-jwt"
import { validarCampos } from "../middelwares/validar-campos"
import { validarJWT } from "../middelwares/validar-jwt"
import { Usuario } from "../models/usuario"

const bcryptjs = require('bcryptjs')
const usuario = Router()

usuario.post('/create', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('correo').custom( emailExiste ),
    validarCampos
], async (req: Request, res: Response) => {
    try {
        const { nombre, correo, password } = req.body
        const usuario = new Usuario({nombre, correo, password})
           //Verificar si el usuario existe
           const usuarioExiste = await Usuario.find({ correo, activo: true })
           if (usuarioExiste.length >0) {
               return res.status(400).json({
                   ok: false,
                   mensaje: 'Existe un usuario activo asociado a ese correo'
               })
           }

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        usuario.password = bcryptjs.hashSync(password, salt)

        //Crear identificador del usuario
        usuario.identificador = await cantidadUsuarios()

         // Generar el JWT
         const token = await generarJWT( usuario.id );

        // Guardar en BD
        await Usuario.create(usuario)
            .then(usuario => {
                res.json({
                    ok: true,
                    mensaje: `${usuario.nombre} Registro creado correctamente`,
                    data: {
                        token
                    }
                })
            })
            .catch(err => {
                res.json({
                    ok: false,
                    mensaje: err,
                    data: []
                })
            })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            ok: false,
            mensaje: 'Algo salio mal'
        })
    }
})


usuario.post('/edit', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('uid', 'No es un ID válido').isMongoId(),
    check('uid').custom( existeUsuarioPorId ),
    check('correo').custom(emailExiste),
    validarCampos
], (req: Request, res: Response) => {
    try {
        const { uid, password, google, correo, ...resto } = req.body;
    console.log(req.body)
        if (password) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync()
            resto.password = bcryptjs.hashSync(password, salt)
            resto.correo = correo
        }

        // Guardar en BD
        Usuario.findByIdAndUpdate(uid, resto, { new: true }, (err, usuarioEditado) => {
            if (err) throw err
            if (!usuarioEditado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Datos incorrectos',
                    data: []
                })
            }
            res.json({
                ok: true,
                mensaje: 'Registro actualizado correctamente',
                data: [usuarioEditado]
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        })
    }
})

usuario.get('/', async(req: Request, res: Response) => {
    try {
        const totalUsuarios = await Usuario.find({ activo: true })
        res.json({
            ok: true,
            mensaje: '',
            data: [totalUsuarios]
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        })
    }
})

usuario.post('/delete', [
    validarJWT,
    check('uid', 'No es un ID válido').isMongoId(),
    check('uid').custom( existeUsuarioPorId ),
    validarCampos
],(req: Request, res: Response) => {
    const payload = {
        activo: false,
        id: req.body.uid
    }
    Usuario.findByIdAndUpdate(payload.id, payload, { new: true }, (err, usuarioBorrado) => {
        if (err) throw err
        if (!usuarioBorrado) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [usuarioBorrado]
        })
    })
})

export default usuario