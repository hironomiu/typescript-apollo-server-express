import { Response } from 'express'
import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { resolve } from 'path'

const prisma = new PrismaClient()

export const mutation = {
  signUp: async (
    parent: any,
    args: { nickname: string; email: string; password: string },
    context: {
      req: Request & {
        session: { userId: number; email: string; nickname: string }
      }
      res: Response
    }
  ) => {
    console.log('post signUp:', args)
    const hash = new Promise((resolve) =>
      bcrypt.hash(args.password, 10, (err, hash) => {
        if (err) return { isSuccess: false, message: 'error', nickname: '' }
        resolve(hash)
      })
    )
    const password = await hash
    if (typeof password === 'string') {
      try {
        const user = await prisma.users.create({
          data: {
            nickname: args.nickname,
            email: args.email,
            password: password,
          },
        })
        return { isSuccess: true, message: 'OK', nickname: args.nickname }
      } catch (error) {
        return { isSuccess: false, message: 'error', nickname: '' }
      }
    } else {
      return { isSuccess: false, message: 'error', nickname: '' }
    }
  },
  signIn: async (
    parent: any,
    args: { email: string; password: string },
    context: {
      req: Request & {
        session: { userId: number; email: string; nickname: string }
      }
      res: Response
    }
  ) => {
    // TODO: コールバック内必要な処理記述、処理する場所について
    context.req.session.regenerate(() => null)

    const user = await prisma.users.findUnique({
      where: {
        email: args.email,
      },
    })

    if (!user) {
      context.req.session.destroy(() => null)
      return { isSuccess: false, message: 'error' }
    }

    const isValid = await new Promise((resolve, reject) =>
      bcrypt.compare(args.password, user.password, (err, isValid) => {
        if (err) reject(err)
        resolve(isValid)
      })
    )

    if (isValid) {
      context.req.session.userId = user.id
      context.req.session.email = user.email
      context.req.session.nickname = user.nickname
      return { isSuccess: true, message: 'success', nickname: user.nickname }
    }

    return { isSuccess: false, message: 'error' }
  },
  signOut: (
    parent: any,
    args: any,
    context: {
      req: Request & { session: { destroy: () => void } }
      res: Response
      user: any
    }
  ) => {
    // MEMO: SignInチェック
    if (!context.user) return null
    context.req.session.destroy()
    context.res.clearCookie('session')
    return { isSuccess: true, message: 'signOuted' }
  },
  // TODO: Booksの登録(insert),更新(update) -> upsert、命名をupsertに合わせる
  createBook: async (
    parent: any,
    args: { title: string; author: string },
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
    const book = await prisma.books.create({
      data: {
        title: args.title,
        author: args.author,
      },
    })
    console.log(book)
    return { isSuccess: true, message: 'created', book: book }
  },
  // TODO: Booksの登録(insert),更新(update) -> upsert、命名をupsertに合わせる
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
