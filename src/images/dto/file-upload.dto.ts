import { ApiProperty } from '@nestjs/swagger'

/**
 * FileUploadDto: Data Transfer Object for file uploads
 *
 * This class represents the data structure for file uploads. It uses the
 * `@ApiProperty` decorator from `@nestjs/swagger` to define the property
 * and its description for Swagger documentation.
 */
export class FileUploadDto {
  /**
   * File: The file to be uploaded
   *
   * This property represents the file to be uploaded. It is decorated with
   * `@ApiProperty` to indicate its type as 'string' and format as 'binary'.
   * This means that the property should contain a base64-encoded string
   * representing the file's content.
   */
  @ApiProperty({ description: 'File', type: 'string', format: 'binary' })
  file: Express.Multer.File
}
