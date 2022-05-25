import { useReactiveVar, useMutation } from '@apollo/client'
import { isSignInVar, booksVar } from '../global'
import { SignOutMutation } from './Main'

const Header = () => {
  const [signOut] = useMutation(SignOutMutation, {
    onCompleted: () => {
      // TODO: SignOutした際にMutationで取得したデータの初期化をやめるか、やり方を変える
      booksVar([])
      isSignInVar(false)
    },
  })
  const isSignIn = useReactiveVar(isSignInVar)
  return (
    <header className="flex h-10 justify-between">
      <div className="ml-4 text-2xl">Header</div>
      <nav className="flex mr-4">
        <div className="text-2xl mr-2">Dummy</div>
        {isSignIn ? (
          <div>
            <button
              onClick={(e) => {
                e.preventDefault()
                signOut()
              }}
              className="text-2xl"
            >
              SignOut!
            </button>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

export default Header
