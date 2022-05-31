import { makeVar } from '@apollo/client'
import { Book, User } from '../types/index'

export const isSignInVar = makeVar<boolean>(false)
export const booksVar = makeVar<[]>([])
export const userVar = makeVar<User>({ nickname: '' })
export const isBookModalOnVar = makeVar<boolean>(false)
// MEMO: ModalにBook情報を渡す
export const bookVar = makeVar<Book>({})
