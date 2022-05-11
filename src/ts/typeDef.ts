import { gql } from 'apollo-server-core'

export const typeDefs = gql`
  type Book {
    id: Int
    title: String
    author: String
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
  }

  type Query {
    authCheck: AuthMessage
    getBookById(id: ID): Book
    getBooksByTitle(title: String): [Book]
    books: [Book]
  }

  type Mutation {
    signIn(email: String, password: String): AuthMessage
    signOut: AuthMessage
  }
`
