import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { dataSource } from '../src/database/config'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let validToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    // Create a valid token for authentication
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'adminpassword',
      })

    validToken = response.body.access_token

    // Initialize the database
    await dataSource.synchronize(true)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/people (POST)', () => {
    it('should create a new person', async () => {
      const createPeopleDto = {
        name: 'Luke Skywalker',
        height: 172,
        mass: 77,
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'Tatooine',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
      }

      const response = await request(app.getHttpServer())
        .post('/people/create')
        .set('Authorization', `Bearer ${validToken}`)
        .send(createPeopleDto)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toEqual(createPeopleDto.name)
    })

    it('should return 400 for invalid data', async () => {
      const invalidCreatePeopleDto = {
        name: '',
      }

      await request(app.getHttpServer())
        .post('/people/create')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidCreatePeopleDto)
        .expect(400)
    })
  })

  describe('/people (GET)', () => {
    it('should return all people', async () => {
      const response = await request(app.getHttpServer())
        .get('/people')
        .expect(200)

      expect(response.body).toHaveProperty('items')
      expect(Array.isArray(response.body.items)).toBeTruthy()
    })

    it('should return paginated people', async () => {
      const response = await request(app.getHttpServer())
        .get('/people')
        .query({ page: 1, limit: 2 })
        .expect(200)

      expect(response.body).toHaveProperty('items')
      expect(response.body.meta).toHaveProperty('totalItems')
      expect(response.body.meta).toHaveProperty('itemCount')
      expect(response.body.meta).toHaveProperty('itemsPerPage')
      expect(response.body.meta).toHaveProperty('totalPages')
      expect(response.body.meta).toHaveProperty('currentPage')
    })
  })

  describe('/people/:id (GET)', () => {
    it('should return a single person by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/people/1')
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body.id).toEqual(1)
    })

    it('should return 404 for a non-existent person', async () => {
      await request(app.getHttpServer()).get('/people/999').expect(404)
    })
  })

  describe('/people/:id (PATCH)', () => {
    it('should update a person by ID', async () => {
      const updatePeopleDto = {
        height: 180,
      }

      const response = await request(app.getHttpServer())
        .patch('/people/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updatePeopleDto)
        .expect(200)

      expect(response.body).toHaveProperty('height')
      expect(response.body.height).toEqual(updatePeopleDto.height)
    })

    it('should return 404 for a non-existent person', async () => {
      const updatePeopleDto = {
        height: 180,
      }

      await request(app.getHttpServer())
        .patch('/people/999')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updatePeopleDto)
        .expect(404)
    })
  })

  describe('/people/:id (DELETE)', () => {
    it('should delete a person by ID', async () => {
      await request(app.getHttpServer())
        .delete('/people/1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
    })

    it('should return 404 for a non-existent person', async () => {
      await request(app.getHttpServer())
        .delete('/people/999')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404)
    })
  })
})
