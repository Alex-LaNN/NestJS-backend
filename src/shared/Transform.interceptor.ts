import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

/**
 * Interface defining the structure of a response object.
 *
 * @param T The type of data contained in the response.
 */
export interface Response<T> {
  data: T
}

/**
 * Union type representing either a valid response object or a string.
 *
 * @param T The type of data contained in the response.
 */
type ResponseOrString<T> = Response<T> | string

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseOrString<T>>
{
  /**
   * Intercepts the response stream and transforms the response data.
   *
   * @param context The execution context of the request.
   * @param next The call handler to be executed.
   * @returns An observable stream of transformed response data.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseOrString<T>> {
    return next.handle().pipe(
      map((element) => {
        // Check if the element is a string and return it directly
        if (typeof element === 'string') {
          return element
        }
        // Check if the element is an array and wrap each item in a data object
        if (Array.isArray(element)) {
          return { data: element.map((item) => ({ ...item })) }
        }
        // Wrap a single object in a data property
        return { data: element }
      }),
    )
  }
}