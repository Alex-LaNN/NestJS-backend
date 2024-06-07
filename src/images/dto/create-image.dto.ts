import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FileUploadDto {
  @ApiProperty({ description: 'Image title.' })
  @IsString()
  imageName: string

  @ApiProperty({ description: 'Description of the image.' })
  @IsString()
  description: string

  @ApiProperty({ description: 'File', type: 'string', format: 'binary' })
  file: Express.Multer.File
}
