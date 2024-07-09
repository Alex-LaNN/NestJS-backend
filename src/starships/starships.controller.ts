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
import { StarshipsService } from './starships.service'
import { CreateStarshipDto } from './dto/create-starship.dto'
import { UpdateStarshipDto } from './dto/update-starship.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Starship } from 'src/starships/entities/starship.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { AdminGuard } from 'src/auth/guards/admin.guard'

@ApiTags('starships')
@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBody({ type: CreateStarshipDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new "starship"' })
  async create(
    @Body() createStarshipDto: CreateStarshipDto,
  ): Promise<Starship> {
    return this.starshipsService.create(createStarshipDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "starships" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Starship>> {
    return this.starshipsService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "starship" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Starship> {
    return this.starshipsService.findOne(id)
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update resource "starship" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updateStarshipDto: UpdateStarshipDto,
  ): Promise<Starship> {
    return this.starshipsService.update(id, updateStarshipDto)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "starship" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.starshipsService.remove(id)
  }
}
