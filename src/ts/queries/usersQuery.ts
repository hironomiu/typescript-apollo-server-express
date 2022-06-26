import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const usersQuery = {
  // TODO: 型、とりあえず実装（プロフィールを返すものとAdminがユーザ一覧を返すものをわける）
  users: async (
    parent: any,
    args: any,
    context: {
      req: Request & {
        session: {
          userId: number
          email: string
          nickname: string
          isAdmin: boolean
        }
      }
      res: Response
      user: any
    }
  ) => {
    // MEMO: SignInチェック
    if (!context.user) return { users: null }
    // MEMO: Adminのチェック
    const user = await prisma.users.findUnique({
      where: { id: context.req.session.userId },
    })
    console.log(user)
    if (context.req.session.isAdmin) {
      return { nickname: user?.nickname, email: user?.email }
    } else {
      return { nickname: user?.nickname, email: user?.email }
    }
  },
}
