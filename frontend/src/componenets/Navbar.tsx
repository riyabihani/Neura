import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PiBrain } from 'react-icons/pi';
import { HiOutlineChartBar, HiOutlineMenu, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import { RiUser3Line } from 'react-icons/ri';
import { HiOutlineArrowRightOnRectangle, HiOutlineChatBubbleLeftRight, HiOutlineSquares2X2 } from 'react-icons/hi2';

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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout");
    setUser(null);
    navigate("/");
  };

  // clicking outside closes the dropdown
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if(!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [])

  const isActive = (path: string) => {
    return location.pathname === path;
  }

  const itemClass = (path: string) =>{
    return `flex items-center gap-3 rounded-lg px-4 py-3 text-base transition-colors ${isActive(path) ? "hover:bg-violet-100 text-purple-700 hover:px-2" : "text-slate-700 hover:bg-slate-100"}` 
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-8 py-3 flex justify-between items-center">
        {/* Left Side */}
        <Link to="/" className='flex items-center gap-3'>
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
            <PiBrain className="text-2xl" />
          </div>
          <span className="text-2xl font-semibold text-slate-800">Neura</span>
        </Link>

        {/* Right Side */}
        {user && (
          <div className="flex items-center gap-9">
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center text-white">
                <RiUser3Line className="text-xl" />
              </div>
              <span className="text-md font-medium text-slate-700">{user.name}</span>
            </Link>

            <button onClick={() => setMenuOpen((v) => !v)} className="text-slate-600 hover:text-violet-600 transition-colors">
              {menuOpen ? <HiOutlineX className='text-2xl font-semibold' /> : <HiOutlineMenu className='text-2xl' />}
            </button>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {user && menuOpen && (
        <div ref={menuRef} className="px-8 py-3 border-t border-slate-200 bg-white">
          <div className="max-w-full">
            <nav className="space-y-2">
              <Link to="/" onClick={() => setMenuOpen(false)} className={itemClass("/")}>
                <HiOutlineSquares2X2 className='text-xl' /> Dashboard
              </Link>

              <Link to="/" onClick={() => setMenuOpen(false)} className={itemClass("/")}>
                <HiOutlineSearch className='text-xl' /> Search
              </Link>

              <Link to="/" onClick={() => setMenuOpen(false)} className={itemClass("/")}>
                <HiOutlineChatBubbleLeftRight className='text-xl' /> Ask Notes
              </Link>

              <Link to="/" onClick={() => setMenuOpen(false)} className={itemClass("/")}>
                <HiOutlineChartBar className='text-xl' /> Insights
              </Link>

              <button onClick={handleLogout} className="mt-2 w-full text-left flex items-center gap-3 rounded-lg px-4 py-3 text-base text-red-600 hover:bg-red-50 hover:px-2 transition-colors">
                <HiOutlineArrowRightOnRectangle className="text-xl" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar