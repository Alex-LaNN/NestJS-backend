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
import { FilmsService } from './films.service'
import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { limitCount } from 'src/shared/utils'
import { Film } from 'src/films/entities/film.entity'
import { AdminGuard } from 'src/auth/guards/admin.guard'

/**
 * FilmsController: Controller for handling film-related requests
 *
 * This class handles incoming HTTP requests related to films. It uses decorators
 * from `@nestjs/common` for routing, `@nestjs/swagger` for API documentation,
 * `nestjs-typeorm-paginate` for pagination, and injects the `FilmsService`
 * to perform film-related operations. Additionally, it uses the `AdminGuard`
 * to restrict certain endpoints to admin users.
 */
@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  /**
   * Create a new film
   *
   * @Post('create') - POST request to "/films/create"
   * @ApiBearerAuth() - Requires authorization (bearer token)
   * @ApiBody({ type: CreateFilmDto }) - Expects a CreateFilmDto object in the request body
   * @ApiOperation({ summary: 'Create new "film"' }) - Summary for Swagger documentation
   * @param createFilmDto (CreateFilmDto) - Data for creating a new film
   * @returns Promise<Film> - Promise resolving to the created film object
   */
  @UseGuards(AdminGuard)
  @Post('create')
  @ApiBearerAuth()
  @ApiBody({ type: CreateFilmDto })
  @ApiOperation({ summary: 'Create new "film"' })
  async create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(createFilmDto)
  }

  /**
   * findAll: Retrieves all film resources with pagination
   *
   * This method retrieves a paginated list of film resources from the database.
   * - `@Get()`: Defines the endpoint for retrieving all films (GET request to '/films').
   * - `@ApiOperation({ summary: 'Get all the "films" resources' })`: Summarizes the API operation in documentation.
   * - `@ApiQuery({ name: 'page', required: false })`: Describes optional query parameter for pagination (page number).
   * - `@ApiQuery({ name: 'limit', required: false })`: Describes optional query parameter for pagination (results per page).
   * - `async findAll(@Query(...) page: number, limit: number)`: Asynchronous method that takes optional page and limit query parameters and returns a Promise resolving to a Pagination<Film> object containing film data and pagination information.
   */
  @Get()
  @ApiOperation({ summary: 'Get all the "films" resources' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Film>> {
    if (limit > limitCount) limit = limitCount
    return this.filmsService.findAll({ page, limit })
  }

  /**
   * findOne: Retrieves a single film resource by its ID
   *
   * This method retrieves a specific film resource from the database based on the provided ID.
   * - `@Get(':id')`: Defines the endpoint for retrieving a film by ID (GET request to '/films/:id').
   * - `@ApiOperation({ summary: 'Get resource "film" by its "id"' })`: Summarizes the API operation in documentation.
   * - `async findOne(@Param('id') id: number)`: Asynchronous method that takes the film ID from the request parameter and returns a Promise resolving to the Film entity for that ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get resource "film" by its "id"' })
  async findOne(@Param('id') id: number): Promise<Film> {
    return await this.filmsService.findOne(id)
  }

  /**
   * update: Updates a film resource by its ID
   *
   * This method updates an existing film resource in the database using the provided ID and `UpdateFilmDto` data.
   * It's protected by the `AdminGuard` to ensure only authorized users can update films.
   * - `@UseGuards(AdminGuard)`: Enforces admin authentication.
   * - `@Patch(':id')`: Defines the endpoint for updating films by ID (PATCH request to '/films/:id').
   * - `@ApiBearerAuth()`: Requires Bearer token for authorization in API documentation.
   * - `@ApiBody({ type: UpdateFilmDto })`: Describes the expected request body format (UpdateFilmDto).
   * - `@ApiOperation({ summary: 'Update resource "film" by its "id"' })`: Summarizes the API operation in documentation.
   * - `async update(@Param('id') id: number, @Body() updateFilmDto: UpdateFilmDto)`: Asynchronous method that takes the film ID from the request parameter and UpdateFilmDto data from the request body, returning a Promise resolving to the updated Film entity.
   */
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiBody({ type: UpdateFilmDto })
  @ApiOperation({ summary: 'Update resource "film" by its "id"' })
  async update(
    @Param('id') id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return await this.filmsService.update(id, updateFilmDto)
  }

  /**
   * remove: Deletes a film resource by its ID
   *
   * This method deletes a film resource from the database based on the provided ID.
   * It's protected by the `AdminGuard` to ensure only authorized users can delete films.
   * - `@UseGuards(AdminGuard)`: Enforces admin authentication.
   * - `@Delete(':id')`: Defines the endpoint for deleting films by ID (DELETE request to '/films/:id').
   * - `@ApiBearerAuth()`: Requires Bearer token for authorization in API documentation.
   * - `@ApiOperation({ summary: 'Delete resource "film" by its "id"' })`: Summarizes the API operation in documentation.
   * - `async remove(@Param('id') id: number)`: Asynchronous method that takes the film ID from the request parameter and returns a Promise that resolves when the deletion is complete (no return value).
   */
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete resource "film" by its "id"' })
  async remove(@Param('id') id: number): Promise<void> {
    await this.filmsService.remove(id)
  }
}
