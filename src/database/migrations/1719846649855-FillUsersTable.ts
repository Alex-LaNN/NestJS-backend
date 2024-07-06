import { MigrationInterface, QueryRunner } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { saltRounds } from '../config'

export class FillUsersTable1719846649855 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      const salt = await bcrypt.genSalt(saltRounds) // Генерация соли с 10 итерациями
      // Хеширование паролей для пользователей
      const passwordAdmin = await bcrypt.hash('55555', salt)
      const passwordUser1 = await bcrypt.hash('44444', salt)
      const passwordUser2 = await bcrypt.hash('33333', salt)

      // Добавление пользователей
      await queryRunner.query(`
            INSERT INTO swapi.users (id, userName, password, email, role) VALUES
            (uuid(), 'admin', '${passwordAdmin}', 'admin@example.com', 'admin'),
            (uuid(), 'user1', '${passwordUser1}', 'user1@example.com', 'user'),
            (uuid(), 'user2', '${passwordUser2}', 'user2@example.com', 'user');
        `)
    }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление всех записей из таблицы users
    await queryRunner.query(`
            DELETE FROM swapi.users WHERE userName IN ('admin', 'user1', 'user2');
        `)
  }
}
