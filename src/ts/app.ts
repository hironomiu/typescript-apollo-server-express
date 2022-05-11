import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import cookieParser from 'cookie-parser'
import http from 'http'
import session from 'express-session'
import { typeDefs } from './typeDef'
import { query } from './query'
import { mutation } from './mutation'

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
    context: ({ req, res }) => ({ req, res }),
  })
  await server.start()
  server.applyMiddleware({ app, cors: corsOptions })
  console.log(server.graphqlPath)
})()
