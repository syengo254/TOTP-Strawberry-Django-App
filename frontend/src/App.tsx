import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useUserContext } from './context/UserContext'
import routes, { getAuthorized } from './routes'

function App() {
  const { authenticated } = useUserContext();

  return (
    <div className='app'>
      <Routes>
        {
          routes.map((route: any) => <Route key={route.path} path={route.path} element={route.requiresAuth ? getAuthorized(route.element, authenticated) : route.element} />)
        }
      </Routes>
    </div>
  )
}

export default App
