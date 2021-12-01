import 'reflect-metadata';

import Express from 'express';
import { getMetadataArgsStorage, useContainer, IocAdapter, useExpressServer } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import { Logger } from '@adhityan/gc-logger';
import Helmet from 'helmet';

import { ErrorFormatHandler } from './middleware';
import { RoutingOptions } from './types';

export class Router {
    private static routerConfig: RoutingOptions;

    public static initialize(app: Express.Application, config: RoutingOptions, container: IocAdapter, allowedOrigin: string) {
        app.use(Helmet());

        const corsConfig = config.cors;
        if (corsConfig !== undefined && corsConfig !== false) {
            if (corsConfig === true) Logger.debug('Enabling CORS with default config');
            else Logger.debug('Turning CORS on with config', corsConfig);
        }
        else Logger.warn('CORS is not enabled!')

        if (config.enableDocumentation) {
            const documentationUrl = '/openapi'; //not allowed to customize it because we want to load an external swagger for this
            Logger.debug(`OpenAPI path: ${documentationUrl}`);

            app.get(documentationUrl, function (_req, res) {
                Logger.info('Serving OpenAPI Spec');
                const storage = getMetadataArgsStorage();

                const schemas = validationMetadatasToSchemas({
                    refPointerPrefix: '#/components/schemas/'
                });

                const spec = routingControllersToSpec(
                    storage,
                    config,
                    config.documentationParameters && {
                        components: { schemas }
                    }
                );

                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Access-Control-Allow-Methods', 'GET');
                if (allowedOrigin)
                    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
                res.json(spec);
            });
        }

        if (config.middlewares) (<Function[]>config.middlewares).push(ErrorFormatHandler);
        else config.middlewares = [<Function>ErrorFormatHandler];

        // if (config.interceptors) (<Function[]>config.interceptors).push(<Function>FormatInterceptor);
        // else config.interceptors = [<Function>FormatInterceptor];

        config.defaultErrorHandler = false;
        if (container) useContainer(container);
        Router.routerConfig = config;

        useExpressServer(app, config);
        Logger.info('Router loaded');
    }

    public static getConfig(): RoutingOptions {
        return Router.routerConfig;
    }
}
