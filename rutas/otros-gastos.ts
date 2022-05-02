import { Router, Request, Response } from "express"
import { DtoOtrosGastos } from "../interfaces/i-otrosGastosinterface"
import { OtrosGastos } from "../models/otros-gastos"


const otrosGastosRutas = Router()

//Crear registro
otrosGastosRutas.post('/crear-registro', (req: Request, res: Response) => {
    let body = req.body
    body.mes = parseInt(body.fechaCompra.split('-')[1])
    body.anio = parseInt(body.fechaCompra.split('-')[0])
    OtrosGastos.create(body)
        .then(otrosGastos => {
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: [otrosGastos]
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
otrosGastosRutas.get('/', async (req: any, res: Response) => {
    let pagina = Number(req.query.pagina) || 1
    let saltar = pagina - 1
    const registrosPorPagina = Number(req.query.registrosPorPagina) || 10
    saltar = saltar * registrosPorPagina
    const otrosGastos = await OtrosGastos.find({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .sort({ fechaCompra: -1 }) // Ordenar lista
        .skip(saltar) //Saltar registros
        .limit(registrosPorPagina) // Limit es para el número de usuarios que queremos obtener
        .exec()
    const totalRegistrosOtrosGastos = await OtrosGastos.find({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .exec()
    const totalMontoMesOtrosGastos = await OtrosGastos.find({ activo: true, mes: req.query.mes, anio: req.query.anio, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .exec()
    const ingresos = totalMontoMesOtrosGastos.filter(item => item.tipo === 'Ingreso')
    const egresos = totalMontoMesOtrosGastos.filter(item => item.tipo === 'Egreso')

    res.json({
        ok: totalRegistrosOtrosGastos.length ? true : false,
        mensaje: totalRegistrosOtrosGastos.length ? '' : 'Busqueda sin resultados',
        data: [{
            pagina,
            cantidadRegistros: otrosGastos.length,
            registrosPorPagina: registrosPorPagina,
            totalRegistros: totalRegistrosOtrosGastos.length,
            otrosGastos,
            totalMontoMes: ingresos.reduce((acc, curr) => acc + curr.monto, 0) - egresos.reduce((acc, curr) => acc + curr.monto, 0)
        }]
    })
})

// Años con registros
otrosGastosRutas.get('/anio', async (req: any, res: Response) => {
    const añosConRegistros = await OtrosGastos.find({ activo: true, idUsuarioCreacion: req.query.idUsuarioCreacion })
        .sort({ anio: -1 }) // Ordenar lista
        .exec()
    res.json({
        ok: true,
        mensaje: '',
        data: [... new Set(añosConRegistros.map(item => item.anio))]
    })
})

// ACTUALIZAR 
otrosGastosRutas.post('/update', (req: Request, res: Response) => {
    const payload: DtoOtrosGastos = {
        id: req.body._id,
        monto: req.body.monto,
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        fechaCompra: req.body.fechaCompra,
        mes: parseInt(req.body.fechaCompra.split('-')[1]),
        anio: parseInt(req.body.fechaCompra.split('-')[0])
    }
    OtrosGastos.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroOtrosGastos) => {
        if (err) throw err
        if (!registroOtrosGastos) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro actualizado correctamente',
            data: [registroOtrosGastos]
        })
    })
})
// Eliminar registro 
otrosGastosRutas.post('/delete', (req: Request, res: Response) => {
    const payload = {
        activo: false,
        id: req.body._id
    }
    OtrosGastos.findByIdAndUpdate(payload.id, payload, { new: true }, (err, registroOtrosGastos) => {
        if (err) throw err
        if (!registroOtrosGastos) {
            return res.json({
                ok: false,
                mensaje: 'Datos incorrectos',
                data: []
            })
        }
        res.json({
            ok: true,
            mensaje: 'Registro eliminado correctamente',
            data: [registroOtrosGastos]
        })
    })
})

export default otrosGastosRutas