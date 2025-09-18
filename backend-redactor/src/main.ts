import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));

  // ✅ Раздаём папку uploads как статику
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`✅ Backend running on http://localhost:${port}`);
}
bootstrap();
