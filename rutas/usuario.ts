import { Router, Request, Response } from "express"
import { check } from 'express-validator'
import { cantidadUsuarios, emailExiste, existeUsuarioPorId } from "../helpers/db-validators"
import { validarCampos } from "../middelwares/validar-campos"
import { Usuario } from "../models/usuario"

const bcryptjs = require('bcryptjs')
const usuario = Router()

usuario.post('/create', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('correo').custom(emailExiste),
    validarCampos
], async (req: Request, res: Response) => {
    try {
        const { nombre, correo, password } = req.body
        const usuario = new Usuario({ nombre, correo, password })

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        usuario.password = bcryptjs.hashSync(password, salt)

        //Crear identificador del usuario
        usuario.identificador = await cantidadUsuarios()

        // Guardar en BD
        await Usuario.create(usuario)
            .then(user => {
                res.json({
                    ok: true,
                    mensaje: `${user.nombre} Registro creado correctamente`,
                    data: [user]
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
            mensaje: 'Algo salio mal'
        })
    }
})


usuario.post('/edit', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos
], (req: Request, res: Response) => {
    try {
        const { _id, password, google, correo, ...resto } = req.body;

        if (password) {
            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync()
            resto.password = bcryptjs.hashSync(password, salt)
        }

        // Guardar en BD
        Usuario.findByIdAndUpdate(_id, resto, { new: true }, (err, usuarioEditado) => {
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

export default usuario