import { Document } from 'mongoose'

export interface ITCredito extends Document {
    id?: string
    created: Date
    monto: number
    cuotas: number
    tipo: string
    descripcion: string
    facturacionInmediata: boolean
    idUsuarioCreacion: number
    activo: boolean
    mes: number
    anio: number
    fechaCreacion: Date
}
