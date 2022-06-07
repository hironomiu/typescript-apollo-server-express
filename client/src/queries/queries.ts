// MEMO: 命名をHasuraと同様にUPPER_SNAKE_CASEにする。末尾には一旦QUERY or MUTATIONを付与で統一
import { gql } from '@apollo/client'

// QUERY
export const BOOKS_QUERY = gql`
  query ($limit: Int, $offset: Int) {
    books(limit: $limit, offset: $offset) {
      id
      title
      author
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
// MUTATION
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
export const CREATE_UPDATE_BOOK_MUTATION = gql`
  mutation BookCreate($id: ID, $title: String, $author: String) {
    createBook(id: $id, title: $title, author: $author) {
      isSuccess
      message
      book {
        id
        title
        author
      }
    }
  }
`

export const UPDATE_BOOK_MUTATION = gql`
  mutation BookUpdate($id: ID, $title: String, $author: String) {
    updateBook(id: $id, title: $title, author: $author) {
      isSuccess
      message
      book {
        id
        title
        author
      }
    }
  }
`
