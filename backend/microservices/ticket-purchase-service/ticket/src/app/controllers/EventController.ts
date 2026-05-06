import type { Request, Response } from "express";
import { z } from "zod";
import { Event } from "../../domain/entities/Event";
import type { EventRepository } from "../repositories/EventRepository";

const eventSchema = z.object({
    description: z.string().min(1),
    capacity: z.number().int().positive(),
    priceInCents: z.number().int().nonnegative(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    zipcode: z.string().min(1),
});

export class EventController {
    constructor(private readonly eventRepository: EventRepository) {}

    async create(request: Request, response: Response): Promise<void> {
        const parsedInput = eventSchema.safeParse(request.body);

        if (!parsedInput.success) {
            response.status(400).json({
                message: "Invalid request body",
                issues: parsedInput.error.issues,
            });
            return;
        }

        const event = await this.eventRepository.create(Event.create(parsedInput.data));

        response.status(201).json(this.toResponse(event));
    }

    async findAll(_request: Request, response: Response): Promise<void> {
        const events = await this.eventRepository.findAll();

        response.status(200).json(events.map((event) => this.toResponse(event)));
    }

    async update(request: Request, response: Response): Promise<void> {
        const eventId = String(request.params.eventId ?? "");
        const parsedInput = eventSchema.safeParse(request.body);

        if (!parsedInput.success) {
            response.status(400).json({
                message: "Invalid request body",
                issues: parsedInput.error.issues,
            });
            return;
        }

        const event = await this.eventRepository.update(
            Event.create({
                eventId,
                ...parsedInput.data,
            }),
        );

        if (!event) {
            response.status(404).json({ message: "Event not found" });
            return;
        }

        response.status(200).json(this.toResponse(event));
    }

    async delete(request: Request, response: Response): Promise<void> {
        const eventId = String(request.params.eventId ?? "");

        await this.eventRepository.delete(eventId);

        response.status(204).send();
    }

    private toResponse(event: Event) {
        return {
            eventId: event.eventId,
            description: event.description,
            capacity: event.capacity,
            priceInCents: event.priceInCents,
            address: event.address,
            city: event.city,
            state: event.state,
            country: event.country,
            zipcode: event.zipcode,
            createdAt: event.createdAt,
        };
    }
}
