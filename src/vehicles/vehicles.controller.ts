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
} from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Vehicle } from 'src/vehicles/entities/vehicle.entity'
import { Pagination } from 'nestjs-typeorm-paginate'
import { UserRoles, limitCount } from 'src/shared/utils'
import { Roles } from 'src/auth/decorator/roles.decorator'

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Roles(UserRoles.Admin)
  @Post('create')
  @ApiOperation({ summary: 'Create new "vehicle"' })
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all the "vehicles" resources' })
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(limitCount)) limit: number,
  ): Promise<Pagination<Vehicle>> {
    return this.vehiclesService.findAll({ page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource "vehicle" by its "id"' })
  async findOne(@Param('id') id: string): Promise<Vehicle> {
    return this.vehiclesService.findOne(id)
  }

  @Roles(UserRoles.Admin)
  @Patch(':id')
  @ApiOperation({ summary: 'Update resource "vehicle" by its "id"' })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, updateVehicleDto)
  }

  @Roles(UserRoles.Admin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete resource "vehicle" by its "id"' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vehiclesService.remove(id)
  }
}
