import bodyParser from "body-parser"
import mongoose from "mongoose"
import Server from "./clases/server"
import cors from 'cors'

import tDebitoRutas from "./rutas/t-debito"

import { IConnectOptions } from "./interfaces/i-conecctionOptions.interface"


const server = new Server



//BODY PARSER
server.app.use(bodyParser.urlencoded({ extended: true }))
server.app.use(bodyParser.json())

// CORS
server.app.use(cors({ origin: true, credentials: true }))


const options: IConnectOptions  = {
    useNewUrlParser: true
}

//CONECTAR BD
mongoose.connect(
    'mongodb://localhost:27017/gastosBD', options)

//Rutas del proyecto
server.app.use('/debito', tDebitoRutas)

//Levantar servidor
server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`))