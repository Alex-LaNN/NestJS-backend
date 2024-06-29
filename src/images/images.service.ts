import {
  HttpException,
  HttpStatus,
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
  getFileExtension,
  getResponceOfException,
} from 'src/shared/common.functions'
import { Entity, entityClasses } from 'src/shared/utils'

@Injectable()
export class ImagesService {
  //private readonly relatedEntities: string[]
  constructor(
//    private readonly configservice: ConfigService,
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
   * Загрузка изображения и привязки его к сущности.
   * 
   * @param fileName Название файла изображения.
   * @param file Файл изображения в виде буфера.
   * @param entityName Название сущности, к которой привязывается изображение.
   * @param entityId Идентификатор сущности, к которой привязывается изображение.
   * @param description Описание изображения.
   * @returns Промис с объектом изображения.
   */
  async uploadImage(
    fileName: string,
    file: Buffer,
    entityName: string,
    entityId: number,
    description: string,
  ): Promise<Image> {
    console.log(`is:63 - fileName: ${fileName}`) /////////////////////////////////////////
    try {
      // Генерация идентификатора для нового изображения.
      const newImageId: number = (await this.imageRepository.count()) + 1
      // Формирование названия нового изображения (по типу: 'people-1_someImageFileName-1.jpg')
      const newImageName: string = `${entityName}-${entityId}_${fileName}-${newImageId}.${getFileExtension(fileName)}`
      // Определение имени поля, к которому будет привязано изображение.
      const fieldName: string = entityName === 'films' ? 'title' : 'name'

      // Создание нового объекта изображения.
      const newImage: Image = this.imageRepository.create({
        id: newImageId,
        name: newImageName,
        description: description,
        //url: this.getImageStorageURL(fileName),
      })

      // Получение сущности, к которой будет привязано изображение.
      const entity: Entity | undefined = await this.repositories[entityName]
        .createQueryBuilder(entityClasses[entityName])
        .where('id = :id', { id: entityId })
        .getOne()

      if (!entity) {
        throw new HttpException(
          `${entityName} with id ${entityId} not found!`,
          HttpStatus.NOT_FOUND,
        )
      }
      // Привязка нового изображения к сущности.
      entity[fieldName] = newImage.name
      // Сохранение изменений в самой сущности.
      await this.repositories[entityName].save(entity)
      // Сохранение нового изображения в базе данных.
      return await this.imageRepository.save(newImage)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Удаляет изображение по его имени.
   * @param imageName Имя изображения для удаления.
   * @returns Промис, который разрешается после успешного удаления изображения.
   */
  async removeImage(imageName: string): Promise<void> {
    try {
      // Поиск изображения в репозитории по его имени.
      const image: Image = await this.imageRepository.findOne({
        where: {
          name: imageName,
        },
      })
      // Удаление найденного изображения из репозитория.
      await this.imageRepository.remove(image)
    } catch (error) {
      // Обработка ошибки и преобразование в стандартный формат ответа.
      throw getResponceOfException(error)
    }
  }

  /**
   * Удаляет все изображения, связанные с определенной сущностью.
   * 
   * @param entityName Имя сущности, к которой относятся изображения.
   * @param entityId Идентификатор сущности, к которой относятся изображения.
   * @returns Промис, который разрешается после успешного удаления изображений.
   */
  async removeImagesOfAnEntity(
    entityName: string,
    entityId: string,
  ): Promise<void> {
    try {
      // Поиск изображений для указанного объекта в репозитории.
      const imagesToDelete: Image[] = await this.imageRepository.find({
        where: {
          name: Like(`%${entityName}-${entityId}%`),
        },
      })
      // Проверка, были ли найдены изображения для удаления.
      if (!imagesToDelete.length)
        throw new NotFoundException(
          `Images for object '${entityName}' with ID '${entityId}' not found.`,
        )
      // Удаление найденных изображений из репозитория.
      await this.imageRepository.remove(imagesToDelete)
    } catch (error) {
      // Обработка ошибки и преобразование в стандартный формат ответа.
      throw getResponceOfException(error)
    }
  }
}
