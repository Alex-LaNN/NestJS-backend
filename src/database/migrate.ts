import { QueryRunner } from 'typeorm'
import { dataSource } from './config'

/**
 * runMigrations: Executes database migrations using TypeORM
 *
 * This function handles the process of running database migrations using TypeORM.
 * It utilizes a `QueryRunner` to manage transactions and ensures proper connection
 * handling before, during, and after executing the migrations.
 *
 * @param queryRunner An instance of `QueryRunner` for managing transactions
 */
export async function runMigrations(queryRunner: QueryRunner) {
  try {
    // Start a new transaction to encapsulate migration execution
    await queryRunner.startTransaction()
    // Check if the connection to the database is already initialized
    if (!dataSource.isInitialized) {
      // Initialize the connection if not already established
      await dataSource.initialize()
      console.log(`Database connection established for migrations...`)
    } else {
      // Inform that the connection was already established
      console.log(`Database connection for migrations already initialized!`)
    }
    // Execute the database migrations using TypeORM
    await dataSource.runMigrations()
    console.log(`Migrations executed successfully...`)
    // Commit the transaction to make the changes permanent
    await queryRunner.commitTransaction()
  } catch (error) {
    // Handle any errors that occur during migration execution
    console.error(`Error running migrations: `, error)
    // Rollback the transaction to revert any incomplete changes
    await queryRunner.rollbackTransaction()
    // Re-throw the error to propagate it up the call stack
    throw error
  } finally {
    // Ensure the database connection is closed after migrations (if initialized)
    if (dataSource.isInitialized) {
      await dataSource.destroy()
      console.log(`Database connection closed after migrations...`)
    }
  }
}
