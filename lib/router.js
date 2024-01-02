"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
// acessing private API to add types of nested array of object in openapi specs
// as suggested here https://github.com/typestack/class-transformer/issues/563
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const swaggerUiExpress = __importStar(require("swagger-ui-express"));
const gc_logger_1 = require("@gamechange/gc-logger");
const helmet_1 = __importDefault(require("helmet"));
const middleware_1 = require("./middleware");
class Router {
    static initialize(app, config, container, allowedOrigin, errorResponseKeys) {
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
            const storage = (0, routing_controllers_1.getMetadataArgsStorage)();
            const schemas = (0, class_validator_jsonschema_1.validationMetadatasToSchemas)({
                classTransformerMetadataStorage: defaultMetadataStorage,
                refPointerPrefix: '#/components/schemas/'
            });
            const spec = (0, routing_controllers_openapi_1.routingControllersToSpec)(storage, config, Object.assign(Object.assign({}, config.documentationParameters), { components: Object.assign(Object.assign({}, config.documentationParameters.components), { schemas }) }));
            const documentationUrl = '/openapi'; //not allowed to customize it because we want to load an external swagger for this
            gc_logger_1.Logger.debug(`OpenAPI path: ${documentationUrl}`);
            app.get(documentationUrl, function (_req, res) {
                gc_logger_1.Logger.info('Serving OpenAPI Spec');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Access-Control-Allow-Methods', 'GET');
                if (allowedOrigin)
                    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
                res.json(spec);
            });
            const swaggerUiUrl = '/docs'; //not allowed to customize it because we want to load an external swagger for this
            gc_logger_1.Logger.debug(`SwaggerUiUrl path: ${swaggerUiUrl}`);
            app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
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
        Router.errorResponseKeys = errorResponseKeys || ['code', 'name', 'message', 'httpCode', 'errors'];
        (0, routing_controllers_1.useExpressServer)(app, config);
        gc_logger_1.Logger.info('Router loaded');
    }
    static getConfig() {
        return Router.routerConfig;
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map