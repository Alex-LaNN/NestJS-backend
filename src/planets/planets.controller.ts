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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRoles, limitCount } from 'src/shared/utils'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Planet } from 'src/planets/entities/planet.entity'

@ApiTags('planets')
@Controller('planets')
@UseGuards(RolesGuard)
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @ApiBearerAuth()
  @Roles(UserRoles.Admin)
  @Post('create')
  @ApiOperation({ summary: 'Create new "planet"' })
  async create(@Body() createPlanetDto: CreatePlanetDto): Promise<Planet> {
    return this.planetsService.create(createPlanetDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "planets" resources' })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Planet>> {
    return this.planetsService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "planet" by its "id"' })
  async findOne(@Param('id') id: string): Promise<Planet> {
    return this.planetsService.findOne(id)
  }

  @ApiBearerAuth()
  @Roles(UserRoles.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update resource "planet" by its "id"' })
  async update(
    @Param('id') id: string,
    @Body() updatePlanetDto: UpdatePlanetDto,
  ): Promise<Planet> {
    return this.planetsService.update(id, updatePlanetDto)
  }

  @ApiBearerAuth()
  @Roles(UserRoles.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "planet" by its "id"' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.planetsService.remove(id)
  }
}
