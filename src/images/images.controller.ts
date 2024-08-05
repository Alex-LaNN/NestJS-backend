import {
  Controller,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  FileTypeValidator,
  UseInterceptors,
} from '@nestjs/common'
import { ImagesService } from './images.service'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { FileUploadDto } from './dto/file-upload.dto'
import { AdminGuard } from 'src/auth/guards/admin.guard'
import { FileInterceptor } from '@nestjs/platform-express'

/**
 * Controller handling image upload and deletion.
 *
 * This controller provides endpoints for uploading and deleting images. It is secured with the AdminGuard
 * and only accessible to authenticated users with admin privileges.
 */
@Controller('images')
@ApiTags('images')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Upload an image file for a specified entity.
   *
   * This endpoint handles image file uploads for a specific entity identified by its ID.
   * The uploaded file is validated to be of the correct type (JPEG, JPG, PNG, JFIF) using the ParseFilePipe
   * and FileTypeValidator. The file, along with entity name, ID, and optional description, is passed to the
   * ImagesService for processing and storage.
   *
   * @param file The uploaded image file (validated as JPEG, JPG, PNG, JFIF)
   * @param entityName The name of the entity the image is associated with
   * @param id The ID of the entity the image is associated with
   * @param description An optional description of the image
   * @returns A promise resolving to the result of the image upload operation
   */
  @Post('upload/:entity/:id/:description')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiParam({ name: 'description', required: false })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 3000 }),
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|jfif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('entity') entityName: string,
    @Param('id') id: number,
    @Param('description') description: string,
  ) {
    return await this.imagesService.uploadImage(
      file.originalname,
      file.buffer,
      entityName,
      id,
      description,
    )
  }

  /**
   * Delete an image by its name.
   *
   * This endpoint handles the deletion of a specific image identified by its name.
   * The image name is passed as a parameter to the ImagesService for deletion.
   *
   * @param imagename The name of the image to be deleted
   * @returns A promise resolving to a message indicating the result of the deletion operation
   */
  @Delete('delete/:imagename')
  async removeImage(@Param('imagename') imagename: string): Promise<string> {
    return this.imagesService.removeImage(imagename)
  }

  /**
   * Delete all images associated with a specific entity.
   *
   * This endpoint handles the deletion of all images associated with a specified entity identified by its ID.
   * The entity name and ID are passed as parameters to the ImagesService for deletion.
   *
   * @param entityName The name of the entity whose images are to be deleted
   * @param id The ID of the entity whose images are to be deleted
   * @returns A promise resolving to a message indicating the result of the deletion operation
   */
  @Delete('delete/:entity/:id')
  async removeImagesOfAnObject(
    @Param('entity') entityName: string,
    @Param('id') id: number,
  ): Promise<string> {
    return this.imagesService.removeImagesOfAnEntity(entityName, id)
  }
}
