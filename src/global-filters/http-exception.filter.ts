import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger} from "@nestjs/common";
import {Response} from 'express';
import {ConfigService} from "@nestjs/config";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpException.name);
    constructor(private readonly configService: ConfigService) {}

    catch(exception: HttpException, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
        this.logger.error(`Exception: ${exception.message}, status: ${status}`);

        response.status(status).json(
            isProduction
            ? {
                statusCode: status,
                message: exception.message,
                timestamp: new Date().toISOString(),
              }
            : {
                statusCode: status,
                message: exception.message,
                timestamp: new Date().toISOString(),
                stacktrace: exception.stack,
              }
        )
    }
}