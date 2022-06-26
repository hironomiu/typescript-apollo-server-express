export const usersQuery = {
  // TODO: 型
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
    if (!context.user)
      return { isSuccess: false, message: 'error', users: null }
    // MEMO: Adminのチェック
    if (context.req.session.isAdmin) {
      return { isSuccess: true, message: 'admin', users: null }
    } else {
      return { isSuccess: true, message: 'common', users: null }
    }
  },
}
