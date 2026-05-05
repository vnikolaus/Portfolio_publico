import { randomUUID } from "node:crypto";

export type TicketStatus = "reserved" | "approved" | "cancelled";

type TicketProps = {
    ticketId: string;
    eventId: string;
    email: string;
    status: TicketStatus;
    createdAt: Date;
};

type CreateTicketProps = Omit<TicketProps, "ticketId" | "status" | "createdAt"> & {
    ticketId?: string;
};

export class Ticket {
    private constructor(private readonly props: TicketProps) {}

    static create(props: CreateTicketProps): Ticket {
        return new Ticket({
            ticketId: props.ticketId ?? randomUUID(),
            eventId: props.eventId,
            email: props.email,
            status: "reserved",
            createdAt: new Date(),
        });
    }

    static restore(props: TicketProps): Ticket {
        return new Ticket(props);
    }

    approve(): void {
        this.props.status = "approved";
    }

    cancel(): void {
        this.props.status = "cancelled";
    }

    get ticketId(): string {
        return this.props.ticketId;
    }

    get eventId(): string {
        return this.props.eventId;
    }

    get email(): string {
        return this.props.email;
    }

    get status(): TicketStatus {
        return this.props.status;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }
}
