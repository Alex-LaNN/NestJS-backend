import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common'
import { FilmsService } from './films.service'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Role, limitCount } from 'src/shared/utils'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Film } from 'src/films/entities/film.entity'

@ApiTags('films')
@Controller('films')
@UseGuards(RolesGuard)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Roles(Role.Admin)
  @Post('create')
  @ApiOperation({ summary: 'Create new "film"' })
  async create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(createFilmDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "films" resources' })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Film>> {
    if (limit > limitCount) limit = limitCount
    return this.filmsService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "film" by its "id"' })
  async findOne(@Param('id') id: string): Promise<Film> {
    return await this.filmsService.findOne(id)
  }

  @Roles(Role.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update resource "film" by its "id"' })
  async update(
    @Param('id') id: string,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return await this.filmsService.update(id, updateFilmDto)
  }

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "film" by its "id"' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.filmsService.remove(id)
  }
}
