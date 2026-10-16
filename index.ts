import bodyParser from "body-parser"
import Server from "./clases/server"
import cors from 'cors'
import express from 'express'
import path from 'path'
import tDebitoRutas from "./rutas/t-debito"
import tCreditoRutas from "./rutas/t-creditoNacional"
import auth from "./rutas/auth"
import usuario from "./rutas/usuario"
import otrosGastosRutas from "./rutas/otros-gastos"
import { conectarDB } from "./db/conectar-db"

const server = new Server

//BODY PARSER
server.app.use(bodyParser.urlencoded({ extended: true }))
server.app.use(bodyParser.json())

// CORS
server.app.use(cors({ origin: true, credentials: true }))

const iniciar = async () => {
    await conectarDB()

    //Rutas del proyecto
    server.app.use(express.static(path.join((__dirname + '/public'))))
    server.app.use('/auth', auth)
    server.app.use('/usuario', usuario)
    server.app.use('/debito', tDebitoRutas)
    server.app.use('/credito', tCreditoRutas)
    server.app.use('/otros-gastos', otrosGastosRutas)

    //Levantar servidor
    server.start(() => console.log(`Hola, estoy en el puerto ${server.port}`))
}

iniciar().catch(err => {
    console.error('No se pudo conectar a la base de datos', err)
    process.exit(1)
})