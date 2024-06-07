import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreatePlanetDto } from './dto/create-planet.dto'
import { UpdatePlanetDto } from './dto/update-planet.dto'
import { Planet } from 'src/planets/entities/planet.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { ImagesService } from 'src/images/images.service'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { relatedEntitiesMap } from 'src/shared/utils'
import { getResponceOfException } from 'src/shared/common.functions'

@Injectable()
export class PlanetsService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Planet)
    private readonly planetsRepository: Repository<Planet>,
    // Инъекции репозиториев для связанных сущностей.
    @InjectRepository(People)
    @InjectRepository(Film)
    private readonly repositories: {
      residents: Repository<People>
      films: Repository<Film>
    },
    private readonly imagesService: ImagesService,
  ) {
    this.relatedEntities = relatedEntitiesMap.planets.relatedEntities
  }

  /**
   *
   * @param createPlanetDto
   * @returns
   */
  async create(createPlanetDto: CreatePlanetDto): Promise<Planet> {
    try {
      const existsPlanet: Planet = await this.planetsRepository.findOne({
        where: { name: createPlanetDto.name },
      })
      if (existsPlanet) {
        throw new HttpException('Film already exists!', HttpStatus.FORBIDDEN)
      }

      // Создание новой записи о 'planet'.
      const newPlanet: Planet = new Planet()
      // Проход по полям DTO и заполнение объекта 'Planet'.
      for (const key in createPlanetDto) {
        newPlanet[key] = this.relatedEntities.includes(key)
          ? []
          : createPlanetDto[key]
      }
      // Заполнение связанных сущностей.
      await this.fillRelatedEntities(newPlanet, createPlanetDto)
      return this.planetsRepository.save(newPlanet)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   *
   * @param options
   * @returns
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Planet>> {
    try {
      return paginate<Planet>(this.planetsRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   *
   * @param planetId
   * @returns
   */
  async findOne(planetId: string): Promise<Planet> {
    const planet: Planet = await this.planetsRepository.findOneOrFail({
      where: {
        id: Number(planetId),
      },
    })
    return planet
  }

  /**
   *
   * @param planetId
   * @param updatePlanetDto
   * @returns
   */
  async update(
    planetId: string,
    updatePlanetDto: UpdatePlanetDto,
  ): Promise<Planet> {
    try {
      const planet: Planet = await this.findOne(planetId)
      // Обновление свойств 'planet' на основе данных из 'updatePlanetDto'.
      for (const key in updatePlanetDto) {
        if (updatePlanetDto.hasOwnProperty(key) && updatePlanetDto[key]) {
          planet[key] = updatePlanetDto[key]
        }
      }
      // Обновление поля 'edited'.
      planet.edited = new Date()
      // Заполнение связанных сущностей в 'planet'.
      await this.fillRelatedEntities(planet, updatePlanetDto)
      return this.planetsRepository.save(planet)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   *
   * @param planetId
   */
  async remove(planetId: string): Promise<void> {
    try {
      const planet: Planet = await this.findOne(planetId)
      await this.planetsRepository.remove(planet)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Заполняет связанные сущности для нового, либо обновляемого объекта 'Planet'.
   * @param newPlanet Заполняемый объект.
   * @param newPlanetDto Новые данные для заполнения.
   */
  private async fillRelatedEntities(
    newPlanet: Planet,
    newPlanetDto: CreatePlanetDto | UpdatePlanetDto,
  ): Promise<void> {
    try {
      await Promise.all(
        this.relatedEntities.map(async (key) => {
          if (newPlanetDto[key]) {
            newPlanet[key] = await Promise.all(
              newPlanetDto[key].map(async (elem: string) => {
                return await this.repositories[key].findOneOrFail({
                  where: { url: elem },
                })
              }),
            )
          }
        }),
      )
    } catch (error) {
      throw getResponceOfException(error)
    }
  }
}
