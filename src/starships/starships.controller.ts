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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Starship } from 'src/starships/entities/starship.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRoles, limitCount } from 'src/shared/utils'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@ApiTags('starships')
@Controller('starships')
@UseGuards(RolesGuard)
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  @ApiBearerAuth()
  @Roles(UserRoles.Admin)
  @Post('create')
  @ApiOperation({ summary: 'Create new "starship"' })
  async create(
    @Body() createStarshipDto: CreateStarshipDto,
  ): Promise<Starship> {
    return this.starshipsService.create(createStarshipDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "starships" resources' })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Starship>> {
    return this.starshipsService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "starship" by its "id"' })
  async findOne(@Param('id') id: string): Promise<Starship> {
    return this.starshipsService.findOne(id)
  }

  @ApiBearerAuth()
  @Roles(UserRoles.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update resource "starship" by its "id"' })
  async update(
    @Param('id') id: string,
    @Body() updateStarshipDto: UpdateStarshipDto,
  ): Promise<Starship> {
    return this.starshipsService.update(id, updateStarshipDto)
  }

  @ApiBearerAuth()
  @Roles(UserRoles.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "starship" by its "id"' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.starshipsService.remove(id)
  }
}
