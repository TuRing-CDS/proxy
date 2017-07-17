import {Server} from '../Server';
import * as Router from 'koa-router'

const server = new Server();

const service: Map<string, string> = new Map();

const router = new Router();

router.all('/services/:service/*', async (ctx, next) => {
    const service = ctx.params.service;
    if (service) {
        ctx.path = `/${ctx.params[0]}`;
        return await server.proxy.invoke(ctx);
    }
    return next();
});

router.all('*', async (ctx) => {
    ctx.body = ctx.path;
});

service.set('user', 'http://localhost:1212');
service.set('home', 'http://localhost:1213');
server.use((ctx, next) => {
    ctx.onerror = function (ex) {
        !!ex && ctx.res.end(ex.message);
    };
    return next()
});
server.use(router.routes());
server.use(router.allowedMethods());


server.rule(async (ctx) => {
    const serviceName = ctx.params.service;
    const host = service.get(serviceName);
    if (host) {
        return {target: host};
    }
    throw new Error(`${serviceName} not found!`);
});


server.listen(1212);