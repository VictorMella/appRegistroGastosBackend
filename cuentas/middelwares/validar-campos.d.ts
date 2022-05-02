import { Response, NextFunction, Request } from 'express';
export declare const validarCampos: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
