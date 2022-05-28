import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import Header from './Header'
import { AuthCheck } from './Main'
import { isSignInVar, userVar } from '../global'

const Layout = () => {
  const { refetch } = useQuery(AuthCheck, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data.authCheck.isSuccess) {
        isSignInVar(true)
      }
    },
  })

  // SignInチェック
  useEffect(() => {
    refetch().then((data: any) => {
      if (data.data.authCheck.isSuccess) {
        isSignInVar(true)
        userVar({ nickname: data.data.authCheck.nickname })
      }
    })
  }, [refetch])
  return (
    <div className="flex flex-col w-screen h-[100vh] bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
