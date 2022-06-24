// MEMO: 命名をHasuraと同様にUPPER_SNAKE_CASEにする。末尾には一旦QUERY or MUTATIONを付与で統一
import { gql } from '@apollo/client'

// QUERY
export const BOOKS_QUERY = gql`
  query Books($limit: Int, $offset: Int) {
    books(limit: $limit, offset: $offset) {
      id
      title
      author
    }
  }
`
export const MY_BOOKS_QUERY = gql`
  query MyBooks($limit: Int, $offset: Int) {
    myBooks(limit: $limit, offset: $offset) {
      edges {
        users {
          nickname
        }
        books {
          title
          author
        }
        comment
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`
export const AUTH_CHECK_QUERY = gql`
  query AuthCheck {
    authCheck {
      isSuccess
      message
      nickname
    }
  }
`
// MUTATION
export const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation(
    $nickname: String
    $email: String
    $password: String
  ) {
    signUp(nickname: $nickname, email: $email, password: $password) {
      isSuccess
      message
      nickname
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
  mutation SignOutMutation{
    signOut {
      isSuccess
      message
    }
  }
`
export const CREATE_BOOK_MUTATION = gql`
  mutation BookCreate($title: String, $author: String) {
    createBook(title: $title, author: $author) {
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
