import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${contentLength || 0}b sent - ${responseTime}ms - ${userAgent} - ${new Date().toISOString()}`
      );
    });

    next();
  }
}
