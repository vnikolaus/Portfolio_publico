import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import mongoose, { Types } from 'mongoose';
import { CreateLinkDto } from './dto/create-link.dto';

type LinkDocument = {
    _id?: Types.ObjectId;
    url: string;
    code: string;
    createdAt: Date;
};

@Injectable()
export class LinksService {
    private readonly collection;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly database: typeof mongoose
    ) {
        this.collection = this.database.connection.collection<LinkDocument>('links');
    }

    async create(createLinkDto: CreateLinkDto) {
        const link = {
            url: createLinkDto.url,
            code: await this.generateUniqueCode(),
            createdAt: new Date()
        };

        const { insertedId } = await this.collection.insertOne(link);

        return {
            id: insertedId.toString(),
            ...link
        };
    }

    findAll() {
        return this.collection.find().toArray();
    }

    async findOne(id: string) {
        const link = await this.collection.findOne({ _id: new Types.ObjectId(id) });

        if (!link) {
            throw new NotFoundException('Link not found');
        }

        return link;
    }

    async remove(id: string) {
        const result = await this.collection.deleteOne({ _id: new Types.ObjectId(id) });

        if (result.deletedCount === 0) {
            throw new NotFoundException('Link not found');
        }
    }

    private async generateUniqueCode() {
        let code = this.generateCode();
        let existingLink = await this.collection.findOne({ code });

        while (existingLink) {
            code = this.generateCode();
            existingLink = await this.collection.findOne({ code });
        }

        return code;
    }

    private generateCode(length = 6) {
        const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        return Array.from({ length }, () => alphabet[randomInt(alphabet.length)]).join('');
    }
}
