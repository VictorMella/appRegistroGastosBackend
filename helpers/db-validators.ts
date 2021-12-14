import { Usuario } from "../models/usuario"

export const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

export const existeUsuarioPorId = async( id: string ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

export const cantidadUsuarios = async( ) => {
    // Verificar si el correo existe
    const totalRegistrosUsuario = await Usuario.find({ activo: true })
    .exec()
    return totalRegistrosUsuario.length + 1
}


