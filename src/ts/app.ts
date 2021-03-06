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
import { PrismaClient, users } from '@prisma/client'
import expressMySqlSession from 'express-mysql-session'
import mysql2 from 'mysql2/promise'

const prisma = new PrismaClient()
const app = express()

app.use(cookieParser())

const options = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mysql',
  database: process.env.DB_DATABASE || 'graphql',
  connectTimeout: 0,
  waitForConnections: true,
}

const connection = mysql2.createPool(options)
const MySQLStore = expressMySqlSession(expressSession)
export const sessionStore = new MySQLStore({}, connection)

// MEMO: dev or prod
const productionMode = process.env.PRODUCTION_MODE || 'dev'

app.use(
  session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: productionMode === 'dev' ? false : true },
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
      let user: users | null = null
      if (req.session.userId) {
        user = await prisma.users.findUnique({
          where: {
            id: req.session.userId,
          },
        })
      }
      return { req, res, user }
    },
  })
  await server.start()
  server.applyMiddleware({ app, cors: corsOptions })
  console.log(server.graphqlPath)
})()
