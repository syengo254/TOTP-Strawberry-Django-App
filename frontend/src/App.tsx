import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import LoginPage from './components/LoginPage'
import LogoutPage from './components/LogoutPage'

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/logout' element={<LogoutPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
