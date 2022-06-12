import { PrismaClient, users } from '@prisma/client'
const prisma = new PrismaClient()

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
    if (!context.user) return { edges: [], pageInfo: '' }
    console.log('myBooks called')
    const myBooks = await prisma.user_books.findMany({
      // MEMO: ページネーションの実装
      take: args.limit,
      skip: args.offset,
      where: {
        user_id: context.user.id,
      },
      orderBy: [
        {
          created_at: 'desc',
        },
      ],
      include: {
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
    })
    console.log(myBooks)
    return { edges: myBooks, pageInfo: 'pageInfo' }
  },
}
