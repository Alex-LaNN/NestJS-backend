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

/**
 * StarshipsController
 *
 * This controller handles all API requests related to starships. It provides
 * functionalities for creating, retrieving, updating, and deleting starship
 * resources. The controller leverages the `StarshipsService` for business logic
 * and utilizes decorators from `@nestjs/swagger` for API documentation.
 *
 * @ApiTags('starships')
 * @Controller('starships')
 */
@ApiTags('starships')
@Controller('starships')
export class StarshipsController {
  constructor(private readonly starshipsService: StarshipsService) {}

  /**
   * Create Starship (Admin)
   *
   * This endpoint creates a new starship resource based on the provided data
   * in the request body. It requires admin authorization (`@UseGuards(AdminGuard)`)
   * and expects a `CreateStarshipDto` object in the body.
   *
   * @Post('create')
   * @ApiBody({ type: CreateStarshipDto })
   * @ApiBearerAuth()
   * @ApiOperation({ summary: 'Create new "starship"' })
   *
   * @param createStarshipDto (CreateStarshipDto) - Data Transfer Object containing starship creation details
   *
   * @returns Promise<Starship> - A promise resolving to the newly created Starship entity
   */
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

  /**
   * Get All Starships (Paginated)
   *
   * This endpoint retrieves a paginated list of all starship resources.
   * It utilizes optional query parameters for pagination:
   *   - `page`: The current page number (defaults to 1).
   *   - `limit`: The number of starships per page (defaults to `limitCount` defined elsewhere).
   *
   * @Get()
   * @ApiOperation({ summary: 'Get all the "starships" resources' })
   * @ApiQuery({ name: 'page', required: false })
   * @ApiQuery({ name: 'limit', required: false })
   *
   * @param page (number) - The current page number (optional, defaults to 1)
   * @param limit (number) - The number of starships per page (optional, defaults to limitCount)
   *
   * @returns Promise<Pagination<Starship>> - A promise resolving to a paginated list of Starship entities
   */
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

  /**
   * Get Starship by ID
   *
   * This endpoint retrieves a single starship resource by its unique identifier (`id`).
   *
   * @Get(':id')
   * @ApiOperation({ summary: 'Get resource "starship" by its "id"' })
   *
   * @param id (number) - The unique identifier of the starship resource to retrieve
   *
   * @returns Promise<Starship> - A promise resolving to the Starship entity matching the provided ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get resource "starship" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Starship> {
    return this.starshipsService.findOne(id)
  }

  /**
   * Update Starship (Admin)
   *
   * This endpoint updates an existing starship resource by its unique identifier (`id`).
   * It requires admin authorization (`@UseGuards(AdminGuard)`) and expects a `UpdateStarshipDto`
   * object containing the updated details in the request body.
   *
   * @UseGuards(AdminGuard)
   * @Patch(':id')
   * @ApiBearerAuth()
   * @ApiOperation({ summary: 'Update resource "starship" by its "id"' })
   *
   * @param id (number) - The unique identifier of the starship resource to update
   * @param updateStarshipDto (UpdateStarshipDto) - Data Transfer Object containing updated starship details
   *
   * @returns Promise<Starship> - A promise resolving to the updated Starship entity
   */
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

  /**
   * Delete Starship (Admin)
   *
   * This endpoint deletes a starship resource by its unique identifier (`id`).
   * It requires admin authorization (`@UseGuards(AdminGuard)`) and expects the starship ID
   * as a path parameter.
   *
   * @UseGuards(AdminGuard)
   * @Delete(':id')
   * @ApiBearerAuth()
   * @ApiOperation({ summary: 'Delete resource "starship" by its "id"' })
   *
   * @param id (number) - The unique identifier of the starship resource to delete
   *
   * @returns Promise<void> - A promise that resolves after successful deletion (no content returned)
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "starship" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.starshipsService.remove(id)
  }
}
