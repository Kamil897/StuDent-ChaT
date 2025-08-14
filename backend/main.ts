import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AllExceptionsFilter } from './src/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const PORT = Number(process.env.PORT ?? 3000);
  const CLIENT_URL = process.env.CLIENT_URL ?? 'https://student-chat.online';

  // Безопасность
  app.use(
    helmet({
      // В dev часто мешает strict CSP, оставим дефолт
    }),
  );

  // CORS для фронта (cookies + credentials)
  app.enableCors({
    origin: (origin, cb) => {
      // Разрешаем фронт из .env, а также origin=null для нативных клиентов
      if (!origin || origin === CLIENT_URL) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Cookies для refresh токенов и т.п.
  app.use(
    cookieParser(),
  );

  // Глобальные пайпы валидации DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // отбрасывает лишние поля
      transform: true,        // преобразует примитивы к типам DTO
      forbidNonWhitelisted: false, // не валим запрос, просто чистим
    }),
  );

  // Версионирование API (опционально, но удобно): /api/v1/...
  app.setGlobalPrefix('api/v1');

  await app.listen(PORT);
  // eslint-disable-next-line no-console
  console.log(`Backend running on http://159.198.65.254:${PORT} (client: ${CLIENT_URL})`);

  app.useGlobalFilters(new AllExceptionsFilter());
}

bootstrap();
