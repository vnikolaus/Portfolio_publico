import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { BuildReservation } from "../useCases/BuildReservation.js";

export class ReservationController {
    constructor(private readonly app: FastifyInstance) {}

    async addReservation(input: Prisma.ReservationUncheckedCreateInput) {
        const dateSchema = z.string().min(1).refine(value => !Number.isNaN(new Date(value).getTime()), {
            message: 'Invalid date',
        });
        const schema = z.object({
            duration:   z.number().min(0),
            book_id:    z.number().min(0),
            status:     z.enum(['PENDING']),
            start_date: dateSchema,
            end_date:   dateSchema,
        }).refine(({ start_date, end_date }) => new Date(end_date) >= new Date(start_date), {
            message: 'end_date must be greater than or equal to start_date',
            path: ['end_date'], // erro aparece na propriedade end_date
        })
        const zInput = schema.parse(input);
        const build  = new BuildReservation(this.app);
        const dto    = await build.exec(zInput);
        return dto;
    }

    async deleteReservation(id: string) {
        if (typeof id !== 'string') return;

        await this.app.prisma.reservation.delete({ where: { id } })
    }

    async updateReservation(id: string, values: Prisma.ReservationUncheckedUpdateInput) {
        if (typeof id !== 'string') return;

        const dateSchema = z.string().min(1).refine(value => !Number.isNaN(new Date(value).getTime()), {
            message: 'Invalid date',
        });
        const schema = z.object({
            book_id:    z.number().optional(),
            duration:   z.number().optional(),
            start_date: dateSchema.optional(),
            end_date:   dateSchema.optional(),
            status:     z.enum(['PENDING', 'ACTIVE', 'FINISHED', 'CANCELLED']).optional(),
        }).refine(({ start_date, end_date }) => {
            if (!start_date || !end_date) return true;
            return new Date(end_date) >= new Date(start_date);
        }, {
            message: 'end_date must be greater than or equal to start_date',
            path: ['end_date'],
        });

        const zValues = schema.parse(values);
        const data: Prisma.ReservationUncheckedUpdateInput = { ...zValues } as Prisma.ReservationUncheckedUpdateInput;

        if (zValues.start_date) data.start_date = new Date(zValues.start_date);
        if (zValues.end_date) data.end_date = new Date(zValues.end_date);

        const updatedReservation = await this.app.prisma.reservation.update({
            where: { id },
            data
        });
        return updatedReservation;
    }
}
