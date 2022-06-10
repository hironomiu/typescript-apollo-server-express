import { useRoutes } from 'react-router-dom'
import { routePath } from './routes'

const AppRoutes = () => {
  const element = useRoutes(routePath)
  return <>{element}</>
}

export default AppRoutes
