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

export const query = {
  // TODO: 型
  authCheck: async (parent: any, args: any, context: any) => {
    console.log('called', context.req.session.userId)

    if (!context.req.session.userId)
      return { isSuccess: false, message: 'error' }

    const user = await prisma.users.findUnique({
      where: {
        id: context.req.session.userId,
      },
    })
    if (user) {
      console.log('success return:', user)
      return { isSuccess: true, message: 'success', nickname: user.nickname }
    }
    return { isSuccess: false, message: 'error' }
  },
  // TODO: 型
  getBookById: async (parent: any, args: { id: string }, context: any) => {
    const books = await prisma.books.findUnique({
      where: { id: Number(args.id) },
    })
    return books
  },
  // TODO: 型
  getBooksByTitle: async (
    parent: any,
    args: { title: string },
    context: any
  ) => {
    const books = await prisma.books.findMany({
      where: { title: args.title },
    })
    return books
  },

  // TODO: 型
  books: async (
    parent: any,
    args: {
      limit: number | undefined
      offset: number | undefined
      title: string | undefined
    },
    context: { req: any; res: Response; user: any }
  ) => {
    // MEMO: SignInチェック
    if (!context.user) return null
    console.log('books called')
    // MEMO: whereでtitleを指定された場合
    // TODO: prismaでwhereに指定する際に引数がnullだったら渡さない方法がないか調べる
    if (args.title) {
      const books = await prisma.books.findMany({
        // MEMO: ページネーションの実装
        take: args.limit,
        skip: args.offset,
        where: {
          title: args.title,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
      })
      return books
    } else {
      const books = await prisma.books.findMany({
        // MEMO: ページネーションの実装
        take: args.limit,
        skip: args.offset,
        orderBy: [
          {
            id: 'desc',
          },
        ],
      })
      return books
    }
  },
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
    console.log('myBooks called')
    // TODO: とりあえずmysql2でquery実行、これをprismaの代替で書き直す
    const a = await connection.query(
      'select bin_to_uuid(id,1) as uuid from user_books where user_id = ?',
      [context.user.id]
    )
    console.log(a)

    const myBooks = await prisma.user_books.findMany({
      // MEMO: ページネーションの実装
      take: args.limit,
      skip: args.offset,
      select: {
        id: true,
        comment: true,
        users: {
          select: {
            nickname: true,
          },
        },
        books: {
          select: {
            title: true,
            author: true,
          },
        },
      },
      where: {
        user_id: context.user.id,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
    console.log(myBooks)
    return { edges: myBooks, pageInfo: { endCursor: '', hasNextPage: true } }
  },
}
