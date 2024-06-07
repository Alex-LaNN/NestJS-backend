import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Film } from 'src/films/entities/film.entity'
import { Planet } from 'src/planets/entities/planet.entity'
import { Repository } from 'typeorm'
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate'
import { People } from 'src/people/entities/people.entity'
import { ImagesService } from 'src/images/images.service'
import { Starship } from 'src/starships/entities/starship.entity'
import { Species } from 'src/species/entities/species.entity'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { relatedEntitiesMap } from 'src/shared/utils'
import { getResponceOfException } from 'src/shared/common.functions'

@Injectable()
export class FilmsService {
  private readonly relatedEntities: string[]
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    // Инъекции репозиториев для связанных сущностей.
    @InjectRepository(People)
    @InjectRepository(Starship)
    @InjectRepository(Planet)
    @InjectRepository(Species)
    @InjectRepository(Vehicle)
    private readonly repositories: {
      characters: Repository<People>
      starships: Repository<Starship>
      planets: Repository<Planet>
      species: Repository<Species>
      vehicles: Repository<Vehicle>
    },
    private readonly imagesService: ImagesService,
  ) {
    this.relatedEntities = relatedEntitiesMap.films.relatedEntities
  }

  /**
   *
   * @param createFilmDto
   * @returns
   */
  async create(createFilmDto: CreateFilmDto): Promise<Film> | null {
    try {
      await this.filmsRepository.findOneOrFail({
        where: { title: createFilmDto.title },
      })

      // Создание новой записи о фильме
      const newFilm: Film = new Film()
      // Проход по полям DTO и заполнение объекта 'Film'
      for (const key in createFilmDto) {
        newFilm[key] = this.relatedEntities.includes(key)
          ? []
          : createFilmDto[key]
      }
      // Заполнение связанных сущностей
      await this.fillRelatedEntities(newFilm, createFilmDto)
      return this.filmsRepository.save(newFilm)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Возвращает список всех персонажей с поддержкой пагинации.
   * @param options Опции пагинации.
   * @returns Объект пагинации, содержащий результаты запроса и мета-информацию о пагинации.
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<Film>> {
    try {
      return paginate<Film>(this.filmsRepository, options)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * Возвращает данные о фильме по его идентификатору.
   * @param filmId Идентификатор фильма.
   * @returns Данные о фильме.
   */
  async findOne(filmId: string): Promise<Film> {
    const film: Film = await this.filmsRepository.findOneOrFail({
      where: {
        id: Number(filmId),
      },
    })
    return film
  }

  /**
   *
   * @param filmId
   * @param updateFilmDto
   * @returns
   */
  async update(filmId: string, updateFilmDto: UpdateFilmDto): Promise<Film> {
    try {
      const film: Film = await this.findOne(filmId)
      // Обновление свойств фильма на основе данных из 'updateFilmDto'.
      for (const key in updateFilmDto) {
        if (updateFilmDto.hasOwnProperty(key) && updateFilmDto[key]) {
          film[key] = updateFilmDto[key]
        }
      }
      // Обновление поля 'edited'.
      film.edited = new Date()
      // Заполнение связанных сущностей в 'film'.
      await this.fillRelatedEntities(film, updateFilmDto)
      return this.filmsRepository.save(film)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   *  Удаляет фильм со всеми его данными по его идентификатору.
   * @param filmId Идентификатор фильма.
   */
  async remove(filmId: string): Promise<void> {
    try {
      const film: Film = await this.findOne(filmId)
      await this.filmsRepository.remove(film)
    } catch (error) {
      throw getResponceOfException(error)
    }
  }

  /**
   * Заполняет связанные сущности для нового, либо обновляемого объекта 'Film'.
   * @param newFilm Заполняемый объект.
   * @param newFilmDto Новые данные для заполнения.
   */
  private async fillRelatedEntities(
    newFilm: Film,
    newFilmDto: CreateFilmDto | UpdateFilmDto,
  ): Promise<void> {
    try {
      await Promise.all(
        this.relatedEntities.map(async (key: string) => {
          if (newFilmDto[key]) {
            newFilm[key] = await Promise.all(
              newFilmDto[key].map(async (elem: string) => {
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
