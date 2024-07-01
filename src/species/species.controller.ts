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
import { SpeciesService } from './species.service'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Species } from 'src/species/entities/species.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRoles, limitCount } from 'src/shared/utils'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@ApiTags('species')
@Controller('species')
@UseGuards(RolesGuard)
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Roles(UserRoles.Admin)
  @Post('create')
  @ApiOperation({ summary: 'Create new "species"' })
  async create(@Body() createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    return this.speciesService.create(createSpeciesDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "species" resources' })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Species>> {
    return this.speciesService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "species" by its "id"' })
  async findOne(@Param('id') id: string): Promise<Species> {
    return this.speciesService.findOne(id)
  }

  @Roles(UserRoles.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update resource "species" by its "id"' })
  async update(
    @Param('id') id: string,
    @Body() updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    return this.speciesService.update(id, updateSpeciesDto)
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "species" by its "id"' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.speciesService.remove(id)
  }
}
