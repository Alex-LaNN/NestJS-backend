import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Abstract base class for entities in the application
 *
 * This abstract class defines common properties and methods for all entities
 * used in the application. It utilizes TypeORM decorators and class-transformer
 * functionality.
 */
export class AbstractEntity<T> {
  /**
   * Unique identifier for the entity (excluded during serialization)
   *
   * This property is a primary generated column using TypeORM's `@PrimaryGeneratedColumn` decorator.
   * It is excluded from serialization using the `@Exclude` decorator from class-transformer to
   * avoid exposing internal database IDs during API responses.
   */
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number

  /**
   * Entity creation timestamp
   *
   * This property represents the date and time the entity was created in the database.
   * It is a `Date` type and uses the `@CreateDateColumn` decorator from TypeORM. The decorator
   * also specifies a `type` of `timestamp` and a default value of `CURRENT_TIMESTAMP(6)` to automatically
   * set the creation time upon entity creation.
   */
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created: Date

  /**
   * Entity update timestamp
   *
   * This property represents the date and time the entity was last updated in the database.
   * It is a `Date` type and uses the `@UpdateDateColumn` decorator from TypeORM. The decorator
   * also specifies a `type` of `timestamp` and uses defaults for both initial update (`CURRENT_TIMESTAMP(6)`)
   * and subsequent updates (`onUpdate: 'CURRENT_TIMESTAMP(6)')`.
   */
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  edited: Date

  /**
   * Getter method to convert 'created' property to ISO string format
   *
   * This method, named `createdIso`, utilizes a getter function to access the `created` property
   * and convert it to an ISO 8601 string format using the `toISOString` method.
   */
  get createdIso(): string {
    return this.created.toISOString()
  }

  /**
   * Getter method to convert 'edited' property to ISO string format
   *
   * This method, named `editedIso`, utilizes a getter function to access the `edited` property
   * and convert it to an ISO 8601 string format using the `toISOString` method.
   */
  get editedIso(): string {
    return this.edited.toISOString()
  }
}
