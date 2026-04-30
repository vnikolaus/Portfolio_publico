import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { BuildReservation } from "../useCases/BuildReservation.js";

export class ReservationController {
    constructor(private readonly app: FastifyInstance) {}

    async addReservation(input: Prisma.ReservationUncheckedCreateInput) {

        const schema = z.object({
            duration:   z.number().min(0),
            book_id:    z.number().min(0),
            status:     z.enum(['PENDING']),
            start_date: z.string().min(1),
            end_date:   z.string().min(1),
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

        const schema = z.object({
            book_id:    z.number().optional(),
            duration:   z.number().optional(),
            start_date: z.string().optional(),
            end_date:   z.string().optional(),
            status:     z.string().optional(),
        });
        const zValues = schema.parse(values) as Prisma.ReservationUncheckedUpdateInput;
        const updatedReservation = await this.app.prisma.reservation.update({ 
            where: { id }, 
            data: { ...zValues } 
        })
        return updatedReservation;
    }
}