import { Response, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMutation } from './mutations/authMutation'

const prisma = new PrismaClient()

export const mutation = {
  ...authMutation,
  // Memo: Booksの更新(update)
  updateBook: async (
    parent: any,
    args: { id: number; title: string; author: string },
    context: {
      req: Request & {
        session: { userId: number; email: string; nickname: string }
      }
      res: Response
      user: any
    }
  ) => {
    console.log('create book called:', args)
    // MEMO: SignInチェック
    if (!context.user) return null
    const book = await prisma.books.update({
      where: {
        id: Number(args.id),
      },
      data: {
        title: args.title,
        author: args.author,
      },
    })
    console.log(book)
    return { isSuccess: true, message: 'created', book: book }
  },
}
