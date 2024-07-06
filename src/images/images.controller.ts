import {
  Controller,
  Post,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ImagesService } from './images.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileUploadDto } from './dto/create-image.dto'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserRoles } from 'src/shared/utils'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Controller('images')
@ApiTags('images')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRoles.Admin)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload/entity/:entity/id/:id/description/:description')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(jpeg|jpg|png)',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Param('entity') entity: string,
    @Param('id') id: number,
    @Param('description') description: string,
  ) {
    return await this.imagesService.uploadImage(
      file.originalname,
      file.buffer,
      entity,
      id,
      description,
    )
  }

  @Delete('delete/imagename/:imagename')
  async removeImage(@Param('imagename') imagename: string): Promise<void> {
    return this.imagesService.removeImage(imagename)
  }

  @Delete('delete/entity/:id')
  async removeImagesOfAnObject(
    @Param('entity') entity: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.imagesService.removeImagesOfAnEntity(entity, id)
  }
}
