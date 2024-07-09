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
import { SpeciesService } from './species.service'
import { CreateSpeciesDto } from './dto/create-species.dto'
import { UpdateSpeciesDto } from './dto/update-species.dto'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Species } from 'src/species/entities/species.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { AdminGuard } from 'src/auth/guards/admin.guard'

@ApiTags('species')
@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBody({ type: CreateSpeciesDto })
  @ApiOperation({ summary: 'Create new "species"' })
  async create(@Body() createSpeciesDto: CreateSpeciesDto): Promise<Species> {
    return this.speciesService.create(createSpeciesDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "species" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Species>> {
    return this.speciesService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "species" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Species> {
    return this.speciesService.findOne(id)
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBody({ type: UpdateSpeciesDto })
  @ApiOperation({ summary: 'Update resource "species" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updateSpeciesDto: UpdateSpeciesDto,
  ): Promise<Species> {
    return this.speciesService.update(id, updateSpeciesDto)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "species" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.speciesService.remove(id)
  }
}
