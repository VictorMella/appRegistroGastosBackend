import { Document } from 'mongoose'

export interface ITDebito extends Document {
    id?: string
    created: Date
    monto: number
    tipo: string
    descripcion: string
    idUsuarioCreacion: number
    activo: boolean
    mes: number
    anio: number
    fechaCreacion: Date
}