import { Document } from 'mongoose'

export interface ITDebito extends Document {
    created: Date
    monto: number
    tipo: string
    descripcion: string
    idUsuarioCreacion: number
    activo: boolean
}