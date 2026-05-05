import { randomUUID } from "node:crypto";

type EventProps = {
    eventId: string;
    description: string;
    capacity: number;
    priceInCents: number;
    location: string;
    createdAt: Date;
};

type CreateEventProps = Omit<EventProps, "eventId" | "createdAt"> & {
    eventId?: string;
};

export class Event {
    private constructor(private readonly props: EventProps) {}

    static create(props: CreateEventProps): Event {
        return new Event({
            eventId: props.eventId ?? randomUUID(),
            description: props.description,
            capacity: props.capacity,
            priceInCents: props.priceInCents,
            location: props.location,
            createdAt: new Date(),
        });
    }

    static restore(props: EventProps): Event {
        return new Event(props);
    }

    get eventId(): string {
        return this.props.eventId;
    }

    get description(): string {
        return this.props.description;
    }

    get capacity(): number {
        return this.props.capacity;
    }

    get priceInCents(): number {
        return this.props.priceInCents;
    }

    get location(): string {
        return this.props.location;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}
