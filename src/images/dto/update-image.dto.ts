import { PartialType } from '@nestjs/swagger';
import { FileUploadDto } from './create-image.dto';

export class UpdateImageDto extends PartialType(FileUploadDto) {}
