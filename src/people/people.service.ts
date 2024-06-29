import { People } from './entities/people.entity'
import { CreatePeopleDto } from './dto/create-people.dto'
import { UpdatePeopleDto } from './dto/update-people.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { Injectable } from '@nestjs/common'
import { Species } from 'src/species/entities/species.entity'
import { Film } from 'src/films/entities/film.entity'
import { Starship } from 'src/starships/entities/starship.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { localUrl, relatedEntitiesMap } from 'src/shared/utils'
import { Image } from 'src/images/entities/image.entity'

@Injectable()
export class PeopleService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    // Инъекции репозиториев для связанных сущностей
    @InjectRepository(Film)
    @InjectRepository(Starship)
    @InjectRepository(Planet)
    @InjectRepository(Species)
    @InjectRepository(Vehicle)
    private readonly repositories: {
      films: Repository<Film>
      starships: Repository<Starship>
      homeworld: Repository<Planet>
      species: Repository<Species>
      vehicles: Repository<Vehicle>
      images: Repository<Image>
    },
  ) {
    this.relatedEntities = relatedEntitiesMap.people.relatedEntities
  }

  /**
   * Создает новую запись о персонаже.
   * @param createPeopleDto Данные для создания новой записи.
   * @returns Созданная запись о персонаже.
   */
  async create(createPeopleDto: CreatePeopleDto): Promise<People> {
    // Проверка на существование персонажа с таким именем
    const existsPeople: People = await this.peopleRepository.findOne({
      where: { name: createPeopleDto.name },
    })
    if (existsPeople) {
      console.error(`Сущность ${createPeopleDto.name} уже существует!`)
      return null
    }

    // Создание новой записи о персонаже
    let newPeople = new People()
    // Проход по полям DTO и заполнение объекта 'People'
    for (const key in createPeopleDto) {
      if (key === 'homeworld') continue
      newPeople[key] = this.relatedEntities.includes(key)
        ? []
        : createPeopleDto[key]
    }
    // Заполнение связанных сущностей
    await this.fillRelatedEntities(newPeople, createPeopleDto)
    return this.peopleRepository.save(newPeople)
  }

  /**
   * Возвращает список всех персонажей с поддержкой пагинации.
   * @param options Опции пагинации.
   * @returns Объект пагинации, содержащий результаты запроса и мета-информацию о пагинации.
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<People>> {
    return paginate<People>(this.peopleRepository, options)
  }

  /**
   * Возвращает данные о персонаже по его идентификатору.
   * @param peopleId Идентификатор персонажа.
   * @returns Данные о персонаже.
   */
  async findOne(peopleId: number): Promise<People> {
    return await this.peopleRepository.findOne({
      where: {
        id: peopleId,
      },
    })
  }

  /**
   *  Обновляет данные о персонаже по его идентификатору.
   * @param peopleId Идентификатор персонажа.
   * @param updatePeopleDto Новые данные о персонаже.
   * @returns Обновленные данные о персонаже.
   */
  async update(
    peopleId: number,
    updatePeopleDto: UpdatePeopleDto,
  ): Promise<People> {
    const person = await this.findOne(peopleId)
    // Подготовка объекта с обновленными данными.
    for (const key in updatePeopleDto) {
      if (updatePeopleDto.hasOwnProperty(key) && updatePeopleDto[key]) {
        person[key] = updatePeopleDto[key]
      }
    }
    // Обновление поля 'edited'.
    person.edited = new Date()
    // Заполнение связанных сущностей в 'people' на основе данных из 'updatePeopleDto'.
    await this.fillRelatedEntities(person, updatePeopleDto)
    return this.peopleRepository.save(person)
  }

  /**
   * Удаляет данные о персонаже по его идентификатору.
   * @param peopleId Идентификатор персонажа.
   */
  async remove(peopleId: number): Promise<void> {
    const person = await this.findOne(peopleId)
    await this.peopleRepository.remove(person)
  }

  /**
   * Заполняет связанные сущности для персонажа.
   * @param newPeople Объект персонажа.
   * @param newPersonDto Данные для создания новой записи о персонаже.
   */
  private async fillRelatedEntities(
    newPeople: People,
    newPersonDto: CreatePeopleDto | UpdatePeopleDto,
  ): Promise<void> {
    await Promise.all(
      this.relatedEntities.map(async (key) => {
        if (key === 'homeworld' && newPersonDto.homeworld) {
          const urlToSearch: string = `${localUrl}planets/${newPersonDto.homeworld}/`
          const planet: Planet = await this.repositories.homeworld.findOne({
            where: { url: urlToSearch },
          })
          newPeople.homeworld = planet
        } else if (newPersonDto[key]) {
          newPeople[key] = await Promise.all(
            newPersonDto[key].map(async (elem: string) => {
              const entity = await this.repositories[key].findOne({
                where: { url: elem },
              })
              return entity
            }),
          )
        }
      }),
    )
  }
}
