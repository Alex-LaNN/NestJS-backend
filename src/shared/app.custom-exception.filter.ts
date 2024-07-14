import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ErrorResponse } from './utils'

/**
 * Custom Exception Filter for handling application exceptions
 *
 * This class implements the `ExceptionFilter` interface and acts as a central handler for application exceptions.
 * It's decorated with `@Catch()` to catch all exceptions (`Catch()`) thrown throughout the application.
 */
@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger

  constructor() {
    this.logger = new Logger(CustomExceptionFilter.name)
  }

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
    // Get the HTTP request context
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // Determine the error status code
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // Determine the error message
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'An unexpected error occurred'

    // Create an error response object
    const errorResponse: ErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception.name,
      message: typeof message === 'string' ? message : JSON.stringify(message),
    }

    // Log the error details
    this.logger.error(
      `Error occurred during request: ${request.method} ${request.url}`,
      exception.stack, // Include stack trace in the log
    )

    // Detailed logging for diagnostics
    this.logger.log('Request headers: ' + JSON.stringify(request.headers))
    if (request.body) {
      this.logger.log('Request body: ' + JSON.stringify(request.body))
    }
    if (request.query) {
      this.logger.log('Request query: ' + JSON.stringify(request.query))
    }

    if (exception instanceof HttpException) {
      this.logger.error(
        `HttpException: ${exception.getResponse()}`,
        exception.stack,
      )
    } else {
      this.logger.error(`Exception: ${exception.message}`, exception.stack)
    }

    // Send the error response to the client
    response.status(statusCode).json(errorResponse)
  }
}
