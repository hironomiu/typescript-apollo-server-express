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
    }
  ) => {
    if (context.req.session.isAdmin) {
      return { isSuccess: true, message: 'admin' }
    } else {
      return { isSuccess: false, message: 'error' }
    }
  },
}
