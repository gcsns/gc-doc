"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFormatHandler = void 0;
const typedi_1 = require("typedi");
const gc_logger_1 = require("@gamechange/gc-logger");
const routing_controllers_1 = require("routing-controllers");
let ErrorFormatHandler = class ErrorFormatHandler {
    error(error, request, response, next) {
        const status = error.httpCode || error.statusCode || request.statusCode || 400;
        gc_logger_1.Logger.error('[Operation Failed]', error);
        if (error.errorIdentifier)
            delete error.errorIdentifier;
        if (error.stack)
            delete error.stack;
        response.status(status).json(Object.keys(error).length === 0 ? { message: error.message } : error);
        next();
    }
};
ErrorFormatHandler = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: 'after' })
], ErrorFormatHandler);
exports.ErrorFormatHandler = ErrorFormatHandler;
//# sourceMappingURL=middleware.js.map