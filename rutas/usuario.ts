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
                console.log(err)
                res.json({
                    ok: false,
                    mensaje: 'No se pudo crear el usuario',
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
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('uid', 'No es un ID válido').isMongoId(),
    check('uid').custom( existeUsuarioPorId ),
    check('correo').custom(emailExiste),
    validarCampos
], (req: any, res: Response) => {
    try {
        if (req.body.uid !== String(req.usuario._id)) {
            return res.status(403).json({
                ok: false,
                mensaje: 'No tiene permisos para editar este usuario'
            })
        }
        const { uid, password, google, correo, ...resto } = req.body;
        if (password) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync()
            resto.password = bcryptjs.hashSync(password, salt)
            resto.correo = correo
        }

        // Guardar en BD
        Usuario.findByIdAndUpdate(uid, resto, { new: true })
            .then(usuarioEditado => {
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
            .catch(error => {
                console.log(error)
                res.status(400).json({
                    ok: false,
                    mensaje: 'Algo salio mal'
                })
            })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            mensaje: 'Algo salio mal'
        })
    }
})

usuario.get('/', [validarJWT], async(req: Request, res: Response) => {
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
],(req: any, res: Response) => {
    if (req.body.uid !== String(req.usuario._id)) {
        return res.status(403).json({
            ok: false,
            mensaje: 'No tiene permisos para eliminar este usuario'
        })
    }
    Usuario.findByIdAndUpdate(req.body.uid, { activo: false }, { new: true })
        .then(usuarioBorrado => {
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
        .catch(error => {
            console.log(error)
            res.status(400).json({
                ok: false,
                mensaje: 'Algo salio mal'
            })
        })
})

export default usuario