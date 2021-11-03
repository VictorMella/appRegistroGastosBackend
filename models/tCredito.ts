import { model, Schema } from 'mongoose'
import { ITCredito } from '../interfaces/t-credito.interface'

const tCreditoShema = new Schema({
    created: {
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
    facturacionInmediata: {
        type: Boolean
    },
    idUsuarioCreacion: {
        type: Number
    },
    activo: {
        type: Boolean
    }
})


tCreditoShema.pre<ITCredito>('save', function (next) {
    this.created = new Date()
    this.idUsuarioCreacion = 1
    next()
})
export const TCredito = model<ITCredito>('TCredito', tCreditoShema)