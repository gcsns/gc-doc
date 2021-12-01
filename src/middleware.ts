import { Express, Logger } from '@adhityan/gc-logger';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
@Middleware({ type: 'after' })
export class ErrorFormatHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Express.Request, response: Express.Response, next: () => any) {
        const status = error.httpCode || error.statusCode || request.statusCode || 400;
        Logger.error('[Operation Failed]', error);

        if ((<any>error).errorIdentifier) delete (<any>error).errorIdentifier;
        if ((<any>error).stack) delete (<any>error).stack;
        response.status(status).json(Object.keys(error).length === 0 ? { message: error.message } : error);
        next();
    }
}