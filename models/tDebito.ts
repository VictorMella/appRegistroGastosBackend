import { model, Schema } from 'mongoose'
import { ITDebito } from '../interfaces/t-debito.interface'

const tDebitoShema = new Schema({
    created: {
        type: Date
    },
    fechaCompra: {
        type: Date
    },
    monto: {
        type: Number
    },
    tipo: {
        type: String
    },
    descripcion: {
        type: String
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
    }
})


tDebitoShema.pre<ITDebito>('save', function (next) {
    this.created = new Date()
    this.activo = true
    next()
})
export const TDebito = model<ITDebito>('TDebito', tDebitoShema)