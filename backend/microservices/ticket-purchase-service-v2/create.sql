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

create table orders (
    order_id uuid primary key,
    event_id uuid not null references events(event_id),
    email text not null,
    quantity integer not null check (quantity > 0),
    total_price_in_cents integer not null check (total_price_in_cents >= 0),
    status text not null check (status in ('pending', 'paid', 'cancelled')),
    created_at timestamptz not null default now()
);

create table tickets (
    ticket_id uuid primary key,
    order_id uuid not null references orders(order_id),
    event_id uuid not null references events(event_id),
    email text not null,
    status text not null check (status in ('reserved', 'approved', 'cancelled')),
    created_at timestamptz not null default now()
);

create table transactions (
    transaction_id uuid primary key,
    order_id uuid not null references orders(order_id),
    tid text,
    status text not null check (status in ('pending', 'paid', 'failed')),
    created_at timestamptz not null default now()
);

create index orders_event_id_idx on orders(event_id);
create index tickets_event_id_idx on tickets(event_id);
create index tickets_order_id_idx on tickets(order_id);
create index transactions_order_id_idx on transactions(order_id);
