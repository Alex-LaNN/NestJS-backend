import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

/**
 * Interface defining the structure of a response object
 *
 * This interface defines the expected structure of a response object returned by controllers.
 * It specifies a `data` property that holds the actual data to be sent in the response. The type of data
 * can vary depending on the specific endpoint.
 *
 * @param T The type of data contained in the response.
 */
export interface Response<T> {
  data: T
}

/**
 * Union type representing either a valid response object or a string
 *
 * This union type defines two possible types for the response:
 *  - `Response<T>`: A valid response object with a `data` property of type `T`.
 *  - `string`: A string representing a direct response message (not wrapped in a data object).
 * This allows for flexibility in how controllers can structure their responses.
 *
 * @param T The type of data contained in the response.
 */
type ResponseOrString<T> = Response<T> | string

/**
 * Interceptor for transforming controller responses
 *
 * This interceptor is designed to transform the response objects returned by controllers before they are sent to the client.
 * It injects the `NestInterceptor` interface to mark it as an interceptor and specifies the generic type `T` for the response data.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseOrString<T>>
{
  /**
   * Intercepts controller execution and transforms the response
   *
   * This method implements the `intercept` method required by the `NestInterceptor` interface.
   * It takes the execution context (`context`) and the next handler (`next`) as arguments.
   * The `next.handle()` call invokes the controller handler and returns an observable representing the controller's response.
   * The interceptor then uses the `pipe` method on the observable to apply transformations using the `map` operator.
   *
   * @param context (ExecutionContext) The execution context of the intercepted request.
   * @param next (CallHandler) The next handler in the interceptor chain.
   * @returns Observable<ResponseOrString<T>> An observable that emits the transformed response object or string.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseOrString<T>> {
    return next.handle().pipe(
      map((element) => {
        // Check if the element is a string and return it directly (no transformation)
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