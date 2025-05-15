import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import {HttpExceptionFilter} from "./global-filters/http-exception.filter";
import {AllExceptionsFilter} from "./global-filters/all-exceptions.filter";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
      new HttpExceptionFilter(configService),
      new AllExceptionsFilter(httpAdapterHost)
  );

  await app.listen(3000);
}
bootstrap();
