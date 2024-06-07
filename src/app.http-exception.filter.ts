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
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger
  constructor() {
    this.logger = new Logger()
  }
  /**
   * Глобальный обработчик ошибок для перехвата необработанных исключений
   * @param exception Ошибка, которая была выброшена
   * @param host Аргумент, который предоставляет информацию о контексте запроса
   */
  catch(exception: Error, host: ArgumentsHost) {
    // Получение контекста HTTP запроса
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    // Определение кода ошибки
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    // Определение сообщения об ошибке
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error'
    // Создание объекта ответа об ошибке
    const errorResponse: ErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      message: exception?.message,
    }

    // Отправление ответа с информацией об ошибке
    response.status(statusCode).json(errorResponse)
  }
}
