import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { LinksModule } from './links/links.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), LinksModule, DatabaseModule],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
