import { PrismaClient, users } from '@prisma/client'
import mysql2 from 'mysql2/promise'
const prisma = new PrismaClient()

const options = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mysql',
  database: process.env.DB_DATABASE || 'graphql',
  connectTimeout: 0,
  waitForConnections: true,
}

const connection = mysql2.createPool(options)

export const myBooksQuery = {
  myBooks: async (
    parent: any,
    args: {
      limit: number | undefined
      offset: number | undefined
    },
    context: { req: any; res: Response; user: users }
  ) => {
    // MEMO: SignInチェック
    if (!context.user) return { edges: [], pageInfo: {} }
    // TODO: 型
    let rowss: any
    // TODO: NaNの時の対策
    if (typeof args.limit === 'number' && typeof args.offset === 'number') {
      console.log('calleddddd')
      rowss = await connection.query(
        `
        select comment, bin_to_uuid(user_books.id,1) as uuid,nickname,title,author 
        from user_books 
        inner join users on (user_books.user_id = users.id) 
        inner join books on (user_books.book_id = books.id) 
        where user_id = ?
        limit ?
        offset ?
        `,
        [context.user.id, args.limit, args.offset]
      )
    } else {
      rowss = await connection.query(
        `
        select comment, bin_to_uuid(user_books.id,1) as uuid,nickname,title,author 
        from user_books 
        inner join users on (user_books.user_id = users.id) 
        inner join books on (user_books.book_id = books.id) 
        where user_id = ?
        `,
        [context.user.id]
      )
    }

    type Row = {
      comment: string
      uuid: string
      nickname: string
      title: string
      author: string
    }
    const rows: Row[] = rowss[0]

    const myBooks2 = rows.map((row: Row) => ({
      comment: row.comment,
      users: { nickname: row.nickname },
      books: {
        title: row.title,
        author: row.author,
      },
    }))

    // MEMO: hasNextPage次ページがあるかチェック
    // TODO: 型
    const hasNextPageCount: any = await connection.query(
      `
      select count(*) as cnt from user_books where id >  uuid_to_bin(?,1) and user_id = ?
      `,
      [rows[rows.length - 1].uuid, context.user.id]
    )

    return {
      edges: myBooks2,
      pageInfo: {
        endCursor: rows[rows.length - 1].uuid,
        hasNextPage: !!hasNextPageCount[0][0].cnt,
      },
    }
  },
}
