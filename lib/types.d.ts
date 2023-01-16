import { RoutingControllersOptions } from 'routing-controllers';
import { OpenAPIObject } from 'openapi3-ts';
export type RoutingOptions = RoutingControllersOptions & ({
    enableDocumentation: true;
    documentationParameters: Partial<OpenAPIObject> & {
        title: string;
        baseUrl: string;
        description?: string;
    };
} | {
    enableDocumentation: false;
});
export declare class ResponseBase {
}
export declare class RequestBase {
}
export declare class ProcessingError extends Error {
    toJSON(): this;
}
