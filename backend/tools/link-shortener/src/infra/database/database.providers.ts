import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (configService: ConfigService) => {
            const uri = configService.getOrThrow<string>('MONGODB_URI');

            return mongoose.connect(uri);
        },
        inject: [ConfigService]
    }
];
