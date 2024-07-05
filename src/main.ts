import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as packageJsone from '../package.json'
import { ConfigService } from '@nestjs/config'
import 'dotenv/config'
import { TransformInterceptor } from './shared/Transform.interceptor'
import { HttpExceptionFilter } from './app.http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appConfig = new DocumentBuilder()
    .setTitle('The Star Wars API')
    .setDescription(
      "All the Star Wars data you've ever wanted: Planets, Spaceships, Vehicles, People, Films and Species. From all SEVEN Star Wars films.",
    )
    .setVersion(packageJsone.version)
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, appConfig)
  SwaggerModule.setup('api', app, document)
  const configService = app.get<ConfigService>(ConfigService)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  //app.useGlobalFilters(new HttpExceptionFilter())
  app.enableCors()
  await app.listen(configService.get('port'))
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
