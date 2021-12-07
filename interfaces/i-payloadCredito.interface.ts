
export interface DtoPayloadCredito  {
    id?: string
    created?: Date
    monto?: number
    tipo?: string
    descripcion?: string
    fechaCompra?: Date
    idUsuarioCreacion?: number
    activo?: boolean
    mes?: number
    anio?: number
    facturacionInmediata?: boolean
    cuotas: number
    nCuota: number
}