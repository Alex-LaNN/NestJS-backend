import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common'
import { FilmsService } from './films.service'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { Film } from 'src/films/entities/film.entity'
import { AdminGuard } from 'src/auth/guards/admin.guard'

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreateFilmDto })
  @ApiOperation({ summary: 'Create new "film"' })
  async create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(createFilmDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "films" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Film>> {
    if (limit > limitCount) limit = limitCount
    return this.filmsService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "film" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Film> {
    return await this.filmsService.findOne(id)
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateFilmDto })
  @ApiOperation({ summary: 'Update resource "film" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return await this.filmsService.update(id, updateFilmDto)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "film" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.filmsService.remove(id)
  }
}
