import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { config } from './config'

/**
 * TypeOrmOptions: Provides configuration options for TypeORM connection
 *
 * This class implements the TypeOrmOptionsFactory interface to define the
 * configuration for the TypeORM module. It extracts database connection
 * details from the `config` object and validates them before returning
 * the TypeORM options.
 */
@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  /**
   * createTypeOrmOptions: Creates and returns TypeORM module options
   *
   * @returns {TypeOrmModuleOptions} The configuration options for the TypeORM module
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Extract database connection details from the configuration file
    const { dbHost, dbPort, dbUser, dbPass, dbName } = config
    // Validate required database connection parameters
    if (!dbHost || !dbPort || !dbUser || !dbPass || !dbName) {
      throw new Error(
        'Not all parameters for connecting to the database are defined in the configuration file!',
      )
    }

    /**
     * Configuration options for the TypeORM module
     *
     * Defines configuration parameters for the TypeORM module,
     * used to interact with the MySQL database.
     */
    const options: TypeOrmModuleOptions = {
      type: 'mysql',
      host: dbHost,
      port: Number(dbPort),
      username: dbUser,
      password: dbPass,
      database: dbName,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/src/database/migrations/*{.ts,.js}'],
      synchronize: false,
    }

    return options
  }
}

