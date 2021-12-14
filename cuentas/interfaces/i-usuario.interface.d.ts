export interface IUsuario {
    id?: string;
    created: Date;
    idUsuarioCreacion: number;
    nombre: string;
    correo: string;
    password: string;
    activo: boolean;
    google: boolean;
    identificador?: number;
}
