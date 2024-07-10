import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'src/images/entities/image.entity'
import { Like, Repository } from 'typeorm'
import { Film } from 'src/films/entities/film.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Species } from 'src/species/entities/species.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { People } from 'src/people/entities/people.entity'
import {
  getImageStorageURL,
  getResponceOfException,
} from 'src/shared/common.functions'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

/**
 * ImagesService: Manages image storage and retrieval
 *
 * This service provides functionalities for uploading, removing, and retrieving images
 * associated with various entities in the application. It utilizes AWS S3 for image
 * storage and interacts with the `Image` repository to manage image data in the database.
 */
@Injectable()
export class ImagesService {
  // Initialize AWS S3 client with region from config
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  })

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    // Инъекции репозиториев для связанных сущностей
    @InjectRepository(People)
    @InjectRepository(Film)
    @InjectRepository(Starship)
    @InjectRepository(Planet)
    @InjectRepository(Species)
    @InjectRepository(Vehicle)
    private readonly repositories: {
      people: Repository<People>
      films: Repository<Film>
      starships: Repository<Starship>
      planets: Repository<Planet>
      species: Repository<Species>
      vehicles: Repository<Vehicle>
    },
  ) {}

  /**
   * Uploads an image associated with a specific entity
   *
   * This method uploads an image file to AWS S3 and creates a corresponding `Image` entity
   * in the database. It generates a unique filename based on the entity type and ID,
   * retrieves the image storage URL, and saves the image data and metadata to the database.
   *
   * @param fileName The original filename of the image
   * @param file The image buffer data
   * @param entityName The type of entity the image belongs to (e.g., "people", "films")
   * @param entityId The ID of the entity the image belongs to
   * @param description A description of the image
   * @returns A Promise resolving to the newly created `Image` entity object
   */
  async uploadImage(
    fileName: string,
    file: Buffer,
    entityName: string,
    entityId: number,
    description: string,
  ): Promise<Image> {
    console.log(`imser:62 - fileName: ${fileName}`) /////////////////////////////////////////
    try {
      // Generate unique filename based on entity and ID (by type: 'people-1_someImageFileName.jpg')
      const newImageName: string = `${entityName}-${entityId}_${fileName}`
      console.log(`imser:66 - newImageName: ${newImageName}`) ///////////////////////////////
      // Get image storage URL from config and filename
      const imageStorageUrl: string = getImageStorageURL(
        fileName,
        this.configService,
      )

      // Create new Image entity object
      const newImage: Image = this.imageRepository.create({
        name: newImageName,
        description: description,
        url: imageStorageUrl,
      })

      // Upload image to AWS S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow<string>('BUCKET_NAME'),
          Key: fileName,
          Body: file,
        }),
      )
      // Сделать заполнение одного из полей БД: принадлежности изображения к сущности !!!!!!!!!!!!!!!!!!!!!!!!
      // Save new Image entity to database
      return await this.imageRepository.save(newImage)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Removes an image by its name
   *
   * This method attempts to find an `Image` entity in the database with the provided
   * `imageName`. If found, it deletes the corresponding image from AWS S3 and then removes
   * the `Image` entity from the database.
   *
   * @param imageName The name of the image to be removed
   * @returns A Promise resolving to `void` upon successful image removal,
   *          or throws an error if the image is not found or cannot be deleted.
   */
  async removeImage(imageName: string): Promise<void> {
    try {
      // Find the Image entity in the repository by its name
      const image: Image = await this.imageRepository.findOne({
        where: {
          name: imageName,
        },
      })
      // If the image is not found, throw a NotFoundException
      if (!image) {
        throw new NotFoundException(`Image with name '${imageName}' not found.`)
      }

      // Delete the image from AWS S3
      // TODO: Implement AWS S3 image deletion based on the image's name

      // Remove the Image entity from the database
      await this.imageRepository.remove(image)
    } catch (error) {
      // Handle any errors and throw a standardized error response
      throw getResponceOfException(error)
    }
  }

  /**
   * Removes all images associated with a specific entity
   *
   * This method finds all `Image` entities in the database whose names match a pattern
   * corresponding to the given `entityName` and `entityId`. It then deletes the
   * corresponding images from AWS S3 and removes the `Image` entities from the database.
   *
   * @param entityName The type of entity (e.g., "people", "films")
   * @param entityId The ID of the entity
   * @returns A Promise resolving to `void` upon successful image removal,
   *          or throws an error if no images are found for the specified entity.
   */
  async removeImagesOfAnEntity(
    entityName: string,
    entityId: number,
  ): Promise<void> {
    try {
      // Find all Image entities matching the search pattern
      const imagesToDelete: Image[] = await this.imageRepository.find({
        where: {
          name: Like(`%${entityName}-${entityId}%`),
        },
      })
      // If no images are found, throw a NotFoundException
      if (!imagesToDelete.length)
        throw new NotFoundException(
          `Images for object '${entityName}' with ID '${entityId}' not found.`,
        )

      // Delete the images from AWS S3 (using their names)
      // TODO: Implement AWS S3 image deletion based on the images' names

      // Remove the Image entities from the database
      await this.imageRepository.remove(imagesToDelete)
    } catch (error) {
      // Handle any errors and throw a standardized error response
      throw getResponceOfException(error)
    }
  }
}
