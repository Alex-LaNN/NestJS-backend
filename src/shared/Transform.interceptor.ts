import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable, map } from "rxjs"

export interface Response<T> {
  data: T
}

type ResponseOrString<T> = Response<T> | Response<T>[] | string

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseOrString<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseOrString<T> | Response<T>[]> {
    return next.handle().pipe(
      map((element) => {
        // Возврат строки без изменений
        if (typeof element === 'string') {
          return element
        }
        
        if (Array.isArray(element)) {
          return element.map((item) => ({ data: item })) as Response<T>[]
        }
        const result = {
          ...element,
          data: element.items || element,
        }
        delete result.items
        return result as Response<T>
      }),
    )
  }
}