import { TDebito } from "../models/tDebito"
import { crearLedgerRouter } from "../helpers/crear-ledger-router"

const tDebitoRutas = crearLedgerRouter(TDebito, {
    nombreListado: 'registrosTDebito'
})

export default tDebitoRutas
