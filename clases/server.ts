import express from 'express'
const serverport: number = 3000 || Number(process.env.PORT) || 3000
const db = 'mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD' || 'mongodb://localhost:27017/gastosBD'
//mongodb+srv://AdminMella:carola7810@cluster0.09jiw.mongodb.net/gastosBD
export default class Server {
    public app: express.Application
    public port: number = 3000
    public db: string

    constructor() {
        this.app = express()
        this.port = serverport
        this.db = db
    }

    start(res: any) {
        this.app.listen(this.port, res)
    }
}