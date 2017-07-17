import * as koa from 'koa'
import * as compose from 'koa-compose';
import {Context} from "koa";
import {ProxyServer, RuleFn} from './proxyServer'

export class Server {

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
     * Proxy Server
     */
    proxy: ProxyServer;

    /**
     *Constructor
     */
    constructor() {
        this.app = new koa();
        this.proxy = new ProxyServer();
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
        this.app.listen(port, host);
    }

    /**
     * ProxyRule
     * @param {RuleFn} rule
     */
    rule(rule: RuleFn) {
        this.proxy.rule(rule);
    }

}