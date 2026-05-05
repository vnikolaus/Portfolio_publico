export type EventRecord = {
    eventId: string;
    description: string;
    capacity: number;
    priceInCents: number;
    location: string;
    createdAt: Date;
};

export type CreateEventInput = Omit<EventRecord, "createdAt">;

export interface EventRepository {
    create(event: CreateEventInput): Promise<EventRecord>;
    findById(eventId: string): Promise<EventRecord | null>;
    update(event: CreateEventInput): Promise<EventRecord | null>;
    delete(eventId: string): Promise<void>;
}
