import * as compose from "koa-compose";
import {Context} from "koa";
import * as Proxy from "http-proxy";

export type RuleFn = (ctx: Context) => Promise<Proxy.ServerOptions>;

export const defaultServerOptions: Proxy.ServerOptions = {
    ws: true
};

export class ProxyServer {

    /**
     * Proxy Server
     */
    private proxyServer: Proxy;

    /**
     * Middleware
     * @type {Array}
     */
    private middleware: compose.Middleware<Context>[] = [];

    /**
     * Proxy Fn
     * @param {Application.Context} ctx
     */
    private ruleFn: RuleFn = async (ctx) => defaultServerOptions;

    /**
     * Constructor
     * @param {Server.ServerOptions} options
     */
    constructor(options: Proxy.ServerOptions = defaultServerOptions) {
        this.proxyServer = Proxy.createProxy(options);
    }

    /**
     * Use
     * @param {compose.Middleware<Application.Context>} middleware
     */
    use(middleware: compose.Middleware<Context>) {
        this.middleware.push(middleware);
    }

    /**
     * rule
     * @param {RuleFn} fn
     */
    rule(fn: RuleFn) {
        this.ruleFn = fn;
    }

    /**
     * Invoke
     * @param {Application.Context} ctx
     * @returns {Promise<void>}
     */
    async invoke(ctx: Context) {
        ctx.respond = false;
        const options: Proxy.ServerOptions = Object.assign({}, defaultServerOptions, await this.ruleFn(ctx));
        await compose(this.middleware)(ctx).then(() => {
            this.proxyServer.web(ctx.req, ctx.res, options, (ex) => {
                ctx.res.statusCode = 500;
                ctx.res.end(ex.message);
            })
        });
    }
}