import Layout from '../components/Layout'
import Main from '../components/Main'
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
