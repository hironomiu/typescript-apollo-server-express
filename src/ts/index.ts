import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express, { Request, Response } from 'express'
import http from 'http'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import session from 'express-session'

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

  type Mutation {
    signIn(email: String, password: String): Auth
  }
`

const mutation = {
  signIn: async (
    parent: any,
    args: { email: string; password: string },
    // TODO: 型
    context: { req: any; res: Response }
  ) => {
    console.log(context.req.session, args.email, args.password)
    context.res.cookie('test', 'testtest')
    context.req.session.userId = 'hoge'
    return { isSuccess: false, message: 'error' }
  },
}

const query = {
  // TODO: 認証処理をmutationに移動(signIn)、代わりに認証済みチェックの実装
  authUser: async (
    parent: any,
    args: { email: string; password: string },
    context: any
  ) => {
    console.log('req:', context.req)
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
  // 仮で動作確認のためsession設定、cookieレスポンス
  books: async (
    parent: any,
    args: any,
    context: { req: any; res: Response }
  ) => {
    console.log('called')
    console.log(context.req.session)
    context.req.session.userId = 'hoge'
    context.res.cookie('hoge', 'hogehoge')
    const books = await prisma.books.findMany()

    return books
  },
}

const resolvers = {
  Query: query,
  Mutation: mutation,
}

const app = express()

// app.use(
//   cors({
//     origin: [
//       'http://localhost:3001',
//       'https://studio.apollographql.com/sandbox/explorer',
//     ],
//     // credentials: true,
//     optionsSuccessStatus: 200,
//   })
// )

app.use(
  session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    // TODO: MySQLにストアさせる
    // store: sessionStore,
    cookie: { secure: false },
  })
)

const httpServer = http.createServer(app)

const corsOptions = {
  origin: ['http://localhost:3001', 'https://studio.apollographql.com'],
}

;(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) => ({ req, res }),
  })
  await server.start()
  server.applyMiddleware({ app, cors: corsOptions })
  console.log(server.graphqlPath)
})()

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
