# typescript-apollo-server-express

## .env

| 変数名          | 設定値                              |
| :-------------- | :---------------------------------- |
| DB_DATABASE     | session store で使用                |
| DB_HOST         | session store で使用                |
| DB_PASSWORD     | session store で使用                |
| DB_PORT         | session store で使用                |
| DB_USER         | session store で使用                |
| DATABASE_URL    | prisma で使用                       |
| SESSION_SECRET  | bcrypt で使用                       |
| CORS_URLS       | CORS の除外(スペース区切りで複数可) |
| SERVER_PORT     | server listen port                  |
| PRODUCTION_MODE | 動作環境 dev or prod                |

## Database

```
create database graphql;
```

```
drop table user_books;
drop table books;
drop table users;

create table books(
    id int unsigned not null auto_increment,
    title varchar(100) not null,
    author varchar(30) not null,
    created_at datetime not null DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    primary key(id)
);

insert into books(title,author) values
("とても凄い本とても凄い本とても凄い本","太郎"),
("衝撃的な本衝撃的な本衝撃的な本","Mike"),
("圧倒的な本圧倒的な本圧倒的な本","花子");

create table users(
  id int unsigned not null auto_increment,
  nickname varchar(100) not null,
  email varchar(100) not null,
  password varchar(100) not null,
  created_at datetime not null DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key (id),
  unique key(email)
);

insert into users(nickname,email,password) values
('太郎','taro@example.com','$2b$10$wFi8RBzI3EpHt6XxqxLdLO41437B8RniV6ytM6NAACNPdFbjPj3je'),
('花子','hanako@example.com','$2b$10$OaDQnNzHPyS4RKihI3loxuCQPogfuBz5/WYDEtvBpV0B2FTR4l0MW');


create table user_books(
  id binary(16) not null,
  user_id int unsigned not null,
  book_id int unsigned not null,
  comment text,
  created_at datetime not null DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime not null DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  primary key(id),
  unique key(user_id,book_id),
  constraint user_books_fk_1 foreign key (user_id) references users (id),
  constraint user_books_fk_2 foreign key (book_id) references books (id)
);

insert into user_books(id,user_id,book_id) values
(uuid_to_bin(uuid(),1),1,1),
(uuid_to_bin(uuid(),1),1,2),
(uuid_to_bin(uuid(),1),2,1),
(uuid_to_bin(uuid(),1),1,3);

```

## client

[client:README](./client/README.md)を参照

## Install Memo

```
npm install --save-dev typescript @types/node ts-node
npx tsc --init
```

```
npm install apollo-server-express apollo-server-core express graphql bcrypt express-session cookie-parser mysql2 express-mysql-session
npm install --save-dev @types/bcrypt @types/express-session @types/cookie-parser types/mysql2# @types/express-mysql-session
```

```
npm install --save-dev nodemon
```

### Prisma

[公式:Relational databases(MySQL)](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-mysql)

[公式:Install Prisma Client](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/install-prisma-client-typescript-mysql)

リポジトリ clone 時も DB＆Table の作成後以下は行う

```
npx prisma db pull
npx prisma generate
```

reset

```
prisma migrate reset
```

migrate

```
npx prisma migrate dev --create-only --name initdb
npx prisma migrate dev
```

#### Memo

作成した Model の型定義は`node_modules`内で管理している。型定義を利用したい場合は以下で可能

```
import { users } from '@prisma/client'
```
