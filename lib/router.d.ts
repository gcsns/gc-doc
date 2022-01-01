import 'reflect-metadata';
import Express from 'express';
import { IocAdapter } from 'routing-controllers';
import { RoutingOptions } from './types';
export declare class Router {
    private static routerConfig;
    static initialize(app: Express.Application, config: RoutingOptions, container: IocAdapter, allowedOrigin?: string): void;
    static getConfig(): RoutingOptions;
}
