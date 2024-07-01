import * as emailValidator from 'email-validator'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class EmailValidationService {
  private readonly logger = new Logger(EmailValidationService.name)

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

  private isValidEmailFormat(email: string): boolean {
    return emailValidator.validate(email)
  }

  private isValidDomain(email: string): boolean {
    // Простая проверка существования домена.
    const domain = email.split('@')[1]
    // Простая проверка на недопустимый домен.
    return domain && domain !== 'example.com'
  }
}
