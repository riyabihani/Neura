import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

type User = {
  email: string;
  name?: string | null;
};

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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <input type="text" placeholder='Name' className='border p-2 w-full mb-3' value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        <input type="email" placeholder='Email' className='border p-2 w-full mb-3' value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder='Password' className='border p-2 w-full mb-3' value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
        <button className='bg-blue-500 text-white p-2 w-full'>Register</button>
      </form>
    </div>
  )
}

export default Register