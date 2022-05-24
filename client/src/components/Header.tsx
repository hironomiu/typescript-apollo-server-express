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
    <header className="flex h-32">
      <nav className="flex">
        <div className="text-2xl">Header</div>
        {isSignIn ? (
          <div>
            <button
              onClick={(e) => {
                e.preventDefault()
                signOut()
              }}
              className=""
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
