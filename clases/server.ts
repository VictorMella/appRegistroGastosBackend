import express from 'express'
import { config } from '../config'
export default class Server {
    public app: express.Application
    public port: number = 3000
    public db: string

    constructor() {
        this.app = express()
        this.port = config.serverport
        this.db = config.db
    }

    start(res: any) {
        this.app.listen(this.port, res)
    }
}