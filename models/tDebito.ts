import { model, Schema } from 'mongoose'
import { ITDebito } from '../interfaces/t-debito.interface'
import tDebitoRutas from '../rutas/t-debito'

const tDebitoShema = new Schema({
    created: {
        type: Date
    },
    monto: {
        type: Number,
        // required: [true]
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
    }
})


tDebitoShema.pre<ITDebito>('save', function (next) {
    this.created = new Date()
    this.idUsuarioCreacion = 1
    next()
})
export const TDebito = model<ITDebito>('TDebito', tDebitoShema)