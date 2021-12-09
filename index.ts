import bodyParser from "body-parser"
import mongoose from "mongoose"
import Server from "./clases/server"
import cors from 'cors'
import express from 'express'
import path from 'path'

import tDebitoRutas from "./rutas/t-debito"

import { IConnectOptions } from "./interfaces/i-conecctionOptions.interface"
import tCreditoRutas from "./rutas/t-creditoNacional"
import tCreditoRutasInternacional from "./rutas/t-creditoInternacional"

const key = require('./environment/environment')

const server = new Server

//BODY PARSER
server.app.use(bodyParser.urlencoded({ extended: true }))
server.app.use(bodyParser.json())

// CORS
server.app.use(cors({ origin: true, credentials: true }))

server.app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*')

    next()
})

const options: IConnectOptions = {
    useNewUrlParser: true
}

//CONECTAR BD
// let mongoDB: string
// if (process.env && process.env.NODE_ENV === 'production') {
//     mongoDB = `mongodb+srv://AdminRegister:${key}@registrocuentas.09jiw.mongodb.nett/gastosBD`
// } else {
//     mongoDB = 'mongodb://localhost:27017/gastosBD'
// }
mongoose.connect(
    'mongodb://localhost:27017/gastosBD', options)

//Rutas del proyecto
server.app.use(express.static(path.join((__dirname + '/public'))))
server.app.use('/debito', tDebitoRutas)
server.app.use('/credito', tCreditoRutas)
server.app.use('/credito-internacional', tCreditoRutasInternacional)

//Levantar servidor
server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`))