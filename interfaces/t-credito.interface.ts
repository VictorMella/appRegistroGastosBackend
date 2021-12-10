export interface ITCredito  {
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
    fechaCompra: Date | string
    identificador: number | string
    nCuota: number
    nacional: boolean
}
