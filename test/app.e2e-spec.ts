import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init()
    await app.listen(3000)

    prisma = app.get(PrismaService)

    await prisma.cleanDb()
    pactum.request.setBaseUrl('http://localhost:3000')

  })

  afterAll(() => {
    app.close
  })
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'b@gmail.com',
      password: '123'
    }
    describe('Signup', () => {
      it('should throw error if email is empty', () => {
        return pactum.spec().post('/auth/signup',).withBody({ password: dto.password }).expectStatus(400).inspect()
      })
      it('should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signup',).withBody({ password: dto.email }).expectStatus(400).inspect()
      })
      it('should throw error if password and email is empty', () => {
        return pactum.spec().post('/auth/signup',).expectStatus(400).inspect()
      })
      it('should signup the user', () => {
        return pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201).inspect()
      })
    })
    describe('Signin', () => {
      it('should throw error if email is empty', () => {
        return pactum.spec().post('/auth/signin',).withBody({ password: dto.password }).expectStatus(400).inspect()
      })
      it('should throw error if password is empty', () => {
        return pactum.spec().post('/auth/signin',).withBody({ password: dto.email }).expectStatus(400).inspect()
      })
      it('should throw error if password and email is empty', () => {
        return pactum.spec().post('/auth/signin',).expectStatus(400).inspect()
      })
      it('should signin the user', () => {
        return pactum.spec().post('/auth/signin',).withBody(dto).expectStatus(200).inspect().stores('userAT', 'access_token')
      })

    })
  })
  describe('User', () => {
    describe('Create', () => {
    })
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/me',).withHeaders({ Authorization: 'Bearer $S{userAT}' }).expectStatus(200).inspect()
      })
    })
    describe('Read', () => {
    })
    describe('Update', () => {
      it('should update user', () => {
        const dto: EditUserDto = {
          firstName:"bilal",
          email:'bilal@gmail.com',
          lastName: "hallo"
        }

        return pactum.spec().patch('/users',).withHeaders({ Authorization: 'Bearer $S{userAT}' }).withBody(dto).expectStatus(200).inspect().expectBodyContains(dto.firstName).expectBodyContains(dto.email).expectBodyContains(dto.lastName)
      })
    })
    describe('Delete', () => {
    })
  })
  describe('Bookmarks', () => {
    describe("Create bookmarks", () => { })
    describe("Get bookmarks", () => { })
    describe("Update bookmark", () => { })
    describe("Delete bookmark", () => { })
    describe("Get user's bookmarks", () => { })
    describe("Get bookmark by id", () => { })
    describe("Get bookmark by title", () => { })
    describe("Get bookmark by url", () => { })

  })
})