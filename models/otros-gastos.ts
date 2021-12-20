import { model, Schema } from 'mongoose'
import { IOtros } from '../interfaces/i-otros.interface'

const otrosShema = new Schema({
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


otrosShema.pre<IOtros>('save', function (next) {
    this.created = new Date()
    this.activo = true
    next()
})
export const OtrosGastos = model<IOtros>('OtrosGastos', otrosShema)