import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ImagesService } from 'src/images/images.service'
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
import { relatedEntitiesMap } from 'src/shared/utils'

@Injectable()
export class SpeciesService {
  private readonly relatedEntities: string[]
  constructor(
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
    private readonly imagesService: ImagesService,
  ) {
    this.relatedEntities = relatedEntitiesMap.species.relatedEntities
  }

  /**
   *
   * @param createSpeciesDto
   * @returns
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
          ? []
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
   *
   * @param options
   * @returns
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Species>> {
    try {
      return paginate<Species>(this.speciesRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   *
   * @param speciesId
   * @returns
   */
  async findOne(speciesId: string) {
    const species: Species = await this.speciesRepository.findOneOrFail({
      where: {
        id: Number(speciesId),
      },
    })
    return species
  }

  /**
   *
   * @param speciesId
   * @param updateSpeciesDto
   * @returns
   */
  async update(
    speciesId: string,
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
   *
   * @param speciesId
   */
  async remove(speciesId: string) {
    try {
      const species: Species = await this.findOne(speciesId)
      await this.speciesRepository.remove(species)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Заполняет связанные сущности.
   * @param species Объект сущности.
   * @param newSpeciesDto Данные для создания новой записи о сущности.
   */
  private async fillRelatedEntities(
    species: Species,
    newSpeciesDto: CreateSpeciesDto | UpdateSpeciesDto,
  ): Promise<void> {
    await Promise.all(
      this.relatedEntities.map(async (key) => {
        if (key === 'homeworld' && newSpeciesDto.homeworld) {
          const planet: Planet =
            await this.repositories.homeworld.findOneOrFail({
              where: { url: newSpeciesDto.homeworld },
            })
          species.homeworld = planet
        } else if (newSpeciesDto[key]) {
          species[key] = await Promise.all(
            newSpeciesDto[key].map(async (elem: string) => {
              const entity = await this.repositories[key].findOneOrFail({
                where: { url: elem },
              })
              return entity.url
            }),
          )
        }
      }),
    )
  }
}
