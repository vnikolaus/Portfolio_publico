import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infra/database/database.module';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [LinksController],
    providers: [LinksService]
})
export class LinksModule {}
