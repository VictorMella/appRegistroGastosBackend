import express from 'express'
const serverport: number =  3000 || Number(process.env.PORT)

export default class Server {
    public app: express.Application
    public port: number = 3000

    constructor() {
        this.app = express()
        this.port = serverport
    }

    start(res: any) {
        this.app.listen(this.port, res)
    }
}