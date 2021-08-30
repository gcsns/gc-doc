import { ProcessingError, ResponseBase } from './types';

export const parseErrors = () => (target: Function) => {
    const functions = Object.getOwnPropertyNames(target.prototype).filter((x) => x !== 'constructor');

    for (const propertyName of functions) {
        const propertyValue = target.prototype[propertyName];
        const isMethod = propertyValue instanceof Function;
        if (!isMethod) continue;

        const descriptor = getMethodDescriptor(propertyName);
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                const result = await (<Promise<ResponseBase>>originalMethod.apply(this, args));
                return result;
            } catch (e: any) {
                e.errorIdentifier = '!parseGeneratedError!';
                return <ProcessingError>e;
            }
        };

        Object.defineProperty(target.prototype, propertyName, descriptor);
    }

    function getMethodDescriptor(propertyName: string): TypedPropertyDescriptor<any> {
        if (target.prototype.hasOwnProperty(propertyName))
            return <PropertyDescriptor>Object.getOwnPropertyDescriptor(target.prototype, propertyName);

        // create a new property descriptor for the base class' method
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            value: target.prototype[propertyName]
        };
    }
};
