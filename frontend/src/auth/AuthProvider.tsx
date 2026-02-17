import React, { createContext, type ReactNode, useState, useEffect, useContext } from 'react'
import type { User } from '../types/auth';
import axios from 'axios';

// ensure cookies are sent
axios.defaults.withCredentials = true;

// data auth provides
type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean
};

// creating the context i.e. global container
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    // all the components inside AuhProvider can access user, setuser and loading
    <AuthContext.Provider value={{user, setUser, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

// hook - cleaner way to use context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used with an AuthProvider");
  }
  return context;
}

export default AuthProvider;
export { useAuth };