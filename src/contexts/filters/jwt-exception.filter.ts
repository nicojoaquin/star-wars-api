import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException
} from '@nestjs/common';
import { Response } from 'express';

import { TokenExpiredException } from '../exceptions/token-expired.exception';
import { InvalidTokenException } from '../exceptions/token-invalid-exception';

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof TokenExpiredException) {
      response.status(status).json({
        statusCode: status,
        message: 'Your session has expired',
        error: 'TokenExpiredError'
      });
    } else if (exception instanceof InvalidTokenException) {
      response.status(status).json({
        statusCode: status,
        message: 'Invalid token',
        error: 'InvalidTokenError'
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.message || 'Unauthorized'
      });
    }
  }
}
