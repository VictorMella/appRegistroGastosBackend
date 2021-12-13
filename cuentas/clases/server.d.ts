import express from 'express';
export default class Server {
    app: express.Application;
    port: number;
    db: string;
    constructor();
    start(res: any): void;
}
