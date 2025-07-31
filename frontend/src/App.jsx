import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AddNote from './pages/AddNote'
import EditNote from './pages/EditNote'
import ViewNote from './pages/ViewNote'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import ChangePassword from './pages/ChangePassword '

function App() {

  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const PrivateRoute = ({ element }) => {
    return isAuth ? element : <Navigate to="/login" />
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const authPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem('token');
        setIsAuth(false);
        if (!authPage) {
          navigate('/login', { replace: true });
        }
      } else {
        setIsAuth(true);
        if (authPage && location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      }
    } else {
      setIsAuth(false);
      if (!authPage) {
        navigate('/login', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/" element={<PrivateRoute isAuth={isAuth} element={<Dashboard />} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-note" element={<AddNote />} />
      <Route path="/edit-note/:id" element={<EditNote />} />
      <Route path="/view-note/:id" element={<ViewNote />} />
      <Route path="/logout" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
