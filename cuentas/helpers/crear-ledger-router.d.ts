import { Router, RequestHandler } from "express";
import { Model } from "mongoose";
export declare const parseMesAnio: (fechaCompra: string) => {
    mes: number;
    anio: number;
};
interface OpcionesLedgerRouter {
    /** Nombre bajo el cual se expone el listado paginado en la respuesta (ej: 'registrosTDebito') */
    nombreListado: string;
    /** Filtros adicionales a los comunes (activo, mes, anio, idUsuarioCreacion) */
    filtrosExtra?: (query: any) => object;
    /** Reemplaza el cálculo por defecto (suma de `monto`) */
    calcularTotalMontoMes?: (registros: any[]) => number;
    /** Reemplaza el handler de 'crear-registro' por completo (ej: lógica de cuotas en crédito) */
    crearRegistro?: RequestHandler;
    /** Construye el payload de actualización a partir del body (por defecto: body + mes/anio) */
    construirPayloadActualizacion?: (body: any) => object;
    /** Reemplaza el handler de 'delete' por completo (ej: borrado masivo por `identificador` en crédito) */
    eliminarRegistro?: RequestHandler;
}
export declare const crearLedgerRouter: (RegistroModel: Model<any>, opciones: OpcionesLedgerRouter) => Router;
export {};
