create table events (
    event_id uuid primary key,
    description text not null,
    capacity integer not null check (capacity > 0),
    price_in_cents integer not null check (price_in_cents >= 0),
    address text not null,
    city text not null,
    state text not null,
    country text not null,
    zipcode text not null,
    created_at timestamptz not null default now()
);

create table tickets (
    ticket_id uuid primary key,
    event_id uuid not null references events(event_id),
    email text not null,
    status text not null check (status in ('reserved', 'approved', 'rejected')),
    created_at timestamptz not null default now()
);

create table transactions (
    transaction_id uuid primary key,
    ticket_id uuid not null references tickets(ticket_id),
    event_id uuid not null references events(event_id),
    price_in_cents integer not null check (price_in_cents >= 0),
    tid text,
    status text not null check (status in ('pending', 'paid', 'failed')),
    created_at timestamptz not null default now()
);

create index tickets_event_id_idx on tickets(event_id);
create index transactions_ticket_id_idx on transactions(ticket_id);
