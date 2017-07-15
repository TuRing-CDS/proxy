import {ProxyServer} from '../index'
import {ServerOptions} from "http-proxy";
import {Context} from "koa";
import * as favicon from 'koa-favicon';
const proxy = new ProxyServer();

proxy.use(favicon(__dirname+''));

proxy.proxy(async (ctx: Context) => {
    const context: ServerOptions = {};

    context.target = ctx.url && 'http://' + ctx.url.replace('/', '');

    return context;
});

proxy.listen();