import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { Utils } from "../utils/Utils.js";

export class BookController {
    constructor(private readonly app: FastifyInstance) {}

    async addBook(book: Prisma.BookCreateInput) {
        const schema = z.object({
            title:    z.string().min(1),
            author:   z.string().min(1),
            pages:    z.number().min(0),
            quantity: z.number().min(0),
        })
        const zBook   = schema.parse(book);
        const newBook = await this.app.prisma.book.create({ data: { ...zBook, created_at: Utils.toBrazilISO(new Date()) } });
        return newBook;
    }

    async deleteBook(id: string | number) {
        if (typeof id !== 'string' && typeof id !== 'number') return;

        await this.app.prisma.book.delete({ where: { id: +id } });
    }

    async updateBook(id: string | number, values: Prisma.BookUpdateInput) {
        if (typeof id !== 'string' && typeof id !== 'number') return;

        const schema = z.object({
            title:    z.string().optional(),
            author:   z.string().optional(),
            pages:    z.number().optional(),
            quantity: z.number().optional(),
        });
        const zValues = schema.parse(values) as Prisma.BookUpdateInput;
        const updatedBook = await this.app.prisma.book.update({ 
            where: { id: +id }, 
            data: { ...zValues } 
        })
        return updatedBook;
    }
}