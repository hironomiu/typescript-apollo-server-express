import { makeVar } from '@apollo/client'

export const isSignInVar = makeVar<boolean>(false)
export const booksVar = makeVar<[]>([])

type User = {
  nickname: string
}
export const userVar = makeVar<User>({ nickname: '' })
