import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Species } from 'src/species/entities/species.entity'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { getResponceOfException } from 'src/shared/common.functions'
import { localUrl, relatedEntitiesMap } from 'src/shared/utils'

/**
 * Сервис для работы с сущностью 'Species' (виды)
 *
 * Предоставляет методы для создания, получения, обновления и удаления записей
 * о видах существ в базе данных.
 */
@Injectable()
export class SpeciesService {
  private readonly relatedEntities: string[]
  constructor(
    // Репозиторий для сущности 'Species'
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    // Инъекции репозиториев для связанных сущностей.
    @InjectRepository(People)
    @InjectRepository(Film)
    @InjectRepository(Planet)
    private readonly repositories: {
      residents: Repository<People>
      films: Repository<Film>
      homeworld: Repository<Planet>
    },
  ) {
    this.relatedEntities = relatedEntitiesMap.species.relatedEntities
  }

  /**
   * Создает новую запись о виде существа
   *
   * @param createSpeciesDto Данные для создания новой записи (объект CreateSpeciesDto)
   * @returns Promise<Species> Возвращает созданный объект сущности 'Species'
   * @throws HttpException Ошибка с кодом HttpStatus.FORBIDDEN, если вид с таким названием уже существует
   */
  async create(createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    try {
      const existsSpecies: Species = await this.speciesRepository.findOne({
        where: { name: createSpeciesDto.name },
      })
      if (existsSpecies) {
        throw new HttpException('Species already exists!', HttpStatus.FORBIDDEN)
      }

      // Создание новой записи о 'species'.
      const newSpecies: Species = new Species()
      // Проход по полям DTO и заполнение объекта 'Species'.
      for (const key in createSpeciesDto) {
        newSpecies[key] = this.relatedEntities.includes(key)
          ? [] // Инициализация пустого массива для связанных сущностей
          : createSpeciesDto[key]
      }
      // Заполнение связанных сущностей.
      await this.fillRelatedEntities(newSpecies, createSpeciesDto)
      return this.speciesRepository.save(newSpecies)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Получает список видов существ с пагинацией
   *
   * @param options Параметры пагинации (объект IPaginationOptions)
   * @returns Promise<Pagination<Species>> Возвращает объект пагинации с данными о видах
   * @throws HttpException Ошибка с кодом HttpStatus.INTERNAL_SERVER_ERROR
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Species>> {
    try {
      return paginate<Species>(this.speciesRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Получает запись о виде существа по идентификатору
   *
   * @param speciesId Идентификатор вида существа (строка)
   * @returns Promise<Species> Возвращает объект сущности 'Species'
   * @throws throws HttpException Ошибка, если запись не найдена
   */
  async findOne(speciesId: number) {
    const species: Species = await this.speciesRepository.findOne({
      where: {
        id: speciesId,
      },
    })
    return species
  }

  /**
   * Обновляет запись о виде существа
   *
   * @param speciesId Идентификатор вида существа (строка)
   * @param updateSpeciesDto Данные для обновления записи (объект UpdateSpeciesDto)
   * @returns Promise<Species> Возвращает обновленный объект сущности 'Species'
   * @throws HttpException Ошибка, если запись не найдена
   */
  async update(
    speciesId: number,
    updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    try {
      const species: Species = await this.findOne(speciesId)
      // Обновление свойств 'species' на основе данных из 'updateSpeciesDto'.
      for (const key in updateSpeciesDto) {
        if (updateSpeciesDto.hasOwnProperty(key) && updateSpeciesDto[key]) {
          species[key] = updateSpeciesDto[key]
        }
      }
      // Обновление поля 'edited'.
      species.edited = new Date()
      // Обновление данных о 'species'.
      await this.fillRelatedEntities(species, updateSpeciesDto)
      return await this.speciesRepository.save(species)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Удаляет запись о виде существа по идентификатору
   *
   * @param speciesId Идентификатор вида существа (строка)
   * @throws HttpException Ошибка, если запись не найдена
   */
  async remove(speciesId: number) {
    try {
      const species: Species = await this.findOne(speciesId)
      await this.speciesRepository.remove(species)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Заполняет связанные сущности для новой или обновляемой записи 'Species'.
   *
   * @param species Объект сущности 'Species'
   * @param newSpeciesDto Данные для создания или обновления записи (объект CreateSpeciesDto | UpdateSpeciesDto)
   * @returns Promise<void>
   */
  private async fillRelatedEntities(
    species: Species,
    newSpeciesDto: CreateSpeciesDto | UpdateSpeciesDto,
  ): Promise<void> {
    await Promise.all(
      this.relatedEntities.map(async (key) => {
        if (key === 'homeworld' && newSpeciesDto.homeworld) {
          const urlToSearch: string = `${localUrl}planets/${newSpeciesDto.homeworld}/`
          const planet: Planet = await this.repositories.homeworld.findOne({
            where: { url: urlToSearch },
          })
          species.homeworld = planet
        } else if (newSpeciesDto[key]) {
          species[key] = await Promise.all(
            newSpeciesDto[key].map(async (elem: string) => {
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
