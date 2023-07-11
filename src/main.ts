import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
// import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  app.enableCors({ origin: '*' });
  // app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const options = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/v1/docs', app, document);

  await app.listen(Number.parseInt(configService.getPort()), () => {
    Logger.log(`Application is running on port: ${configService.getPort()}`);
  });
}
bootstrap();
