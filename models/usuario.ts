import { IUsuario } from "../interfaces/i-usuario.interface"
import { model, Schema } from 'mongoose'

const UsuarioSchema = new Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    activo: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    identificador: {
        type: Number      
    },
});

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario
}

UsuarioSchema.pre<IUsuario>('save', function (next) {
    this.created = new Date()
    this.idUsuarioCreacion = 1
    next()
})
export const Usuario = model<IUsuario>('Usuario', UsuarioSchema)
