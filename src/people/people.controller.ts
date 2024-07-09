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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { People } from './entities/people.entity'
import { AdminGuard } from 'src/auth/guards/admin.guard'

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
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

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePeopleDto })
  @ApiOperation({ summary: 'Update resource "people" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updatePeopleDto: UpdatePeopleDto,
  ): Promise<People> {
    return await this.peopleService.update(id, updatePeopleDto)
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "people" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.peopleService.remove(id)
  }
}
