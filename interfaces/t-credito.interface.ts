import { Document } from 'mongoose'

export interface ITCredito extends Document {
    created: Date
    monto: number
    cuotas: number
    descripcion: string
    facturacionInmediata: boolean
    idUsuarioCreacion: number
    activo: boolean
}