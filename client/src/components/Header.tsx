import { useReactiveVar, useMutation } from '@apollo/client'
import { isSignInVar, booksVar, userVar } from '../global'
import { SignOutMutation } from './Main'

const Header = () => {
  const [signOut] = useMutation(SignOutMutation, {
    onCompleted: () => {
      // TODO: SignOutした際にMutationで取得したデータの初期化をやめるか、やり方を変える
      booksVar([])
      userVar({ nickname: '' })
      isSignInVar(false)
    },
  })
  const user = useReactiveVar(userVar)
  const isSignIn = useReactiveVar(isSignInVar)
  return (
    <header className="flex h-10 justify-between border-b-[1px] border-gray-300">
      <div className="ml-4 text-2xl">Header:{user.nickname}</div>
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
