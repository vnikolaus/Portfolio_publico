import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LinksModule } from './app/modules/links/links.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), LinksModule, DatabaseModule],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
