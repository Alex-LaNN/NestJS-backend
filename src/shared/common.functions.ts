import { HttpException, InternalServerErrorException } from '@nestjs/common'
import {
  ExtendedBaseEntity,
  UserRoles,
  errorMap,
  localUrl,
  swapiUrl,
} from './utils'
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity'
import { ConfigService } from '@nestjs/config'

/**
 * Sets a field value for an object extending `ExtendedBaseEntity`
 *
 * This function is a generic helper function that sets the value of a specific field (`key`) for an object (`obj`)
 * that extends the `ExtendedBaseEntity` interface. It takes the object (`obj`), the field key (`key`), and the field value (`value`) as arguments.
 *
 * @param obj (T) The object extending `ExtendedBaseEntity` for which to set the field value.
 * @param key (K) The key of the field to be set.
 * @param value (T[K]) The value to be set for the specified field.
 */
export function setObjectField<T extends ExtendedBaseEntity, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
) {
  obj[key] = value
}

/**
 * Generates an error response based on the provided exception object
 *
 * This function handles various types of exceptions and generates an appropriate error response. It takes an `error` object as an argument.
 *
 * @param error (any) The exception object to handle.
 * @returns Error The generated error object with appropriate status code and message.
 */
export function getResponceOfException(error: any): Error {
  // Check if the error is an HttpException
  if (error instanceof HttpException) {
    return new HttpException(
      {
        message: error.message,
        errors: error.name,
      },
      error.getStatus(),
    )
  }
  // Handle errors based on status code
  if (error.status in errorMap) {
    return errorMap[error.status]
  }
  // Handle remaining errors as InternalServerErrorException
  return new InternalServerErrorException('Internal server error', error)
}

/**
 * Hashes a password using bcrypt
 *
 * This function hashes a provided password (`enteredPassword`) using the bcrypt library. It generates a random salt using `bcrypt.genSaltSync` and then hashes the password using `bcrypt.hashSync`.
 *
 * @param enteredPassword (string) The password to be hashed.
 * @returns Promise<string> The hashed password.
 */
export async function hashPassword(enteredPassword: string): Promise<string> {
  // Generate a random salt
  const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))

  // Hash the user's password
  return bcrypt.hashSync(enteredPassword, salt)
}

/**
 * Checks if a user is an admin
 *
 * This function checks if a provided user (`user`) has the `Admin` role. It compares the user's `role` property to `UserRoles.Admin`.
 *
 * @param user (User) The user object to check.
 * @returns Promise<boolean> A boolean indicating whether the user is an admin.
 */
export async function isUserAdmin(user: User): Promise<boolean> {
  // Compare user's role to Admin role
  return user.role === UserRoles.Admin
}

/**
 * Extracts an ID from a URL
 *
 * This function extracts an ID from a provided URL (`url`). It handles both single URLs and arrays of URLs. If the URL is an array, it extracts IDs from each element of the array.
 *
 * @param url (any) The URL or array of URLs to extract IDs from.
 * @returns Promise<number | number[] | null> The extracted ID (or array of IDs) or null if no ID is found.
 */
export async function extractIdFromUrl(
  url: any,
): Promise<number | number[] | null> {
  if (Array.isArray(url)) {
    if (!url) return []
    const ids = await Promise.all(
      url.map(async (element: any) => {
        const id = await extractIdFromUrl(element)
        // Check if the result is a number or an array of numbers
        if (Array.isArray(id)) {
          throw new Error('Nested arrays not supported')
        }
        return id
      }),
    )
    return ids as number[]
  }
  if (!url) return null
  const regex = /\/(\d+)\/?$/
  const match = url.match(regex)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  } else {
    throw new Error(`comfun:127 - Number not found. Invalid URL: ${url}`)
  }
}

/**
 * Generates a local URL for an entity based on its ID
 *
 * This function generates a local URL for a given entity (`entityName`) and its corresponding ID (`objectId`).
 * It concatenates the `localUrl` with the entity name, a forward slash, and the ID, resulting in a complete URL.
 *
 * @param entityName (string) The name of the entity.
 * @param objectId (number) The ID of the entity object.
 * @returns Promise<string> The generated local URL.
 */
export async function getBaseUrlOfEntityFromId(
  entityName: string,
  objectId: number,
): Promise<string> {
  return `${localUrl}${entityName}/${objectId}/`
  // return `<span class="math-inline">\{localUrl\}</span>{entityName}/${objectId}/`
}

