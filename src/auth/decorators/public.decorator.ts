import { SetMetadata } from '@nestjs/common'

/**
 * Key used to mark routes as public.
 *
 * This constant is used as a key in the metadata to indicate that a route is public
 * and does not require authentication.
 */
export const IS_PUBLIC_KEY = 'isPublic'

/**
 * Decorator to mark a route as public.
 *
 * This decorator function uses the `SetMetadata` function from NestJS to set metadata on a route,
 * indicating that the route is public and does not require authentication.
 *
 * @returns A decorator function that sets the `isPublic` metadata to `true`.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
