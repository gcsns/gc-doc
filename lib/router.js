"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const gc_logger_1 = require("@gamechange/gc-logger");
const helmet_1 = __importDefault(require("helmet"));
const middleware_1 = require("./middleware");
class Router {
    static initialize(app, config, container, allowedOrigin) {
        app.use((0, helmet_1.default)());
        const corsConfig = config.cors;
        if (corsConfig !== undefined && corsConfig !== false) {
            if (corsConfig === true)
                gc_logger_1.Logger.debug('Enabling CORS with default config');
            else
                gc_logger_1.Logger.debug('Turning CORS on with config', corsConfig);
        }
        else
            gc_logger_1.Logger.warn('CORS is not enabled!');
        if (config.enableDocumentation) {
            const documentationUrl = '/openapi'; //not allowed to customize it because we want to load an external swagger for this
            gc_logger_1.Logger.debug(`OpenAPI path: ${documentationUrl}`);
            app.get(documentationUrl, function (_req, res) {
                gc_logger_1.Logger.info('Serving OpenAPI Spec');
                const storage = (0, routing_controllers_1.getMetadataArgsStorage)();
                const schemas = (0, class_validator_jsonschema_1.validationMetadatasToSchemas)({
                    refPointerPrefix: '#/components/schemas/'
                });
                const spec = (0, routing_controllers_openapi_1.routingControllersToSpec)(storage, config, config.documentationParameters && {
                    components: { schemas }
                });
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Access-Control-Allow-Methods', 'GET');
                if (allowedOrigin)
                    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
                res.json(spec);
            });
        }
        if (config.middlewares)
            config.middlewares.push(middleware_1.ErrorFormatHandler);
        else
            config.middlewares = [middleware_1.ErrorFormatHandler];
        // if (config.interceptors) (<Function[]>config.interceptors).push(<Function>FormatInterceptor);
        // else config.interceptors = [<Function>FormatInterceptor];
        config.defaultErrorHandler = false;
        if (container)
            (0, routing_controllers_1.useContainer)(container);
        Router.routerConfig = config;
        (0, routing_controllers_1.useExpressServer)(app, config);
        gc_logger_1.Logger.info('Router loaded');
    }
    static getConfig() {
        return Router.routerConfig;
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map