import { PrismaClient } from '@prisma/client'
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
    args: { limit: number | undefined; offset: number | undefined },
    context: { req: any; res: Response; user: any }
  ) => {
    // MEMO: SignInチェック
    if (!context.user) return null
    const books = await prisma.books.findMany({
      take: args.limit,
      skip: args.offset,
    })
    return books
  },
}