/**
 * Replaces Star Wars API URLs with local URLs in a given string
 *
 * This function replaces all occurrences of the `swapiUrl` (Star Wars API URL) with the `localUrl` (local API URL) in the provided `url` string.
 * It utilizes the `replace()` method to perform the replacements.
 *
 * @param url (string) The string in which to replace URLs.
 * @returns Promise<string> The modified string with local URLs.
 */
export async function replaceUrl(url: string): Promise<string> {
  return url.replace(swapiUrl, localUrl)
}

/**
 * Extracts name and data of a related entity from a URL
 *
 * This function extracts the name and data of a related entity from a provided URL (`url`). It handles both single URLs and arrays of URLs.
 * It utilizes `getNameFromId` and `extractIdFromUrl` to extract the necessary information.
 *
 * @param url (string | string[]) The URL or array of URLs to extract data from.
 * @returns Promise<{ nameOfRelationEntity: string; relationDataIdToInsert: number | number[] }> An object containing the extracted name and data.
 */
export async function findNameAndDataOfRelationEntity(
  url: string | string[],
): Promise<{
  nameOfRelationEntity: string
  relationDataIdToInsert: number | number[]
}> {
  // Extract the name of the related entity
  const nameOfRelationEntity: string = await getObjectNameFromUrl(url)
  // Extract the data (ID) of the related entity
  const relationDataIdToInsert: number | number[] = await extractIdFromUrl(url)

  return {
    nameOfRelationEntity,
    relationDataIdToInsert,
  }
}

/**
 * Extracts the name of an object from its URL
 *
 * This function extracts the name of an object from its provided URL (`url`). It handles both single URLs and arrays of URLs.
 * It splits the URL into parts, filters out empty strings, and extracts the name from the third part of the URL.
 *
 * @param url (string | string[]) The URL or array of URLs to extract the name from.
 * @returns Promise<string> The extracted name of the object.
 */
export async function getObjectNameFromUrl(
  url: string | string[],
): Promise<string> {
  // Convert the URL to the first string if it's an array
  const actualUrl: string = Array.isArray(url) ? url[0] : url
  // Split the URL into parts and filter out empty strings
  const urlParts: string[] = actualUrl.split('/').filter(Boolean)
  // Check if the URL parts have at least 4 elements (minimum for the expected URL format)
  if (urlParts.length < 4) {
    throw new Error(`comfun:206 - The wrong URL format: ${actualUrl}`)
  }
  // Extract the object name from the third part of the URL
  const name: string = urlParts[2]
  // Return the extracted name
  return name
}

/**
 * Generates a URL for an image stored in AWS S3
 *
 * This function generates a URL for an image stored in AWS S3 using the provided `fileName` and `configService`.
 * It retrieves the bucket name and AWS S3 region from the environment variables using `configService.getOrThrow<string>('VARIABLE_NAME')`.
 * Finally, it constructs the URL by combining these values with the filename and returns the complete URL.
 *
 * @param fileName (string) The name of the image file stored in AWS S3.
 * @param configService (ConfigService) The configuration service to access environment variables.
 * @returns string The generated URL for the image in AWS S3.
 */
export function getImageStorageURL(
  fileName: string,
  configService: ConfigService,
): string {
  const bucketName: string = configService.getOrThrow<string>('BUCKET_NAME')
  const awsS3Region: string = configService.getOrThrow('AWS_S3_REGION')
  return `https://${bucketName}.s3.${awsS3Region}.amazonaws.com/${fileName}`
}

/**
 * Extracts the filename for deletion from AWS S3 storage
 *
 * This function parses the provided `fileName` to extract the actual filename
 * expected by AWS S3 for deletion. It assumes the filename format to be `<prefix>_<actual_filename>`.
 * If the format is invalid (less than 2 parts separated by an underscore), it throws an error.
 *
 * @param fileName The filename string received (potentially containing a prefix).
 * @returns The actual filename expected by AWS S3 for deletion.
 * @throws Error if the filename format is invalid.
 */
export function getFileNameForDeleteFromAWS(fileName: string): string {
  const parts = fileName.split('_')
  if (parts.length < 2) {
    throw new Error('Invalid image name format: ' + fileName)
  }
  return parts[1]
}
