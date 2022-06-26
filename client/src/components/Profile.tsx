import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useReactiveVar } from '@apollo/client'
import { isSignInVar } from '../global'
import { USERS_QUERY } from '../queries/queries'

const Profile = () => {
  const navigate = useNavigate()
  const isSignIn = useReactiveVar(isSignInVar)
  const usersQueryState = useQuery(USERS_QUERY, {
    onCompleted: (data) => {
      console.log('users', data.users)
    },
  })

  useEffect(() => {
    if (!isSignIn) {
      navigate('/signin')
    } else {
      usersQueryState.refetch()
    }
  }, [navigate, isSignIn, usersQueryState])

  return <div>Profile</div>
}

export default Profile
