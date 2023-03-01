import { Service } from 'typedi';
import { Express, Logger } from '@gamechange/gc-logger';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Router } from './router';
import { ErrorResponseType } from './types';

@Service()
@Middleware({ type: 'after' })
export class ErrorFormatHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Express.Request, response: Express.Response, next: () => any) {
        const status = error.httpCode || error.statusCode || request.statusCode || 400;
        Logger.error('[Operation Failed]', error);
        
        const finalResponse: ErrorResponseType = {};
        Router.errorResponseKeys.forEach((key) => {
            if (error[key]) finalResponse[key] = error[key];
        });

        response.status(status).json(Object.keys(finalResponse).length === 0 ? { message: error.message } : finalResponse);
        next();
    }
}
