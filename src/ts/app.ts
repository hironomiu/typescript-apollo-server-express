import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import session from 'express-session'
import { typeDefs } from './typeDef'
import { query } from './query'
import { mutation } from './mutation'

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

export const httpServer = http.createServer(app)

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
