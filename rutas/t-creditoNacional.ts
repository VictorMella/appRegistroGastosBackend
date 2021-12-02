import { Router, Request, Response } from "express"
import { DtoPayloadCredito } from "../interfaces/i-payloadCredito.interface"
import { TCredito } from "../models/tCredito"

const tCreditoRutas = Router()

//Crear registro
tCreditoRutas.post('/crear-registro', (req: Request, res: Response) => {
    let body = req.body
    body.mes = parseInt(body.fechaCompra.split('-')[1])
    body.anio = parseInt(body.fechaCompra.split('-')[0])
    TCredito.create(body)
        .then(registroCredito => {
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: [registroCredito]
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
tCreditoRutas.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1
    let saltar = pagina - 1
    const registrosPorPagina = Number(req.query.registrosPorPagina) || 10
    saltar = saltar * registrosPorPagina
    const registrosTCredito = await TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .sort({ fechaCompra: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec()
    const totalRegistrosCredito = await TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .exec()

    res.json({
        ok: true,
        mensaje: '',
        data: [{
            pagina,
            cantidadRegistros: registrosTCredito.length,
            registrosPorPagina: registrosPorPagina,
            totalRegistros: totalRegistrosCredito.length,
            registrosTCredito,
        }]
    })
})

// Años con registros
tCreditoRutas.get('/anio', async (req: any, res: Response) => {
    const añosConRegistros = await TCredito.find({ activo: true })
        .sort({ anio: -1 }) // Ordenar lista    
        .exec()

    res.json({
        ok: true,
        mensaje: '',
        data: [... new Set(añosConRegistros.map(item => item.anio))]
    })
})

// ACTUALIZAR 
tCreditoRutas.post('/update/:id', (req: Request, res: Response) => {
    const payload: DtoPayloadCredito = {
        id: req.body._id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        cuotas: req.body.cuotas,
        facturacionInmediata: req.body.facturacionInmediata,
        descripcion: req.body.descripcion,
        fechaCompra: req.body.fechaCompra,
        mes: parseInt(req.body.fechaCompra.split('-')[1]),
        anio: parseInt(req.body.fechaCompra.split('-')[0])
    }
    TCredito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroCredito) => {
        if (err) throw err
        if (!registroCredito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro actualizado correctamente',
            data: [registroCredito]
        })
    })
})
// Eliminar registro 
tCreditoRutas.post('/delete/:id', (req: Request, res: Response) => {
    const payload = {
        activo: false,
        id: req.body._id
    }
    TCredito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroCredito) => {
        if (err) throw err
        if (!registroCredito) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [registroCredito]
        })
    })
})

export default tCreditoRutas