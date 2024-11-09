import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as packageJsone from '../package.json'
import 'dotenv/config'
import { TransformInterceptor } from './shared/Transform.interceptor'
import { CustomExceptionFilter } from './shared/app.custom-exception.filter'

/**
 * Bootstrap function to initialize and start the NestJS application.
 * - Creates a Nest application instance.
 * - Configures Swagger documentation.
 * - Applies global middleware including validation pipes, interceptors, and exception filters.
 * - Enables CORS (Cross-Origin Resource Sharing).
 * - Starts listening on the specified port defined in configuration.
 */
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

  // Apply global middleware
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new CustomExceptionFilter())

  // Set global prefix 'api' for all routes
  app.setGlobalPrefix('api')

  // Enable CORS (Cross-Origin Resource Sharing)
  app.enableCors()
  // Start listening on the specified port
  await app.listen(Number(process.env.APP_PORT) || 3000, '0.0.0.0')
  const hostName: string = process.env.DOMAIN_NAME
  if (hostName) {
    console.log(`Application is running on: https:${hostName}/api`)
  } else console.log(`Application is running on: ${await app.getUrl()}/api`)
}
bootstrap()
