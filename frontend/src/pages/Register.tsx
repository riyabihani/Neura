import axios from 'axios';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HiOutlineLockClosed, HiOutlineMail, HiOutlineUser } from 'react-icons/hi';
import { PiBrain } from 'react-icons/pi';
import AuthLeftPanel from '../components/layout/AuthLeftPanel';
import type { User } from '../types/auth';

type RegisterProps = {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const Register = ({ setUser }: RegisterProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setUser(res.data);
      navigate('/')
    } catch (error) {
      setError("Registration failed");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-violet-100 via-purple-50 to-indigo-100">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl"></div>
      <div className="pointer-events-none absolute top-24 -right-24 h-80 w-80 rounded-full bg-indigo-300/35 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl"></div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white/60 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl md:grid-cols-2">

          {/* Left Panel */}
          <AuthLeftPanel />

          {/* Right Panel */}
          <div className="p-10 md:p-12 md:border-l md:border-white/60">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-8 grid h-18 w-18 place-items-center rounded-full bg-violet-100 text-violet-600">
                <PiBrain className="text-4xl" />
              </div>

              <h1 className="text-center text-2xl font-semibold text-slate-700">Create your account</h1>
              <p className="mt-2 text-center text-sm text-slate-500">Start building your second brain</p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                {error && (<div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">{error}</div>)}

                <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/70 focus-within:ring-violet-300">
                  <HiOutlineUser className="text-lg text-slate-400" />
                  <input type="name" 
                    placeholder="Name" 
                    value={form.name} 
                    className="w-full bg-transparent outline-none"
                    onChange={(e) => setForm({...form, name: e.target.value})} />
                </div>
                
                <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/70 focus-within:ring-violet-300">
                  <HiOutlineMail className="text-lg text-slate-400" />
                  <input type="email" 
                    placeholder="Email" 
                    value={form.email} 
                    className="w-full bg-transparent outline-none"
                    onChange={(e) => setForm({...form, email: e.target.value})} />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 ring-1 ring-slate-200/70 focus-within:ring-violet-300">
                  <HiOutlineLockClosed className="text-lg text-slate-400" />
                  <input type="password" 
                    placeholder="Password"  
                    value={form.password} 
                    className="w-full bg-transparent outline-none"
                    onChange={(e) => setForm({...form, password: e.target.value})} />  
                </div>
                <button type="submit" className="w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/60 hover:opacity-95 active:opacity-90">Register</button>

                <p className="pt-4 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link to="/login" className='font-medium text-violet-600 hover:text-violet-700 underline'>Sign In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register