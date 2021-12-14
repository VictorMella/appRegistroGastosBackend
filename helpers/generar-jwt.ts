const jwt = require('jsonwebtoken')
import { config } from '../config'

export const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid }
        jwt.sign(payload, config.SECRETORPRIVATEKEY, {
            expiresIn: '1h'
        }, (err: any, token: string) => {

            if (err) {
                console.log(err)
                reject('No se pudo generar el token')
            } else {
                resolve(token)
            }
        })

    })
}
