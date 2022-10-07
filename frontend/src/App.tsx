import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useUserContext } from './context/UserContext'
import routes, { getAuthorized } from './routes';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

function App() {
  const { authenticated, twoFactorUnverified } = useUserContext();
  const navigate = useNavigate()

  useEffect(() => {
    if(!authenticated){
        navigate('/')
    }
    if(authenticated && twoFactorUnverified){
        navigate('/verification')
    }
}, [authenticated, twoFactorUnverified]);

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
