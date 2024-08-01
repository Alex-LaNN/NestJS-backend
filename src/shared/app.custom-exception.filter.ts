import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ErrorResponse } from './constants'

/**
 * Custom Exception Filter for handling application exceptions
 *
 * This class implements the `ExceptionFilter` interface and acts as a central handler for application exceptions.
 * It's decorated with `@Catch()` to catch all exceptions (`Catch()`) thrown throughout the application.
 */
@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name)

  /**
   * Catches and handles exceptions thrown during an HTTP request
   *
   * This method implements the `catch` method of the `ExceptionFilter` interface. It takes an `exception` object
   * and an `ArgumentsHost` object as arguments. The `ArgumentsHost` provides access to the current HTTP context.
   *
   * @param exception (Error) The exception object thrown during request processing.
   * @param host (ArgumentsHost) The arguments host object providing access to the HTTP context.
   */
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const statusCode = this.getStatus(exception)
    const message = this.getMessage(exception)

    const errorResponse: ErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception.name,
      message,
    }

    this.logError(exception, request, errorResponse)

    response.status(statusCode).json(errorResponse)
  }

  private getStatus(exception: Error): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(exception: Error): string {
    return exception instanceof HttpException
      ? exception.message
      : 'An unexpected error occurred'
  }

  private logError(
    exception: Error,
    request: Request,
    errorResponse: ErrorResponse,
  ) {
    this.logger.error(
      `Error occurred during request: ${request.method} ${request.url}`,
      exception.stack,
    )

    this.logger.log('Request headers: ' + JSON.stringify(request.headers))
    if (request.body && Object.keys(request.body).length) {
      this.logger.log('Request body: ' + JSON.stringify(request.body))
    }
    if (request.query && Object.keys(request.query).length) {
      this.logger.log('Request query: ' + JSON.stringify(request.query))
    }

    if (exception instanceof HttpException) {
      this.logger.error(
        `HttpException: ${exception.getResponse()}`,
        exception.stack,
        JSON.stringify(errorResponse),
      )
    } else {
      this.logger.error(
        `Exception: ${exception.message}`,
        exception.stack,
        JSON.stringify(errorResponse),
      )
    }
  }
}
