import { makeVar } from '@apollo/client'
import { Book, User } from '../types/index'

export const isSignInVar = makeVar<boolean>(false)
export const booksVar = makeVar<[]>([])
// TODO: pageInfoの型は戻り値を決定してからつける
export const myBooksVar = makeVar<{ edges: []; pageInfo: any }>({
  edges: [],
  pageInfo: '',
})
export const userVar = makeVar<User>({ nickname: '' })
export const isBookModalOnVar = makeVar<boolean>(false)
export const isSignOutModsalOnVar = makeVar<boolean>(false)

// MEMO: ModalにBook情報を渡す
export const bookVar = makeVar<Book>({})
