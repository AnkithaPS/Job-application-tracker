create table IF not exists users(
    id serial primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    password varchar(200) not null,
    created_at timestamp default current_timestamp
);

create table if not exists jobs(
    id serial primary key,
    company varchar(200) not null,
    position varchar(200) not null,
    status varchar(100) not null default 'Applied' ,
    location varchar(200),
    salary integer,
    user_id integer references users(id) on delete cascade,
    notes text,
    created_at timestamp default current_timestamp
);
create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_search on jobs(company,status,notes);