import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateStarshipDto } from './dto/create-starship.dto'
import { UpdateStarshipDto } from './dto/update-starship.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Starship } from 'src/starships/entities/starship.entity'
import { Repository } from 'typeorm'
import { People } from 'src/people/entities/people.entity'
import { Film } from 'src/films/entities/film.entity'
import { ImagesService } from 'src/images/images.service'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { getResponceOfException } from 'src/shared/common.functions'
import { relatedEntitiesMap } from 'src/shared/utils'

@Injectable()
export class StarshipsService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Starship)
    private readonly starshipsRepository: Repository<Starship>,
    // Инъекции репозиториев для связанных сущностей.
    @InjectRepository(People)
    @InjectRepository(Film)
    private readonly repositories: {
      pilots: Repository<People>
      films: Repository<Film>
    },
    private readonly imagesService: ImagesService,
  ) {
    this.relatedEntities = relatedEntitiesMap.starships.relatedEntities
  }

  /**
   *
   * @param createStarshipDto
   * @returns
   */
  async create(createStarshipDto: CreateStarshipDto) {
    try {
      const existsStarship: Starship = await this.starshipsRepository.findOne({
        where: { name: createStarshipDto.name },
      })
      if (existsStarship) {
        throw new HttpException(
          'Starship already exists!',
          HttpStatus.FORBIDDEN,
        )
      }

      const newStarship: Starship = new Starship()
      // Проход по полям DTO и заполнение объекта 'newStarship'.
      for (const key in createStarshipDto) {
        newStarship[key] = this.relatedEntities.includes(key)
          ? []
          : createStarshipDto[key]
      }
      // Заполнение связанных сущностей.
      await this.fillRelatedEntities(newStarship, createStarshipDto)
      return this.starshipsRepository.save(newStarship)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   *
   * @param options
   * @returns
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Starship>> {
    try {
      return paginate<Starship>(this.starshipsRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   *
   * @param starshipId
   * @returns
   */
  async findOne(starshipId: string) {
    const starship: Starship = await this.starshipsRepository.findOneOrFail({
      where: {
        id: Number(starshipId),
      },
    })
    return starship
  }

  /**
   *
   * @param starshipId
   * @param updateStarshipDto
   * @returns
   */
  async update(starshipId: string, updateStarshipDto: UpdateStarshipDto) {
    try {
      const starship: Starship = await this.findOne(starshipId)
      // Обновление свойств 'starship' на основе данных из 'updateStarshipDto'.
      for (const key in updateStarshipDto) {
        if (updateStarshipDto.hasOwnProperty(key) && updateStarshipDto[key]) {
          starship[key] = updateStarshipDto[key]
        }
      }
      // Обновление поля 'edited'.
      starship.edited = new Date()
      // Обновление данных о 'Starship'.
      await this.fillRelatedEntities(starship, updateStarshipDto)
      return await this.starshipsRepository.save(starship)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   *
   * @param starshipId
   */
  async remove(starshipId: string) {
    try {
      const starship: Starship = await this.findOne(starshipId)
      await this.starshipsRepository.remove(starship)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   *
   * @param starship
   * @param newStarshipDto
   */
  private async fillRelatedEntities(
    starship: Starship,
    newStarshipDto: CreateStarshipDto | UpdateStarshipDto,
  ): Promise<void> {
    try {
      await Promise.all(
        this.relatedEntities.map(async (key) => {
          if (newStarshipDto[key]) {
            starship[key] = await Promise.all(
              newStarshipDto[key].map(async (elem: string) => {
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
