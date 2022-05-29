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
export const SignInMutation = gql`
  mutation SignInMutation($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      isSuccess
      message
      nickname
    }
  }
`
export const SignOutMutation = gql`
  mutation {
    signOut {
      isSuccess
      message
    }
  }
`
export const AuthCheck = gql`
  query {
    authCheck {
      isSuccess
      message
      nickname
    }
  }
`

export const BookCreate = gql`
  mutation BookCreate($title: String, $author: String) {
    createBook(title: $title, author: $author) {
      isSuccess
      message
    }
  }
`
