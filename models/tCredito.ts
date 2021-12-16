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
    nCuota: {
        type: Number
    },
    anio: {
        type: Number
    },
    identificador: {
        type: String
    },
    nacional: {
        type: Boolean
    }
})


tCreditoShema.pre<ITCredito>('save', function (next) {
    this.created = new Date()
    this.activo = true
    next()
})
export const TCredito = model<ITCredito>('TCredito', tCreditoShema)