import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./componenets/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";

// set cookies
axios.defaults.withCredentials = true;

type User = {
  email: string;
  name?: string | null;
};


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<User>("http://localhost:5000/api/auth/profile");
        setUser(res.data)
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {user && (<Navbar user={user} setUser={setUser} />)}
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" replace />} />
        </Routes> 
    </BrowserRouter>
  );
}

export default App;
