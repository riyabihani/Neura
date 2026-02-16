import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

type User = {
  email: string;
  name?: string | null;
};

type NavProps = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const Navbar = ( {user, setUser}: NavProps ) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    setUser(null);
    navigate("/");
  }

  return (
    <nav className='bg-gray-800 p-4 text-white flex justify-between items-center'>
      <Link to="/">Neura</Link>
      <div>
        {user ? (
          <button onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar