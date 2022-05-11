import { Response } from 'express'
import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const mutation = {
  signIn: async (
    parent: any,
    args: { email: string; password: string },
    context: {
      req: Request & { session: { userId: number; nickname: string } }
      res: Response
    }
  ) => {
    console.log(args.email, args.password)
    console.log('context:', context.req.session)
    // TODO: コールバック、再作成させる、処理する場所について
    context.req.session.regenerate(() => null)

    const user = await prisma.users.findUnique({
      where: {
        email: args.email,
      },
    })

    if (!user) {
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
      context.req.session.nickname = user.nickname
      return { isSuccess: true, message: 'success' }
    }

    console.log(user)
    return { isSuccess: false, message: 'error' }
  },
  signOut: (
    parent: any,
    args: any,
    context: {
      req: Request & { session: { destroy: () => void } }
      res: Response
    }
  ) => {
    context.req.session.destroy()
    context.res.clearCookie('session')
    return { isSuccess: true, message: 'signOuted' }
  },
}
