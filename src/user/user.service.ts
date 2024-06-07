import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { hashPassword } from 'src/shared/common.functions'
import { ErrorResponce, Role } from 'src/shared/utils'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  /**
   * Creates a new user in the database.
   *
   * @param createUserDto An object containing user creation details.
   *                      - `userName`: The username of the new user.
   *                      - `email`: The email address of the new user.
   *                      - `role`: Set the User Role.
   *                      - (and potentially other user properties)
   * @returns Promise that resolves to:
   *          - `User`: The newly created user object if successful.
   *          - `ErrorResponce`: An object containing error details if creation fails.
   *                      - `error`: The error object describing the issue.
   *                      - `user`: null (since no user was created).
   *                      - `isActionCompleted`: false (indicates failed action).
   */
  async create(createUserDto: CreateUserDto): Promise<User | ErrorResponce> {
    // Проверка наличия пользователя с таким же именем
    const existingUser: User | ErrorResponce = await this.findOneByName(
      createUserDto.userName,
    )
    if (existingUser) {
      const error: Error = new Error(
        'Данное имя пользователя уже занято! Придумайте другое имя.',
      )
      return {
        error,
        user: null,
        isActionCompleted: false,
      }
    }
    // Хеширование пароля
    const hashedPassword: string = await hashPassword(createUserDto.password)
    console.log(`us 49: hashedPassword - ${hashedPassword}`)  ////////////////////////////////////////////
    // Извлечение данных пользователя из 'createUserDto', исключая поле 'password'
    const { password, ...userData } = createUserDto
    // Присваивание роли 'Admin'
    if (password === process.env.ADMIN_KEY) {
      userData.role = Role.Admin
    }
    // Создание нового объекта пользователя
    const newUser: User = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    })
    // Сохранение созданного нового пользователя в базе данных
    await this.usersRepository.save(newUser)
    return newUser
  }

  /**
   * Поиск пользователя по его имени.
   *
   * @param userName Имя пользователя.
   * @returns Promise, который резолвится в объект `User`,
   *          если пользователь найден,
   *          или `null`,
   *          если пользователь не найден.
   */
  async findOneByName(userName: string): Promise<User> {
    return this.usersRepository.findOne({ where: { userName: userName } })
  }

  /**
   * Поиск пользователя по его email.
   *
   * @param email Адрес электронной почты пользователя.
   * @returns Promise, который резолвится в:
   *          - `User`, если пользователь найден.
   *          - `ErrorResponce`, если пользователь не найден
   */
  async findOneByEmail(email: string): Promise<User | ErrorResponce> {
    const user: User = await this.usersRepository.findOne({
      where: { email: email },
    })
    if (!user) {
      const error: Error = new Error(
        `Пользователь с указанной почтой: ${email} не найден!`,
      )
      return {
        error,
        user: null,
        isActionCompleted: false,
      }
    }
    return user
  }

  /**
   * Удаляет пользователя из базы данных по его имени.
   *
   * @param name - Имя пользователя для удаления.
   * @returns - Возвращает true, если пользователь успешно удален, и false, если пользователь не найден.
   * @throws - В случае ошибок, связанных с доступом к базе данных.
   */
  async remove(name: string): Promise<boolean> {
    try {
      const user: User = await this.findOneByName(name)
      if (!user) {
        return false
      }
      // Удаление пользователя из базы данных
      await this.usersRepository.remove(user)
      return true
    } catch (error) {
      // Логирование ошибки с дополнительной информацией
      console.error(
        `Ошибка при удалении пользователя с именем ${name}: `,
        error,
      )
      return false
    }
  }
}
