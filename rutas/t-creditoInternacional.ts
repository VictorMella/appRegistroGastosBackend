import { Router, Request, Response } from "express"
import { ITCredito } from "../interfaces/t-credito.interface"
import { TCreditoInternacional } from "../models/tCreditoInternacional"

const tCreditoInternacionalRutas = Router()

//Crear registro
tCreditoInternacionalRutas.post('/crear-registro', (req: Request, res: Response) => {
    let body = formatPayloadLsCredito(req.body)
    TCreditoInternacional.create(body)
        .then(registroCreditoInternacional => {
            res.json({
                ok: true,
                registroCreditoInternacional
            })
        })
        .catch(err => {
            res.json({
                err
            })
        })

})

// Registos paginados
tCreditoInternacionalRutas.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1
    let saltar = pagina - 1
    const registrosPorPagina = 10
    saltar = saltar * registrosPorPagina
    const registrosTCreditoInternacional = await TCreditoInternacional.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .sort({ _id: -1 })
        .skip(saltar)
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec()
    const totalRegistrosCreditoInternacional = await TCreditoInternacional.find({ activo: true, mes: req.query.mes, anio: req.query.anio })
        .exec()

    res.json({
        ok: totalRegistrosCreditoInternacional.length ? true : false,
        mensaje: totalRegistrosCreditoInternacional.length ? '' : 'Busqueda sin resultados',
        data: [{
            pagina,
            cantidadRegistros: registrosTCreditoInternacional.length,
            registrosPorPagina: registrosPorPagina,
            totalRegistros: totalRegistrosCreditoInternacional.length,
            registrosTCreditoInternacional,
        }]
    })
})

// ACTUALIZAR 
tCreditoInternacionalRutas.post('/update/:id', (req: Request, res: Response) => {
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

tCreditoInternacionalRutas.get('/anio', async (req: any, res: Response) => {
    const añosConRegistros = await TCreditoInternacional.find({ activo: true })
        .sort({ anio: -1 }) // Ordenar lista
        .exec()

    res.json({
        ok: true,
        mensaje: '',
        data: [... new Set(añosConRegistros.filter(item => item.anio).map(item => item.anio))]
    })
})

// Eliminar registro 
tCreditoInternacionalRutas.post('/delete/:id', (req: Request, res: Response) => {
    const id = req.params.id
    const payload = {
        activo: true
    }

    TCreditoInternacional.findByIdAndUpdate(id, payload, { new: true }, (err, registroCreditoInternacional) => {
        if (err) throw err
        if (!registroCreditoInternacional) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos'
            })
        }
        res.json({
            ok: true,
            registroCreditoInternacional
        })
    })
})


const formatPayloadLsCredito = (lsRegistro: ITCredito) => {
    const identificador = makeRandomId(12)
    const date = lsRegistro.fechaCompra.toString()
    lsRegistro.facturacionInmediata = true
    lsRegistro.mes = parseInt(date.split('-')[1])
    lsRegistro.anio = parseInt(date.split('-')[0])
    lsRegistro.identificador = identificador
    lsRegistro.nCuota = 1
    return lsRegistro
}

const makeRandomId = (length: any) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0;i < length;i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export default tCreditoInternacionalRutas