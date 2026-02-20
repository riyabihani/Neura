import { useAuth } from './auth/AuthProvider'
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetails from './pages/NoteDetails';

const AppRoutes = () => {
  const { user, setUser, loading } = useAuth();

  if(loading) {
    return <div>Loading...</div>
  };

  return (
    <>
      {user && (<Navbar />)}
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/notes/:id" element={user ? <NoteDetails /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" replace />} />        

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes> 
    </>
  )
}

export default AppRoutes