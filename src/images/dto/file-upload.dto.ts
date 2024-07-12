import { ApiProperty } from '@nestjs/swagger'

export class FileUploadDto {
  @ApiProperty({ description: 'File', type: 'string', format: 'binary' })
  file: Express.Multer.File
}
