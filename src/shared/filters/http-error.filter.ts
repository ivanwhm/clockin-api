import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { handleErrorMessage } from 'src/core/helpers';

import { ErrorResponseDto } from '../dtos';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const authInfo = request.hasOwnProperty('authInfo') ? request['authInfo'] : undefined;

    const errorResponse: ErrorResponseDto = {
      code: status,
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      messages: handleErrorMessage(status, exception.message, authInfo),
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const loggerMessage = `${request.method} ${request.url}`;
      Logger.error(loggerMessage, exception.stack, 'HttpErrorFilter#catch');
    }

    response.status(status).json(errorResponse);
  }
}
