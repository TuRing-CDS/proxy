import * as koa from 'koa'
import * as compose from "koa-compose";
import {Context} from "koa";

export class CProxy {

    private app: koa;

    constructor() {
        this.app = new koa();
    }

    use(middleware: compose.Middleware<Context>) {
        this.app.use(middleware);
    }

    listen(port: number = 8062, host: string = 'localhost') {
        this.app.listen(port, host);
    }
}