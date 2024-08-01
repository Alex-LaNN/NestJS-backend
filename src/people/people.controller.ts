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
import { limitCount } from 'src/shared/constants'
import { People } from './entities/people.entity'
import { AdminGuard } from 'src/auth/guards/admin.guard'

/**
 * PeopleController: Handles HTTP requests for "people" resources
 *
 * This controller handles CRUD (Create, Read, Update, Delete) operations for "people" resources
 * within the application. It utilizes the `PeopleService` to interact with the database
 * and manage "people" data.
 * Admin privileges are required for creating, updating, and deleting "people" resources
 * via the `AdminGuard`.
 */
@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  /**
   * Creates a new "people" resource
   *
   * This method creates a new "people" resource by accepting a `CreatePeopleDto` object
   * in the request body. It requires admin privileges enforced by the `AdminGuard`.
   *
   * @param createPeopleDto A DTO object containing data for the new "people" resource
   * @returns A Promise resolving to the newly created `People` entity object
   */
  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreatePeopleDto })
  @ApiOperation({ summary: 'Create new "people"' })
  async create(@Body() createPeopleDto: CreatePeopleDto): Promise<People> {
    return await this.peopleService.create(createPeopleDto)
  }

  /**
   * Retrieves all "people" resources (paginated)
   *
   * This method retrieves a paginated list of "people" resources. It accepts optional query
   * parameters `page` and `limit` to control the pagination behavior. The `limit` is capped
   * at a predefined value (`limitCount`) to prevent excessive data retrieval.
   *
   * @param page The page number to retrieve (defaults to 1)
   * @param limit The number of items per page (defaults to `limitCount`)
   * @returns A Promise resolving to a `Pagination<People>` object containing the paginated list
   */
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

  /**
   * Retrieves a single "people" resource by ID
   *
   * This method retrieves a single "people" resource by its ID specified in the URL parameter.
   *
   * @param id The ID of the "people" resource to retrieve
   * @returns A Promise resolving to the `People` entity object representing the resource
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get resource "people" by its "id"' })
  async findOne(@Param('id') id: number): Promise<People> {
    return await this.peopleService.findOne(id)
  }

  /**
   * Updates a "people" resource by ID
   *
   * This method updates an existing "people" resource by its ID. It requires admin privileges
   * enforced by the `AdminGuard` and accepts an `UpdatePeopleDto` object in the request body
   * containing the updated data.
   *
   * @param id The ID of the "people" resource to update
   * @param updatePeopleDto A DTO object containing the updated data for the "people" resource
   * @returns A Promise resolving to the updated `People` entity object
   */
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

  /**
   * Deletes a "people" resource by ID
   *
   * This method deletes a "people" resource by its ID. It requires admin privileges
   * enforced by the `AdminGuard`.
   *
   * @param id The ID of the "people" resource to delete
   * @returns A Promise resolving to `void` upon successful deletion
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "people" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.peopleService.remove(id)
  }
}
