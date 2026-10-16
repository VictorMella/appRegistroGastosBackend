import { OtrosGastos } from "../models/otros-gastos"
import { crearLedgerRouter } from "../helpers/crear-ledger-router"

const otrosGastosRutas = crearLedgerRouter(OtrosGastos, {
    nombreListado: 'otrosGastos',
    calcularTotalMontoMes: (registros) => {
        const ingresos = registros.filter(item => item.tipo === 'Ingreso')
        const egresos = registros.filter(item => item.tipo === 'Egreso')
        return ingresos.reduce((acc, curr) => acc + curr.monto, 0) - egresos.reduce((acc, curr) => acc + curr.monto, 0)
    }
})

export default otrosGastosRutas
