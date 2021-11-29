import { Router, Request, Response } from "express"
import { TDebito } from "../models/tDebito"

const tDebitoRutas = Router()

//Crear registro
tDebitoRutas.post('/crear-registro', (req: Request, res: Response) => {
    let body = req.body
    body.mes = parseInt(body.fechaCompra.split('-')[1])
    body.anio = parseInt(body.fechaCompra.split('-')[0])
    TDebito.create(body)
        .then(registroDebito => {
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: [registroDebito]
            })
        })
        .catch(err => {
            res.json({
                ok: false,
                mensaje: err,
                data: []
            })
        })

})

// Registos paginados
tDebitoRutas.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1
    let saltar = pagina - 1
    const registrosPorPagina = req.query.registrosPorPagina
    saltar = saltar * registrosPorPagina
    const registrosTDebito = await TDebito.find( { activo: true } )
        .sort({ _id: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec()
    const totalRegistrosDebito = await TDebito.find({ activo: true })    
        .exec()

    res.json({
        ok: true,
        mensaje: '',
        data: [{
            pagina,
            cantidadRegistros: registrosTDebito.length,
            registrosPorPagina: registrosPorPagina,
            totalRegistros: totalRegistrosDebito.length,
            registrosTDebito,
        }]      
    })
})

// ACTUALIZAR 
tDebitoRutas.post('/update', (req: Request, res: Response) => {
    const payload = {
        id: req.body.id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        idUsuarioCreacion: req.body.idUsuarioCreacion,
        activo: req.body.activo
    }

    TDebito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroDebito) => {
        if (err) throw err
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro actualizado correctamente',
            data: [registroDebito]
        })
    })
})
// Eliminar registro 
tDebitoRutas.post('/delete', (req: Request, res: Response) => {
    const payload = {
        activo: false,
        id: req.body._id
    }
    TDebito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroDebito) => {
        if (err) throw err
        if (!registroDebito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [registroDebito]
        })
    })
})

export default tDebitoRutas