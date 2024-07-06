import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { hashPassword } from 'src/shared/common.functions'
import { ErrorResponce, UserRoles } from 'src/shared/utils'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the database.
   *
   * This method checks for an existing user with the same username before creating the new user.
   * If the username is unique, the password is hashed and the user is saved to the database.
   * The user's role is set to 'User' by default, but if the provided password matches the ADMIN_KEY environment variable, the role is set to 'Admin'.
   *
   * @param createUserDto An object containing user creation details:
   *   - `userName`: The unique username of the new user.
   *   - `email`: The email address of the new user.
   *   - `password`: The password for the new user.
   *   - (and potentially other user properties)
   * @returns Promise that resolves to:
   *   - `User`: The newly created user object if successful.
   *   - `ErrorResponce`: An object containing error details if creation fails:
   *     - `error`: The error object describing the issue.
   *     - `user`: null (since no user was created).
   *     - `isActionCompleted`: false (indicates failed action).
   */
  async create(createUserDto: CreateUserDto): Promise<User | ErrorResponce> {
    // Check if a user with the same username already exists
    const existingUser: User | ErrorResponce = await this.findOneByName(
      createUserDto.userName,
    )
    if (existingUser) {
      const error: Error = new Error(
        'This username is already taken. Please choose another.',
      )
      return {
        error,
        user: null,
        isActionCompleted: false,
      }
    }
    // Hash the password for security
    const hashedPassword: string = await hashPassword(createUserDto.password)
    //console.log(`us 52: hashedPassword - ${hashedPassword}`) ////////////////////////////////////////////
    // Extract user data from 'createUserDto', excluding the 'password' field
    const { password, ...newUserData } = createUserDto
    // Set the user's role to 'Admin' if the password matches the ADMIN_KEY
    if (hashedPassword === process.env.ADMIN_KEY) {
      newUserData.roles = UserRoles.Admin
    }
    // Create a new user object
    const newUser: User = this.usersRepository.create({
      ...newUserData,
      password: hashedPassword,
    })
    // Save the newly created user to the database
    await this.usersRepository.save(newUser)
    return newUser
  }

  /**
   * Finds a user by their username.
   *
   * This method searches the database for a user with the specified username.
   * If a user is found, their object is returned. Otherwise, null is returned.
   *
   * @param userName The username of the user to find.
   * @returns Promise that resolves to:
   *   - `User`: The user object if found, otherwise null.
   */
  async findOneByName(userName: string): Promise<User> {
    return this.usersRepository.findOne({ where: { userName: userName } })
  }

  /**
   * Finds a user by their email address.
   *
   * This method searches the database for a user with the specified email address.
   * If a user is found, their object is returned. Otherwise, an error response is returned.
   *
   * @param email The email address of the user to find.
   * @returns Promise that resolves to:
   *   - `User`: The user object if found.
   *   - `ErrorResponce`: An object containing error details if the user is not found:
   *     - `error`: The error object describing the issue.
   *     - `user`: null (since no user was found).
   *     - `isActionCompleted`: false (indicates failed action).
   */
  async findOneByEmail(email: string): Promise<User | ErrorResponce> {
    const user: User = await this.usersRepository.findOne({
      where: { email: email },
    })
    if (!user) {
      const error: Error = new Error(
        `User with the email address: ${email} not found!`,
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
   * Removes a user from the database by their username.
   *
   * This method attempts to find the user with the specified username.
   * If the user is found, they are deleted from the database.
   * If the user is not found, a false value is returned.
   * In case of database access errors, an exception is thrown.
   *
   * @param name The username of the user to remove.
   * @returns Promise that resolves to:
   *   - `true`: If the user was successfully removed.
   *   - `false`: If the user was not found.
   * @throws Error: In case of database access errors.
   */
  async remove(name: string): Promise<boolean> {
    try {
      const user: User = await this.findOneByName(name)
      if (!user) {
        return false
      }
      // Delete the user from the database
      await this.usersRepository.remove(user)
      return true
    } catch (error) {
      // Log the error with additional information
      console.error(`us:139 - Error removing user with username: ${name}: `, error)
      return false
    }
  }
}
