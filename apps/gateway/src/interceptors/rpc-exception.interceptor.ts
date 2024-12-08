// Nestjs dependencies
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// Other dependencies
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        Logger.error(
          `Error: ${error.message || error.statusCode}`,
          error.stack,
          `${context.getClass().name}`,
        );

        if (error?.response) {
          const { message, statusCode } = error.response;
          return throwError(
            () => new HttpException(message, statusCode || 500),
          );
        }

        if (error?.error) {
          return throwError(
            () =>
              new HttpException(
                error.error.message || 'Internal server error',
                error.error.statusCode || 500,
              ),
          );
        }

        return throwError(
          () =>
            new InternalServerErrorException(
              error?.message || 'Internal server error',
            ),
        );
      }),
    );
  }
}
