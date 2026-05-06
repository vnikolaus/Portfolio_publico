import type { Event } from "../../domain/entities/Event";

export interface EventRepository {
    create(event: Event): Promise<Event>;
    findAll(): Promise<Event[]>;
    findById(eventId: string): Promise<Event | null>;
    update(event: Event): Promise<Event | null>;
    delete(eventId: string): Promise<void>;
}
