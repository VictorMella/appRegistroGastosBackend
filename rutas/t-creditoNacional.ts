import { Request, Response } from "express"
import { ITCredito } from "../interfaces/t-credito.interface"
import { TCredito } from "../models/tCredito"
import { crearLedgerRouter, parseMesAnio } from "../helpers/crear-ledger-router"

const moment = require('moment')

const tCreditoRutas = crearLedgerRouter(TCredito, {
    nombreListado: 'registrosTCredito',
    filtrosExtra: (query) => ({ nacional: query.registrosNacionales }),
    crearRegistro: async (req: Request, res: Response) => {
        try {
            const payloadsCuotas = construirCuotasCredito(req.body)
            const registros = await Promise.all(payloadsCuotas.map(payload => TCredito.create(payload)))
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: registros
            })
        } catch (err) {
            console.log(err)
            res.json({
                ok: false,
                mensaje: 'No se pudo crear el registro',
                data: []
            })
        }
    },
    construirPayloadActualizacion: (body) => ({
        monto: body.monto,
        tipo: body.tipo,
        cuotas: body.cuotas,
        nCuota: body.nCuotas,
        facturacionInmediata: body.facturacionInmediata,
        descripcion: body.descripcion,
        fechaCompra: body.fechaCompra,
        ...parseMesAnio(body.fechaCompra)
    }),
    eliminarRegistro: async (req: any, res: Response) => {
        const identificador = req.body.identificador
        const registros = await TCredito.find({ identificador })

        if (registros.length === 0) {
            return res.json({ ok: false, mensaje: 'Datos incorrectos', data: [] })
        }

        if (registros[0].idUsuarioCreacion !== req.usuario.identificador) {
            return res.status(403).json({ ok: false, mensaje: 'No tiene permisos sobre este registro', data: [] })
        }

        await Promise.all(registros.map(registro => TCredito.findByIdAndUpdate(registro._id, { activo: false })))

        res.json({ ok: true, mensaje: 'Registro eliminado correctamente', data: [] })
    }
})

/** Construye un payload de TCredito por cada cuota del registro. */
const construirCuotasCredito = (lsRegistro: ITCredito): any[] => {
    const identificador = makeRandomId(12)
    const totalCompra = lsRegistro.monto
    const cuotas = lsRegistro.cuotas

    if (cuotas === 1) {
        const date = lsRegistro.fechaCompra.toString()
        return [{
            ...lsRegistro,
            facturacionInmediata: true,
            mes: parseInt(date.split('-')[1]),
            anio: parseInt(date.split('-')[0]),
            identificador,
            nCuota: 1,
            totalCompra
        }]
    }

    const payloadsCuotas = []
    const valorAddMes = lsRegistro.facturacionInmediata ? 0 : 1
    for (let contador = 0; contador < cuotas; contador++) {
        const addNewMes = moment(new Date(lsRegistro.fechaCompra)).add(contador + valorAddMes, 'months')
        const formatMes = moment(addNewMes).format('YYYY-MM-DD').toString()
        const anio = parseInt(formatMes.split('-')[0])
        const mes = parseInt(formatMes.split('-')[1])
        payloadsCuotas.push({
            ...lsRegistro,
            mes,
            anio,
            nCuota: contador + 1,
            monto: Math.round(totalCompra / cuotas),
            identificador,
            totalCompra
        })
    }
    return payloadsCuotas
}

const makeRandomId = (length: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export default tCreditoRutas
