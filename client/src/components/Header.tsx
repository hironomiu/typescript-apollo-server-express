import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { isSignInVar } from '../global'

const Header = () => {
  const isSignIn = useReactiveVar(isSignInVar)
  return (
    <header className="flex ">
      <nav className="flex">
        <div>Header</div>
        {isSignIn ? 'SignIned' : null}
      </nav>
    </header>
  )
}

export default Header
