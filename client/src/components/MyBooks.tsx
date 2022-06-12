import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { isSignInVar } from '../global'
const MyBooks = () => {
  const isSignIn = useReactiveVar(isSignInVar)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSignIn) {
      navigate('/signin')
    }
  }, [])
  return <div className="flex flex-col my-4 items-center">MyBooks</div>
}

export default MyBooks
