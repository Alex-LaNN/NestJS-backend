import * as emailValidator from 'email-validator'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'

/**
 * Service for validating email addresses
 *
 * This service provides functionalities for validating email addresses. It injects the `Logger` service
 * from `@nestjs/common` for logging purposes.
 */
@Injectable()
export class EmailValidationService {
  private readonly logger = new Logger(EmailValidationService.name)

  /**
   * Validates an email address
   *
   * This method validates the provided `email` address. It performs the following steps:
   *  1. Logs the email address being validated.
   *  2. Calls `isValidEmailFormat` to check for valid email format using `emailValidator`.
   *  3. Calls `isValidDomain` to check for a valid domain name.
   *  4. If all checks pass, logs success and returns `true`.
   *  5. If any check fails, logs a warning message and throws a `BadRequestException` with an appropriate message.
   *
   * @param email (string) The email address to be validated.
   * @returns Promise<boolean> A promise resolving to `true` if the email is valid, otherwise throws an error.
   */
  async validateEmail(email: string): Promise<boolean> {
    this.logger.log(`Validating email: ${email}`)

    if (!this.isValidEmailFormat(email)) {
      this.logger.warn(`Invalid email format: ${email}`)
      throw new BadRequestException('Invalid email format')
    }

    if (!this.isValidDomain(email)) {
      this.logger.warn(`Invalid email domain: ${email}`)
      throw new BadRequestException('Invalid email domain')
    }

    this.logger.log(`Email validation successful: ${email}`)
    return true
  }

  /**
   * Checks if the email format is valid
   *
   * This private helper function uses the `emailValidator` library to check if the provided `email` has a valid email format.
   *
   * @param email (string) The email address to check the format for.
   * @returns boolean True if the format is valid, false otherwise.
   */
  private isValidEmailFormat(email: string): boolean {
    return emailValidator.validate(email)
  }

  /**
   * Performs a basic check for a valid domain name
   *
   * This private helper function performs a basic check on the email domain. It extracts the domain name after the "@" symbol
   * and checks if it exists and is not simply "example.com" (a placeholder domain).
   *
   * @param email (string) The email address to check the domain of.
   * @returns boolean True if the domain seems valid based on this basic check, false otherwise.
   */
  private isValidDomain(email: string): boolean {
    // Simple check for domain existence.
    const domain = email.split('@')[1]
    // Simple check for invalid domain.
    return domain && domain !== 'example.com'
  }
}
