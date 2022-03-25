import { Express } from '@gamechange/gc-logger';
import { ExpressErrorMiddlewareInterface } from 'routing-controllers';
export declare class ErrorFormatHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Express.Request, response: Express.Response, next: () => any): void;
}
