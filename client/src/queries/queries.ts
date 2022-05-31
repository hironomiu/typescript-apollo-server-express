// MEMO: 命名をHasuraと同様にUPPER_SNAKE_CASE(末尾はQUERY or MUTATION)で統一
import { gql } from '@apollo/client'

export const BOOKS_QUERY = gql`
  query {
    books {
      id
      title
      author
    }
  }
`
export const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      isSuccess
      message
      nickname
    }
  }
`
export const SIGN_OUT_MUTATION = gql`
  mutation {
    signOut {
      isSuccess
      message
    }
  }
`
export const AUTH_CHECK_QUERY = gql`
  query {
    authCheck {
      isSuccess
      message
      nickname
    }
  }
`
export const CREATE_BOOK_MUTATION = gql`
  mutation BookCreate($title: String, $author: String) {
    createBook(title: $title, author: $author) {
      isSuccess
      message
    }
  }
`
