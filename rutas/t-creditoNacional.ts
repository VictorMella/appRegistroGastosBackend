import { Router, Request, Response } from "express"
import { DtoPayloadCredito } from "../interfaces/i-payloadCredito.interface"
import { ITCredito } from "../interfaces/t-credito.interface"
import { TCredito } from "../models/tCredito"

const moment = require('moment')

const tCreditoRutas = Router()

//Crear registro
tCreditoRutas.post('/crear-registro', (req: Request, res: Response) => {
    let body = formatPayloadLsCredito(req.body)
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
    const registrosTCredito = await TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio, nacional: req.query.registrosNacionales })
        .sort({ fechaCompra: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec()
    const totalRegistrosCredito = await TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio, nacional: req.query.registrosNacionales })
        .exec()
    
    const totalMontoMesCredito = await TCredito.find({ activo: true, mes: req.query.mes, anio: req.query.anio, nacional: req.query.registrosNacionales })
        .exec()

    res.json({
        ok: totalRegistrosCredito.length ? true : false,
        mensaje: totalRegistrosCredito.length ? '' : 'Busqueda sin resultados',
        data: [{
            pagina,
            cantidadRegistros: registrosTCredito.length,
            registrosPorPagina: registrosPorPagina,
            totalRegistros: totalRegistrosCredito.length,
            registrosTCredito,
            totalMontoMes: totalMontoMesCredito.reduce((acc, curr) => acc + curr.monto, 0)
        }]
    })
})

// // Años con registros
tCreditoRutas.get('/anio', async (req: any, res: Response) => {
    const añosConRegistros = await TCredito.find({ activo: true, nacional: req.query.registrosNacionales })
    .sort({ anio: -1 }) // Ordenar lista
    .exec()

    res.json({
        ok: true,
        mensaje: '',
        data: [... new Set(añosConRegistros.filter(item => item.anio).map(item => item.anio))]
    })
})

// ACTUALIZAR 
tCreditoRutas.post('/update/:id', (req: Request, res: Response) => {
    const payload: DtoPayloadCredito = {
        id: req.body._id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        cuotas: req.body.cuotas,
        nCuota: req.body.nCuotas,
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
tCreditoRutas.post('/delete', async (req: Request, res: Response) => {
    const identificador = req.body.identificador
    const payload = {
        activo: false,
        id: req.body._id
    }
    const lsRegsitrosPorEliminar = await TCredito.find({ identificador: identificador })
    let ultimoRegistro = false
    if (lsRegsitrosPorEliminar.length > 0) {
        lsRegsitrosPorEliminar.forEach((item, index) => {
            const payload = {
                activo: false,
                id: item._id
            }
            ultimoRegistro = lsRegsitrosPorEliminar.length == index + 1
            eliminarRegistros(payload, res, ultimoRegistro)
        })
    }
})

const formatPayloadLsCredito = (lsRegistro: ITCredito) => {
    const identificador = makeRandomId(12)
    let totalCompra = lsRegistro.monto
    if (lsRegistro.cuotas === 1) {
        const date = lsRegistro.fechaCompra.toString()
        lsRegistro.facturacionInmediata = true
        lsRegistro.mes = parseInt(date.split('-')[1])
        lsRegistro.anio = parseInt(date.split('-')[0])
        lsRegistro.identificador = identificador
        lsRegistro.nCuota = 1
        return lsRegistro
    }
    if (lsRegistro.cuotas > 1) {
        let contador = 0
        let cuotas = lsRegistro.cuotas, newMes = new Date(lsRegistro.fechaCompra)
        const valorAddMes = lsRegistro.facturacionInmediata ? 0 : 1
        while (contador < cuotas) {
            const addNewMes = moment(newMes).add((contador + valorAddMes), 'months')
            const formatMes = moment(addNewMes).format('YYYY-MM-DD').toString()
            const addanio = parseInt(formatMes.split('-')[0]), addmes = parseInt(formatMes.split('-')[1])
            lsRegistro.mes = addmes
            lsRegistro.anio = addanio
            lsRegistro.nCuota = contador + 1
            lsRegistro.monto = Math.round(totalCompra / cuotas)
            lsRegistro.identificador = identificador
            crearRegistros(lsRegistro)
            contador += 1
        }
    }
}

const eliminarRegistros = (payload: any, res: Response, ultimoRegistro: boolean): void => {
    TCredito.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroCredito) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }
        if (!registroCredito && ultimoRegistro) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        if (ultimoRegistro) {
            res.json({
                ok: true,
                mensaje: 'Registro eliminado correctamente',
                data: []
            })
        }
    })
}

const crearRegistros = (lsRegistro: any): void => {
    let res: Response<any, Record<string, any>>
    TCredito.create(lsRegistro)
        .then((res) => {
            console.log('registroCredito ok')
        })
        .catch(err => {
            console.log('badRequest', err)
        })
}

const makeRandomId = (length: any) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0;i < length;i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export default tCreditoRutas