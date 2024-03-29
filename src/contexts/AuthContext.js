import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { checkLoggedInStatusUrl, loggoutUrl } from '../api';
import { headers } from '../utils/Header';
import { useNavigate } from 'react-router-dom';



const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
  
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(()=>{
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [user, setUser] = useState(null);

   const checkLoggedInStatus =  async () => {
 
        try{
            const response = await axios.get(checkLoggedInStatusUrl,{headers})
            const {status} = response.data;

            setUser(response.data.response[0].user)
            setIsLoggedIn(status || initialStatus);
        }catch(error){
            console.log(error)
        }
      }

      useEffect(() => {
        checkLoggedInStatus()
        localStorage.setItem('auth', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

      const logout = async () => { 
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('auth');
          const response = await axios.get(loggoutUrl,{headers})
          setIsLoggedIn(false);
          navigate('/login');

        }catch(error){
          console.log(error)
        }
      }

      const value = {
        isLoggedIn,
        user,
        logout
      };
    
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};