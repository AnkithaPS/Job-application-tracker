create table IF not exists users(
    id serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(200) not null,
    created_at timestamp default current_timestamp
);

create table if not exists companies(
    id serial primary key,
    name varchar(255) not null,
    location varchar(255) not null,
    created_at timestamp default current_timestamp,
    unique(name, location)

);

create table if not exists jobs(
    id serial primary key,
    status varchar(100) not null default 'Applied' ,
    user_id integer references users(id) on delete cascade,
    company_id integer references companies(id) ,
    position varchar(200) not null,
    salary integer,
    notes text,
    created_at timestamp default current_timestamp
);

create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_search_status on jobs(status);
create index idx_jobs_search_notes on jobs(notes);
create index idx_companies_name on companies(name);