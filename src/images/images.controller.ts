import {
  Controller,
  Post,
  Param,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
  ParseFilePipe,
  FileTypeValidator,
  UseInterceptors,
} from '@nestjs/common'
import { ImagesService } from './images.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileUploadDto } from './dto/file-upload.dto'
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('images')
@ApiTags('images')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload/entity/:entity/id/:id/description/:description')
  //@Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 3000 }),
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('entity') entityName: string,
    @Param('id') id: number,
    @Param('description') description: string,
  ) {
    console.log(`imco:46 - file: ${JSON.stringify(file), null, 2}`)
    return await this.imagesService.uploadImage(
      file.originalname,
      file.buffer,
      entityName,
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
    @Param('id') id: number,
  ): Promise<void> {
    return this.imagesService.removeImagesOfAnEntity(entity, id)
  }
}
