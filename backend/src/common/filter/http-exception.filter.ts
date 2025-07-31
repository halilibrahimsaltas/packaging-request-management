import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export interface ErrorResponse {
    success: boolean;
    timestamp: string;
    message: string;
    statusCode: number;
    path?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();
        
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string' 
                ? exceptionResponse 
                : (exceptionResponse as any).message || exception.message;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        const errorResponse: ErrorResponse = {
            success: false,
            timestamp: new Date().toISOString(),
            message,
            statusCode: status,
            path: request?.url
        };

        response.status(status).json(errorResponse);
    }
} 
