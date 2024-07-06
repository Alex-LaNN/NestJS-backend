import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as packageJsone from '../package.json'
import { ConfigService } from '@nestjs/config'
import 'dotenv/config'
import { TransformInterceptor } from './shared/Transform.interceptor'
import { CustomExceptionFilter } from './shared/app.custom-exception.filter'

async function bootstrap() {
  // Create a Nest application instance
  const app = await NestFactory.create(AppModule)

  // Configure Swagger documentation
  const appConfig = new DocumentBuilder()
    .setTitle('The Star Wars API')
    .setDescription(
      "All the Star Wars data you've ever wanted: Planets, Spaceships, Vehicles, People, Films and Species. From all SEVEN Star Wars films.",
    )
    .setVersion(packageJsone.version)
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, appConfig)
  // Mount Swagger at '/api' route
  SwaggerModule.setup('api', app, document)

  // Get configuration service
  const configService = app.get<ConfigService>(ConfigService)

  // Apply global middleware
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  //app.useGlobalFilters(new CustomExceptionFilter())

  // Enable CORS (Cross-Origin Resource Sharing)
  app.enableCors()
  // Start listening on the specified port
  await app.listen(configService.get('port'))
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
