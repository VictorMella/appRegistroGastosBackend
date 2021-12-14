/// <reference types="qs" />
import { Response, NextFunction, Request } from 'express';
export declare const validarCampos: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Response<any, Record<string, any>> | undefined;
