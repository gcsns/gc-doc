import { RoutingControllersOptions } from 'routing-controllers';
import { OpenAPIObject } from 'openapi3-ts';

export type RoutingOptions = RoutingControllersOptions &
    (
        {
              enableDocumentation: true;
              documentationParameters: Partial<OpenAPIObject> & {
                  title: string;
                  baseUrl: string;
                  description?: string;
              };
        } | {
              enableDocumentation: false;
        }
    );

export class ResponseBase {}

export class RequestBase {}

export class ProcessingError extends Error {
    toJSON() {
        return this;
    }
}

export type ErrorResponseType = {
    [key: string] : unknown;
}