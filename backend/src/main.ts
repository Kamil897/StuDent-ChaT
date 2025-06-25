import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConsoleLogger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from "./logger/error.handling";
import { IoAdapter } from '@nestjs/platform-socket.io';

async function start() {
  try {
    const PORT = process.env.PORT || 7777;
    const app = await NestFactory.create(AppModule, {
      logger: new ConsoleLogger({
        colors: true,
        prefix: "StudentChat"
      })
    });

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new AllExceptionsFilter());

    app.enableCors({
      origin: ['https://student-chat.online'],
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
    });

    const config = new DocumentBuilder()
      .setTitle("Student Chat")
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "JWT",
          description: "Enter JWT token",
          in: "header",
        },
        "JWT"
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });

    await app.listen(PORT, () => {
      console.log("\n\n + ====================================================================== +");
      console.log(`| |                                                                      | |`);
      console.log(`| | 🚀     Server is running at: https://student-chat.online             🚀 | |`);
      console.log(`| |                                                                      | |`);
      console.log(`| | 📚 Swagger docs: http://159.198.65.254:7777/api/docs                📚 | |`);
      console.log(`| |                                                                      | |`);
      console.log(" + ====================================================================== +\n\n");
    });

  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
}

start();
