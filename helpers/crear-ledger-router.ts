import { Router, Request, Response, RequestHandler } from "express"
import { Model } from "mongoose"
import { validarJWT } from "../middelwares/validar-jwt"
import { validarPropietarioPorId } from "../middelwares/validar-propietario"

export const parseMesAnio = (fechaCompra: string) => ({
    mes: parseInt(fechaCompra.split('-')[1]),
    anio: parseInt(fechaCompra.split('-')[0])
})

interface OpcionesLedgerRouter {
    /** Nombre bajo el cual se expone el listado paginado en la respuesta (ej: 'registrosTDebito') */
    nombreListado: string
    /** Filtros adicionales a los comunes (activo, mes, anio, idUsuarioCreacion) */
    filtrosExtra?: (query: any) => object
    /** Reemplaza el cálculo por defecto (suma de `monto`) */
    calcularTotalMontoMes?: (registros: any[]) => number
    /** Reemplaza el handler de 'crear-registro' por completo (ej: lógica de cuotas en crédito) */
    crearRegistro?: RequestHandler
    /** Construye el payload de actualización a partir del body (por defecto: body + mes/anio) */
    construirPayloadActualizacion?: (body: any) => object
    /** Reemplaza el handler de 'delete' por completo (ej: borrado masivo por `identificador` en crédito) */
    eliminarRegistro?: RequestHandler
}

export const crearLedgerRouter = (RegistroModel: Model<any>, opciones: OpcionesLedgerRouter): Router => {
    const router = Router()

    router.use(validarJWT)

    router.post('/crear-registro', opciones.crearRegistro ?? (async (req: Request, res: Response) => {
        try {
            const body = { ...req.body, ...parseMesAnio(req.body.fechaCompra) }
            const registro = await RegistroModel.create(body)
            res.json({
                ok: true,
                mensaje: 'Registro creado correctamente',
                data: [registro]
            })
        } catch (err) {
            console.log(err)
            res.json({
                ok: false,
                mensaje: 'No se pudo crear el registro',
                data: []
            })
        }
    }))

    router.get('/', async (req: any, res: Response) => {
        const pagina = Number(req.query.pagina) || 1
        const registrosPorPagina = Number(req.query.registrosPorPagina) || 10
        const saltar = (pagina - 1) * registrosPorPagina

        const filtro = {
            activo: true,
            mes: req.query.mes,
            anio: req.query.anio,
            idUsuarioCreacion: req.query.idUsuarioCreacion,
            ...(opciones.filtrosExtra ? opciones.filtrosExtra(req.query) : {})
        }

        const [registros, totalRegistros] = await Promise.all([
            RegistroModel.find(filtro).sort({ fechaCompra: -1 }).skip(saltar).limit(registrosPorPagina).exec(),
            RegistroModel.find(filtro).exec()
        ])

        const totalMontoMes = opciones.calcularTotalMontoMes
            ? opciones.calcularTotalMontoMes(totalRegistros)
            : totalRegistros.reduce((acc, curr) => acc + curr.monto, 0)

        res.json({
            ok: totalRegistros.length > 0,
            mensaje: totalRegistros.length ? '' : 'Busqueda sin resultados',
            data: [{
                pagina,
                cantidadRegistros: registros.length,
                registrosPorPagina,
                totalRegistros: totalRegistros.length,
                [opciones.nombreListado]: registros,
                totalMontoMes
            }]
        })
    })

    router.get('/anio', async (req: any, res: Response) => {
        const filtro = {
            activo: true,
            idUsuarioCreacion: req.query.idUsuarioCreacion,
            ...(opciones.filtrosExtra ? opciones.filtrosExtra(req.query) : {})
        }

        const registros = await RegistroModel.find(filtro).sort({ anio: -1 }).exec()

        res.json({
            ok: true,
            mensaje: '',
            data: [...new Set(registros.filter(item => item.anio).map(item => item.anio))]
        })
    })

    router.post('/update', validarPropietarioPorId(RegistroModel), (req: Request, res: Response) => {
        const payload = opciones.construirPayloadActualizacion
            ? opciones.construirPayloadActualizacion(req.body)
            : { ...req.body, ...parseMesAnio(req.body.fechaCompra) }

        RegistroModel.findByIdAndUpdate(req.body._id, payload, { new: true })
            .then(registro => {
                if (!registro) {
                    return res.json({ ok: false, mensaje: 'Datos incorrectos', data: [] })
                }
                res.json({ ok: true, mensaje: 'Registro actualizado correctamente', data: [registro] })
            })
            .catch(err => {
                console.log(err)
                res.json({ ok: false, mensaje: 'No se pudo actualizar el registro', data: [] })
            })
    })

    router.post('/delete', opciones.eliminarRegistro ?? [
        validarPropietarioPorId(RegistroModel),
        (req: Request, res: Response) => {
            RegistroModel.findByIdAndUpdate(req.body._id, { activo: false } as any, { new: true })
                .then(registro => {
                    if (!registro) {
                        return res.json({ ok: false, mensaje: 'Datos incorrectos', data: [] })
                    }
                    res.json({ ok: true, mensaje: 'Registro eliminado correctamente', data: [registro] })
                })
                .catch(err => {
                    console.log(err)
                    res.json({ ok: false, mensaje: 'No se pudo eliminar el registro', data: [] })
                })
        }
    ] as any)

    return router
}
