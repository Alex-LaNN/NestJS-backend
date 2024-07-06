import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ErrorResponse } from './shared/utils'

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger
  constructor() {
    this.logger = new Logger(CustomExceptionFilter.name)
  }
  /**
   * Global exception handler to intercept unhandled exceptions.
   *
   * This method is called whenever an exception is thrown anywhere in the application.
   * It handles both HTTP exceptions (those thrown by Express and NestJS) and generic JavaScript errors.
   *
   * @param exception The error object that was thrown.
   * @param host The argument object that provides information about the request context.
   */
  catch(exception: Error, host: ArgumentsHost) {
    console.trace('TRACE')
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
      exception,
    )

    // Send the error response to the client
    response.status(statusCode).json(errorResponse)
  }
}
