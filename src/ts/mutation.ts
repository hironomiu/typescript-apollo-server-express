import { authMutation } from './mutations/authMutation'
import { booksMutation } from './mutations/booksMutation'

export const mutation = {
  ...authMutation,
  ...booksMutation,
}
