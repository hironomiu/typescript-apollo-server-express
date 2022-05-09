import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const PORT = 4000
const typeDefs = gql`
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

  type Auth {
    isSuccess: Boolean
    message: String
  }

  type Query {
    authUser(email: String, password: String): Auth
    getBookById(id: ID): Book
    getBooksByTitle(title: String): [Book]
    books: [Book]
  }
`

const query = {
  // TODO: 認証処理の確認
  authUser: async (
    parent: any,
    args: { email: string; password: string },
    context: any
  ) => {
    const user = await prisma.users.findUnique({
      where: {
        email: args.email,
      },
    })
    if (!user) {
      return { isSuccess: false, message: 'error' }
    }
    const isValid = await new Promise((resolve, reject) =>
      bcrypt.compare(args.password, user.password, (err, isValid) => {
        resolve(isValid)
      })
    )
    if (isValid) {
      return { isSuccess: true, message: 'success' }
    }

    return { isSuccess: false, message: 'error' }
  },
  getBookById: async (parent: any, args: { id: string }, context: any) => {
    const books = await prisma.books.findUnique({
      where: { id: Number(args.id) },
    })
    return books
  },
  getBooksByTitle: async (
    parent: any,
    args: { title: string },
    context: any
  ) => {
    const books = await prisma.books.findMany({
      where: { title: args.title },
    })
    return books
  },
  books: async () => {
    const books = await prisma.books.findMany()
    return books
  },
}

const resolvers = {
  Query: query,
}

const app = express()
const httpServer = http.createServer(app)

;(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await server.start()
  server.applyMiddleware({ app })
  console.log(server.graphqlPath)
})()

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
