import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express, { Request, Response } from 'express'
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

    console.log(user)

    if (isValid) {
      // context.req.session.regenerate()
      context.req.session.id = user.id
      context.req.session.nickname = user.nickname
      context.res.cookie('hoge', 'hogehoge')
      return { isSuccess: true, message: 'success' }
    }

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
  // TODO: 認証処理をmutationに移動(signIn)、代わりに認証済みチェックの実装
  authUser: async (
    parent: any,
    args: { email: string; password: string },
    context: any
  ) => {
    console.log('called')

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
    const books = await prisma.books.findMany()
    console.log('called')
    console.log(context.req.session)
    context.req.session.userId = 'hoge'
    console.log(context.req.session)
    context.res.cookie('hoge', 'hogehoge')
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
