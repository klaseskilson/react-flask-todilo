drop table if exists todos;
create table todos (
  id integer primary key autoincrement,
  title text not null,
  completed boolean not null default 0,
  ordered integer
);
