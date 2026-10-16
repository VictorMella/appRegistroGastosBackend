import mongoose from 'mongoose'
import { config } from '../config'
import { IConnectOptions } from '../interfaces/i-conecctionOptions.interface'

const options: IConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    driverInfo: { name: 'Mongoose', version: '6.0.12' }
}

// Cacheado a nivel de módulo: sobrevive entre invocaciones dentro del mismo
// proceso/contenedor (local, y en Vercel mientras el lambda siga "tibio").
let conexion: Promise<typeof mongoose> | null = null

export const conectarDB = (): Promise<typeof mongoose> => {
    if (mongoose.connection.readyState === 1) {
        // ya conectado (p.ej. invocación reentrante en el mismo proceso)
        return Promise.resolve(mongoose)
    }
    if (!conexion) {
        mongoose.Promise = global.Promise
        conexion = mongoose.connect(config.db, options)
    }
    return conexion
}
