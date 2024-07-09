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
import { PlanetsService } from './planets.service'
import { CreatePlanetDto } from './dto/create-planet.dto'
import { UpdatePlanetDto } from './dto/update-planet.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { Planet } from 'src/planets/entities/planet.entity'
import { AdminGuard } from 'src/auth/guards/admin.guard'

@ApiTags('planets')
@Controller('planets')
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreatePlanetDto })
  @ApiOperation({ summary: 'Create new "planet"' })
  async create(@Body() createPlanetDto: CreatePlanetDto): Promise<Planet> {
    return this.planetsService.create(createPlanetDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "planets" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Planet>> {
    return this.planetsService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "planet" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Planet> {
    return this.planetsService.findOne(id)
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePlanetDto })
  @ApiOperation({ summary: 'Update resource "planet" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updatePlanetDto: UpdatePlanetDto,
  ): Promise<Planet> {
    return this.planetsService.update(id, updatePlanetDto)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "planet" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.planetsService.remove(id)
  }
}
