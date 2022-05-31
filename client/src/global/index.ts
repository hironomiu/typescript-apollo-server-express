import { makeVar } from '@apollo/client'
import { User } from '../types/index'

export const isSignInVar = makeVar<boolean>(false)
export const booksVar = makeVar<[]>([])
export const userVar = makeVar<User>({ nickname: '' })
export const isBookModalOnVar = makeVar<boolean>(false)
