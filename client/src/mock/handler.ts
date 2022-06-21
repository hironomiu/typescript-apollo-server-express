import { ApolloClient, InMemoryCache } from '@apollo/client'
import { graphql } from 'msw'

export const handler = [
  graphql.mutation('SignInMutation', (req, res, ctx) => {
    return res(
      ctx.data({
        signIn: {
          isSuccess: true,
          message: 'ok',
          nickname: 'taro',
        },
      })
    )
  }),
  graphql.query('Books', (req, res, ctx) => {
    return res(
      ctx.data({
        books: [
          {
            author: 'テスト著者１',
            id: 1,
            title: 'テストタイトル１',
            __typename: 'Book',
          },
          {
            author: 'テスト著者２',
            id: 2,
            title: 'テストタイトル２',
            __typename: 'Book',
          },
        ],
      })
    )
  }),
  graphql.query('AuthCheck', (req, res, ctx) => {
    return res(
      ctx.data({
        authCheck: {
          isSuccess: true,
          message: 'ok',
          nickname: 'taro',
        },
      })
    )
  }),
]

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
})
