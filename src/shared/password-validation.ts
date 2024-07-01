import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { RegistrationRequestDto } from 'src/auth/dto/registration-request.dto'

/**
 * Custom validation constraint to ensure value consistency between properties.
 *
 * This validator is used to check that two properties in a DTO have the same value.
 * In this case, the password and password confirmation must be the same.
 */
@ValidatorConstraint({ name: 'match', async: false })
@Injectable()
export class MatchValidator implements ValidatorConstraintInterface {
  /**
   * Validates if the provided value matches the value of another property on the DTO.
   *
   * @param value The value to be validated.
   * @param args Arguments passed to the validation constraint.
   *             - constraints: An array containing the name of the related property to compare with.
   * @returns boolean True if the values match, false otherwise.
   */
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as RegistrationRequestDto)[
      relatedPropertyName
    ]
    return value === relatedValue
  }

  /**
   * Generates the default error message when the validation fails.
   *
   * @param args Arguments passed to the validation constraint.
   *             - constraints: An array containing the name of the related property to compare with.
   * @returns string The default error message.
   */
  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints
    return `$property must match ${relatedPropertyName}.`
  }
}
