import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { dataSource } from '../src/database/config'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let validToken: string

  beforeAll(async () => {
    jest.setTimeout(30000)

    try {
      await dataSource.initialize()
      console.log('Data Source has been initialized for tests!')

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
      await app.init()
    } catch (error) {
      console.error('Error during Data Source initialization:', error)
      throw error
    }
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Authentication', () => {
    it('should login and return a token', async () => {
      const loginDto = {
        username: 'admin',
        password: '55555',
      }

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)

      validToken = response.body.access_token
      expect(validToken).toBeDefined()
    }, 30000)
  })

  describe('People CRUD', () => {
    const createPeopleDto = {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 1,
    }

    let createdPersonId: number = 1

    it('should create a new person', async () => {
      const response = await request(app.getHttpServer())
        .post('/people')
        .set('Authorization', `Bearer ${validToken}`)
        .send(createPeopleDto)
        .expect(201)

      // Assertions on the response
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', 'Luke Skywalker')
    })

    it('should get all people', async () => {
      const response = await request(app.getHttpServer())
        .get('/people')
        .expect(200)

      expect(response.body).toHaveProperty('items')
      expect(response.body).toHaveProperty('meta')
    })

    it('should get a person by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/people/${createdPersonId}`)
        .expect(200)

      const person = response.body
      expect(person.id).toBe(createdPersonId)
      expect(person.name).toBe(createPeopleDto.name)
    })

    it('should update a person', async () => {
      const updatePeopleDto = {
        name: 'Luke Skywalker Updated',
      }

      const response = await request(app.getHttpServer())
        .patch(`/people/${createdPersonId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updatePeopleDto)
        .expect(200)

      const person = response.body
      expect(person.name).toBe(updatePeopleDto.name)
    })

    it('should delete a person', async () => {
      await request(app.getHttpServer())
        .delete(`/people/${createdPersonId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
    })

    it('should return 404 for deleted person', async () => {
      await request(app.getHttpServer())
        .get(`/people/${createdPersonId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404)
    })
  })
})
