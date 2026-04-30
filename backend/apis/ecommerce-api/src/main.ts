/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // remove campos extras não definidos no DTO
            forbidNonWhitelisted: true, // lança erro se mandar campos inválidos
            transform: true, // transforma tipos automaticamente
        }),
    );

    app.use(cookieParser()); // Ativa cookies

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
