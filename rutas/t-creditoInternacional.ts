import { Router, Request, Response } from "express"
import { TCreditoInternacional } from "../models/tCreditoInternacional"

const tCreditoRutasInternacional = Router()

//Crear registro
tCreditoRutasInternacional.post('/crear-registro', (req: Request, res: Response) => {
    const body = req.body
    TCreditoInternacional.create(body)
        .then(registroDebito => {
            res.json({
                ok: true,
                registroDebito
            })
        })
        .catch(err => {
            res.json({
                err
            })
        })

})

// Registos paginados
tCreditoRutasInternacional.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1
    let saltar = pagina - 1
    const registrosPorPagina = 10
    saltar = saltar * registrosPorPagina
    const registrosTDebito = await TCreditoInternacional.find( { activo: true } )
        .sort({ _id: -1 })
        .skip(saltar)
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec()
    const totalRegistrosDebito = await TCreditoInternacional.find({ activo: true })    
        .exec()

    res.json({
        ok: true,
        pagina,
        cantidadRegistros: registrosTDebito.length,
        registrosPorPagina: registrosPorPagina,
        totalRegistros: totalRegistrosDebito.length,
        registrosTDebito,
    })
})

// ACTUALIZAR 
tCreditoRutasInternacional.post('/update/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const payload = {
        monto: req.body.monto,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        idUsuarioCreacion: req.body.idUsuarioCreacion,
        activo: req.body.activo
    }

    TCreditoInternacional.findByIdAndUpdate(id, payload, { new: true }, (err, registroDebito) => {
        if (err) throw err
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos'
            })
        }
        res.json({
            ok: true,
            registroDebito
        })
    })
})
// Eliminar registro 
tCreditoRutasInternacional.post('/delete/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const payload = {
        activo: true
    }

    TCreditoInternacional.findByIdAndUpdate(id, payload, { new: true }, (err, registroDebito) => {
        if (err) throw err
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos'
            })
        }
        res.json({
            ok: true,
            registroDebito
        })
    })
})

export default tCreditoRutasInternacional