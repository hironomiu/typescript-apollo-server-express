import { httpServer } from './app'
const PORT = 4000

httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})
