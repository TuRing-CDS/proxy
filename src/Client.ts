import * as compose from 'koa-compose'
import fetch, {Response} from 'node-fetch'

export const defaultRequestInit: RequestInit = {
    method: 'GET'
};

export class Client {

    private middleware: Array<compose.Middleware<RequestInit>> = [];

    constructor() {

    }

    use(middleware: compose.Middleware<RequestInit>) {
        this.middleware.push(middleware);
    }

    invoke(url: string, ctx: RequestInit = defaultRequestInit): Promise<Response> {
        ctx = Object.assign({}, ctx, defaultRequestInit);
        return compose(this.middleware)(ctx).then(() => {
            return fetch(url, ctx)
        })
    }
}