import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const booksQuery = {
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
}
