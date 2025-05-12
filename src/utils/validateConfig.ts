import {ClassConstructor, plainToClass} from "class-transformer";
import {validateSync} from "class-validator";

export const validateConfig = <T extends object>(
    config: Record<string, unknown>,
    envVariablesClass: ClassConstructor<T>) => {

    const validatedConfig = plainToClass(envVariablesClass, config, {
        enableImplicitConversion: true
    });

    const validationErrors = validateSync(validatedConfig, {
        skipMissingProperties: false
    });

    if(validationErrors.length > 0) {
        throw new Error(validationErrors.toString());
    }

    return validatedConfig;
}