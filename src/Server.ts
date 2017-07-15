import * as koa from 'koa'
import * as compose from 'koa-compose';
import {Context} from "koa";

class Server {

    /**
     * Web Application
     */
    private app: koa;

    /**
     * Port
     */
    private port: number = 8062;

    /**
     * Host
     */
    private host: string = 'localhost';

    /**
     *Constructor
     */
    constructor() {
        this.app = new koa();
    }

    /**
     * Use
     * @param {compose.Middleware<Application.Context>} middleware
     */
    use(middleware: compose.Middleware<Context>) {
        this.app.use(middleware);
    }

    /**
     * Listen
     * @param {number} port
     * @param {string} host
     */
    listen(port: number = 8062, host: string = 'localhost') {
        this.port = port;
        this.host = host;
    }

}