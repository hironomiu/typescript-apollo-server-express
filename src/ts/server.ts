import { httpServer } from './app'
const SERVER_PORT = process.env.SERVER_PORT || 4000

httpServer.listen({ port: SERVER_PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${SERVER_PORT}`)
})
