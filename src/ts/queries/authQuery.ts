import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const authQuery = {
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
}
