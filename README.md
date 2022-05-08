# typescript-apollo-server-express

## .env

| 変数名       | 設定値               |
| :----------- | :------------------- |
| DB_DATABASE  | session store で使用 |
| DB_HOST      | session store で使用 |
| DB_PASSWORD  | session store で使用 |
| DB_PORT      | session store で使用 |
| DB_USER      | session store で使用 |
| DATABASE_URL | prisma で使用        |

## Database

```
create database graphql;
```

```
create table books(
    id int not null auto_increment,
    title varchar(10) not null,
    author varchar(10) not null,
    primary key(id)
);

insert into books(title,author) values("本A","太郎"),("本B","Mike"),("本C","花子");
```

## Install Memo

```
npm install --save-dev typescript @types/node ts-node
npx tsc --init
```

```
npm install apollo-server-express apollo-server-core express graphql
```

```
npm install --save-dev nodemon
```

### Prisma

[公式:Relational databases(MySQL)](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-mysql)

[公式:Install Prisma Client](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/install-prisma-client-typescript-mysql)

```
npx prisma db pull
npx prisma generate
```
