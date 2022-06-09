import { useReactiveVar } from '@apollo/client'
import { isSignInVar, userVar, isSignOutModsalOnVar } from '../global'
import SignOutModal from './modal/SignOutModal'

const Header = () => {
  const isSignOutModalOn = useReactiveVar(isSignOutModsalOnVar)
  const user = useReactiveVar(userVar)
  const isSignIn = useReactiveVar(isSignInVar)
  return (
    <header className="flex h-10 justify-between border-b-[1px] border-gray-300">
      <div className="ml-4 text-2xl">
        Header{user.nickname ? ':' + user.nickname : null}
      </div>
      <nav className="flex mr-4">
        <div className="text-2xl mr-2">Dummy</div>
        {isSignIn ? (
          <div>
            <button
              onClick={(e) => {
                e.preventDefault()
                isSignOutModsalOnVar(true)
              }}
              className="text-2xl"
            >
              SignOut!
            </button>
          </div>
        ) : null}
      </nav>
      {isSignOutModalOn ? <SignOutModal /> : null}
    </header>
  )
}

export default Header
