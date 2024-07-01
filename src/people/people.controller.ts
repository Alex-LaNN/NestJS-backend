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
import { PeopleService } from './people.service'
import { CreatePeopleDto } from './dto/create-people.dto'
import { UpdatePeopleDto } from './dto/update-people.dto'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRoles, limitCount } from 'src/shared/utils'
import { Roles } from 'src/auth/decorator/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { People } from './entities/people.entity'

@ApiTags('people')
@Controller('people')
@UseGuards(RolesGuard)
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Roles(UserRoles.Admin)
  @Post('create')
  @ApiBody({ type: CreatePeopleDto })
  @ApiOperation({ summary: 'Create new "people"' })
  async create(@Body() createPeopleDto: CreatePeopleDto): Promise<People> {
    return await this.peopleService.create(createPeopleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "people" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<People>> {
    if (limit > limitCount) limit = limitCount
    return this.peopleService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "people" by its "id"' })
  async findOne(@Param('id') id: number): Promise<People> {
    return await this.peopleService.findOne(id)
  }

  @Roles(UserRoles.Admin)
  @Patch(':id')
  @ApiBody({ type: UpdatePeopleDto })
  @ApiOperation({ summary: 'Update resource "people" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updatePeopleDto: UpdatePeopleDto,
  ): Promise<People> {
    return await this.peopleService.update(id, updatePeopleDto)
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "people" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.peopleService.remove(id)
  }
}
