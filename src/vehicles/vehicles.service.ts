import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Repository } from 'typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { ImagesService } from 'src/images/images.service'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'

@Injectable()
export class VehiclesService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    // Инъекции репозиториев для связанных сущностей.
    @InjectRepository(People)
    @InjectRepository(Film)
    private readonly repositories: {
      pilots: Repository<People>
      films: Repository<Film>
    },
    private readonly imagesService: ImagesService,
  ) {
    this.relatedEntities = ['pilots', 'films']
  }

  /**
   * Создает новый объект типа 'Vehicle' на основе предоставленных данных.
   * @param createVehicleDto Данные для создания нового объекта 'Vehicle'.
   * @returns Промис, который разрешается после успешного создания нового объекта 'Vehicle'.
   */
  async create(createVehicleDto: CreateVehicleDto) {
    try {
      // Проверка, существует ли уже объект с таким же именем.
      const existsVehicle: Vehicle = await this.vehicleRepository.findOne({
        where: { name: createVehicleDto.name },
      })
      if (existsVehicle) {
        // Если объект уже существует, генерируется исключение.
        throw new HttpException('Vehicle already exists!', HttpStatus.FORBIDDEN)
      }

      // Создание нового экземпляра объекта 'Vehicle'.
      const newVehicle: Vehicle = new Vehicle()
      // Проход по полям DTO и заполнение объекта 'newVehicle'.
      for (const key in createVehicleDto) {
        // Если поле является связанной сущностью, оно инициализируется пустым массивом.
        newVehicle[key] = this.relatedEntities.includes(key)
          ? []
          : createVehicleDto[key]
      }
      // Заполнение связанных сущностей.
      await this.fillRelatedEntities(newVehicle, createVehicleDto)
      // Сохранение нового объекта 'Vehicle' в репозитории.
      return this.vehicleRepository.save(newVehicle)
    } catch (error) {
      // Обработка ошибки и преобразование в стандартный формат ответа.
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Находит и возвращает список всех объектов типа 'Vehicle' с учетом параметров пагинации.
   * @param options Опции пагинации.
   * @returns Промис, который разрешается после успешного поиска и возврата списка всех объектов типа 'Vehicle'.
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Vehicle>> {
    try {
      // Выполнение запроса к репозиторию с учетом переданных опций пагинации.
      return paginate<Vehicle>(this.vehicleRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Находит объект типа 'Vehicle' по его идентификатору.
   * @param vehicleId Идентификатор объекта, который нужно найти.
   * @returns Промис, который разрешается после успешного нахождения объекта типа 'Vehicle'.
   */
  async findOne(vehicleId: string) {
    try {
      // Преобразование идентификатора в число.
      const searchParam: number = Number(vehicleId)
      // Поиск объекта по его идентификатору.
      const vehicle: Vehicle = await this.vehicleRepository.findOneOrFail({
        where: {
          id: searchParam,
        },
      })
      return vehicle
    } catch (error) {
      // Генерация исключения, если объект не найден.
      throw new HttpException(
        `Vehicle with ID ${vehicleId} not found!`,
        HttpStatus.NOT_FOUND,
      )
    }
  }

  /**
   * Обновляет сущность 'Vehicle' по ее идентификатору.
   * @param vehicleId Идентификатор сущности 'Vehicle', которую нужно обновить.
   * @param updateVehicleDto Данные для обновления сущности 'Vehicle'.
   * @returns Обновленную сущность 'Vehicle'.
   */
  async update(vehicleId: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      // Получение сущности 'Vehicle' по ее идентификатору.
      const vehicle: Vehicle = await this.findOne(vehicleId)
      // Обновление свойств 'Vehicle' на основе данных из 'updateVehicleDto'.
      for (const key in updateVehicleDto) {
        if (updateVehicleDto.hasOwnProperty(key) && updateVehicleDto[key]) {
          vehicle[key] = updateVehicleDto[key]
        }
      }
      // Установка поля 'edited' в текущую дату и время.
      vehicle.edited = new Date()
      // Обновление данных о 'Vehicle'.
      await this.fillRelatedEntities(vehicle, updateVehicleDto)
      // Сохранение обновленной сущности 'Vehicle' в базе данных.
      return await this.vehicleRepository.save(vehicle)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Удаляет сущность 'Vehicle' по ее идентификатору.
   * @param vehicleId  Идентификатор сущности 'Vehicle', которую нужно удалить.
   */
  async remove(vehicleId: string): Promise<void> {
    try {
      // Получение сущности 'Vehicle' по ее идентификатору.
      const vehicle: Vehicle = await this.findOne(vehicleId)
      // Удаление сущности 'Vehicle' из базы данных.
      await this.vehicleRepository.remove(vehicle)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Заполняет связанные сущности для 'Vehicle'.
   * @param entity Объект, для которого будут заполнены связанные сущности.
   * @param newVehicleDto Данные для объекта 'Vehicle'.
   */
  private async fillRelatedEntities(
    entity: Vehicle,
    newVehicleDto: CreateVehicleDto | UpdateVehicleDto,
  ): Promise<void> {
    try {
      // Параллельное заполнение связанных сущностей для каждого указанного ключа.
      await Promise.all(
        this.relatedEntities.map(async (key) => {
          if (newVehicleDto[key]) {
            // Получение связанных сущностей и присваивание их объекту 'entity'
            entity[key] = await Promise.all(
              newVehicleDto[key].map(async (elem: string) => {
                return await this.repositories[key].findOne({
                  where: { url: elem },
                })
              }),
            )
          }
        }),
      )
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
