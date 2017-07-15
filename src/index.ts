import * as Proxy from 'http-proxy'
import {ServerOptions} from "http-proxy";
import * as Koa from 'koa';
import {Context} from "koa";
import compose = require("koa-compose");

export const defaultProxyServerOptions: ServerOptions = {
    ws: true,
    autoRewrite: true
};

export type IProxy = (ctx: Context) => Promise<ServerOptions>;

/**
 * Proxy Server
 */
export class ProxyServer {

    /**
     * Port
     */
    private port: number;

    /**
     * Proxy Server
     */
    private proxyServer: Proxy;

    /**
     * Koa Application
     */
    private app: Koa;

    /**
     * proxy Function
     * @param {Application.Context} req
     * @returns {Promise<Server.ServerOptions>}
     */
    private proxyFn: IProxy = (req: Context) => {
        return Promise.resolve(defaultProxyServerOptions);
    };

    /**
     * Constructor
     * @param {Server.ServerOptions} options
     */
    constructor(options: ServerOptions = {}) {
        this.proxyServer = Proxy.createProxyServer(options);
        this.app = new Koa();
        this.app.use(async (ctx: Context, next: Function) => {
            ctx.respond = false;
            const options = await this.proxyFn(ctx);
            this.proxyServer.web(ctx.req, ctx.res, options);
            await next();
        });
    }

    /**
     * Use
     * @param {compose.Middleware<Application.Context>} middleware
     */
    use(middleware: compose.Middleware<Context>) {
        this.app.use(middleware);
        return this;
    }

    /**
     * IProxy
     * @param {IProxy} middleware
     * @returns {ProxyServer}
     */
    proxy(middleware: IProxy) {
        this.proxyFn = middleware;
        return this;
    }

    /**
     * Listen
     * @param {number} port
     */
    listen(port: number = 8062) {
        this.port = port;
        this.app.listen(this.port);
        return this;
    }

}