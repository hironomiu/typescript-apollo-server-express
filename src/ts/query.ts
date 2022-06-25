import { usersQuery } from './queries/usersQuery'
import { authQuery } from './queries/authQuery'
import { booksQuery } from './queries/booksQuery'
import { myBooksQuery } from './queries/myBooksQuery'

export const query = {
  ...usersQuery,
  ...authQuery,
  ...booksQuery,
  ...myBooksQuery,
}
