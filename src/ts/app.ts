import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import session from 'express-session'
import * as expressSession from 'express-session'
import { typeDefs } from './typeDef'
import { query } from './query'
import { mutation } from './mutation'
import { PrismaClient } from '@prisma/client'
import expressMySqlSession from 'express-mysql-session'
import mysql2 from 'mysql2/promise'

const prisma = new PrismaClient()
const app = express()

app.use(cookieParser())

const DB_DATABASE = process.env.DB_DATABASE || 'graphql'
const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PASSWORD = process.env.DB_PASSWORD || 'mysql'
const DB_PORT = Number(process.env.DB_PORT) || 3306
const DB_USER = process.env.DB_USER || 'root'

const options = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  connectTimeout: 0,
  waitForConnections: true,
}
const connection = mysql2.createPool(options)
const MySQLStore = expressMySqlSession(expressSession)
const sessionStore = new MySQLStore({}, connection)

app.use(
  session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false },
  })
)

export const httpServer = http.createServer(app)

const corsOptions = {
  origin: process.env.CORS_URLS?.split(' ') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
}

;(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers: {
      Query: query,
      Mutation: mutation,
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: async ({ req, res }: any) => {
      console.log('session:', req.session)
      // TODO: 型
      let user: any | null = null
      if (req.session.userId) {
        user = await prisma.users.findUnique({
          where: {
            id: req.session.userId,
          },
        })
      }
      console.log('context return:', user)

      return { req, res, user }
    },
  })
  await server.start()
  server.applyMiddleware({ app, cors: corsOptions })
  console.log(server.graphqlPath)
})()
