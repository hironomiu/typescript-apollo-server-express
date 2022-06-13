import { gql } from 'apollo-server-core'

export const typeDefs = gql`
  type Book {
    id: Int
    title: String
    author: String
  }

  type BookNickname {
    nickname: String
  }

  type BookTitleAuthor {
    title: String
    author: String
  }

  type MyBook {
    comment: String
    users: BookNickname
    books: BookTitleAuthor
  }

  type User {
    id: Int
    nickname: String
    email: String
    password: String
  }

  type AuthMessage {
    isSuccess: Boolean
    message: String
    nickname: String
  }

  type BookMessage {
    isSuccess: Boolean
    message: String
    book: Book
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type MyBooks {
    edges: [MyBook]
    pageInfo: PageInfo
  }

  type Query {
    authCheck: AuthMessage
    getBookById(id: ID): Book
    getBooksByTitle(title: String): [Book]
    books(limit: Int, offset: Int, title: String): [Book]
    myBooks(limit: Int, offset: Int): MyBooks
  }

  type Mutation {
    signUp(nickname: String, email: String, password: String): AuthMessage
    signIn(email: String, password: String): AuthMessage
    signOut: AuthMessage
    createBook(title: String, author: String): BookMessage
    updateBook(id: ID, title: String, author: String): BookMessage
  }
`
