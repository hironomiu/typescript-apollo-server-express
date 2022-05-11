import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express, { Response } from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import session from 'express-session'
import { typeDefs } from './typeDef'

const prisma = new PrismaClient()
const PORT = 4000

const mutation = {
  signIn: async (
    parent: any,
    args: { email: string; password: string },
    // TODO: 型
    context: { req: any; res: Response }
  ) => {
    console.log(args.email, args.password)
    console.log('context:', context.req.session)

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
        if (err) reject(err)
        resolve(isValid)
      })
    )

    if (isValid) {
      // TODO: コールバック、再作成させる
      context.req.session.regenerate(() => null)
      context.req.session.userId = user.id
      context.req.session.nickname = user.nickname
      // context.res.cookie('hoge', 'hogehoge')
      console.log('called')
      return { isSuccess: true, message: 'success' }
    }

    console.log(user)
    return { isSuccess: false, message: 'error' }
  },
  signOut: (
    parent: any,
    args: { email: string; password: string },
    // TODO: 型
    context: { req: any; res: Response }
  ) => {
    context.req.session.destroy()
    context.res.clearCookie('session')
    return { isSuccess: true, message: 'signOuted' }
  },
}

const query = {
  // TODO: 認証済みチェックの実装
  authCheck: async (parent: any, args: any, context: any) => {
    console.log('called')

    if (true) {
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
  books: async (
    parent: any,
    args: any,
    context: { req: any; res: Response }
  ) => {
    const books = await prisma.books.findMany()
    return books
  },
}

const resolvers = {
  Query: query,
  Mutation: mutation,
}

const app = express()

app.use(cookieParser())

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
const CORS_URLS: string[] = process.env.CORS_URLS?.split(' ') || [
  'http://localhost:3000',
]
const corsOptions = {
  origin: [...CORS_URLS],
  credentials: true,
  optionsSuccessStatus: 200,
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
