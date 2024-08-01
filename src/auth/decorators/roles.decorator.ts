import { SetMetadata } from '@nestjs/common'
import { UserRoles } from 'src/shared/constants'

/**
 * Key used to mark roles in metadata.
 *
 * This constant is used as a key in the metadata to specify the roles required
 * for accessing certain routes.
 */
export const ROLES_KEY = 'roles'

/**
 * Decorator to specify roles required for accessing a route.
 *
 * This decorator function uses the `SetMetadata` function from NestJS to set metadata on a route,
 * indicating the roles that are allowed to access the route. The roles are passed as parameters to
 * the decorator and stored in the metadata using the `ROLES_KEY`.
 *
 * @param roles An array of roles that are allowed to access the route.
 * @returns A decorator function that sets the `roles` metadata with the specified roles.
 */
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles)
