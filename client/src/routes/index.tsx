import Layout from '../components/Layout'
import Main from '../components/Main'
import MyBooks from '../components/MyBooks'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

export const routePath = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />,
        children: [],
      },
      {
        path: '/mybooks',
        element: <MyBooks />,
      },
      {
        path: '/signin',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
    ],
  },
]
