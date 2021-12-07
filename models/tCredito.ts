import { model, Schema } from 'mongoose'
import { ITCredito } from '../interfaces/t-credito.interface'

const tCreditoShema = new Schema({
    created: {
        type: Date
    },
    fechaCompra: {
        type: Date
    },
    monto: {
        type: Number
    },
    cuotas: {
        type: Number
    },
    descripcion: {
        type: String
    },
    tipo: {
        type: String
    },
    facturacionInmediata: {
        type: Boolean
    },
    idUsuarioCreacion: {
        type: Number
    },
    activo: {
        type: Boolean
    },
    mes: {
        type: Number
    },
    anio: {
        type: Number
    },
    identificador: {
        type: String
    },
    nCuota: {
        type: Number
    }
})


tCreditoShema.pre<ITCredito>('save', function (next) {
    this.created = new Date()
    this.idUsuarioCreacion = 1
    this.activo = true
    next()
})
export const TCredito = model<ITCredito>('TCredito', tCreditoShema)