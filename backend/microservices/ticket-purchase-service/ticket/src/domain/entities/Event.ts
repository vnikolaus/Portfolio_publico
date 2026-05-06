import { randomUUID } from "node:crypto";

type EventProps = {
    eventId: string;
    description: string;
    capacity: number;
    priceInCents: number;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
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
            address: props.address,
            city: props.city,
            state: props.state,
            country: props.country,
            zipcode: props.zipcode,
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

    get address(): string {
        return this.props.address;
    }

    get city(): string {
        return this.props.city;
    }

    get state(): string {
        return this.props.state;
    }

    get country(): string {
        return this.props.country;
    }

    get zipcode(): string {
        return this.props.zipcode;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}
