import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className='flex justify-between w-5/6 mx-auto my-6'>
      <div></div>
      <div className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>
        {isLoggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to='/login'>Login</Link>
        )}
      </div>
    </div>
  );
};

export default Header;
