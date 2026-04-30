import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { Utils } from "../utils/Utils.js";

export class BuildReservation {
    constructor (private readonly app: FastifyInstance) {}

    async exec({ book_id, duration, start_date, end_date }: Prisma.ReservationUncheckedCreateInput) {
        const startDate = new Date(start_date);
        const endDate   = new Date(end_date);

        const dbBook = await this.app.prisma.book.findUnique({ 
            where: { id: book_id },
            include: {
                reservations: {
                    where: {
                        OR:  [
                            { status: 'ACTIVE' },
                            { status: 'PENDING' },
                        ],
                        AND: [ 
                            { start_date: { lte: endDate   } },
                            { end_date:   { gte: startDate } },
                        ],
                    },
                }
            }
        });

        const reservations = dbBook?.reservations?.length ?? 0;
        if (reservations === (dbBook?.quantity ?? 0)) throw new Error('Reservation limit for the period reached');

        const nowISO       = Utils.toBrazilISO(new Date());
        const now          = new Date(nowISO);
        const activePeriod = (now >= startDate && now <= endDate);

        const dto: Prisma.ReservationCreateInput = {
            duration:   duration,
            start_date: startDate,
            end_date:   endDate,
            status:     activePeriod ? 'ACTIVE' : 'PENDING',
            book: {
                connect: { id: book_id }
            }
        }

        const newReservation = await this.app.prisma.reservation.create({ data: dto }) 
        return newReservation;
    }
}