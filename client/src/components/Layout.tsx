import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  return (
    <div className="flex flex-col w-screen h-[100vh] bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
