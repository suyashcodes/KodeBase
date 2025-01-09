import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Editor from './pages/Editor'

const App = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          } />
        <Route path="/editor/:id" element={isLoggedIn ? <Editor /> : <Navigate to={"/login"} />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App