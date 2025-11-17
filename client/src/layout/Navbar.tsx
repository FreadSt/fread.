import React from 'react';
import { Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../store/auth-actions';
import { RootState, AppDispatch } from '../store';

const Navbar: React.FC = () => {
  const totalQuantity = useSelector(
    (store: RootState) => store.cart.totalQuantity
  );
  const currentUser = useSelector(
    (store: RootState) => store.auth.currentUser
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = (): void => {
    dispatch(logoutUser());
  };

  const user = currentUser ? currentUser.name : null;

  return (
    <nav className='grid grid-cols-2 p-4 border-b font-semibold h-18'>
      <h1 className='font-bold text-3xl flex items-center justify-start px-4 tracking-wider'>
        <Link to='/'>fread.</Link>
      </h1>
      <div className='flex justify-end items-center px-4 text-md md:text-lg'>
        {user ? (
          <>
            <span className='px-4 py-2 capitalize'>Hello, {user}</span>
            <button
              onClick={handleLogout}
              className='uppercase px-4 py-2 text-teal-700'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/signup' className='uppercase px-4 py-2'>
              Register
            </Link>
            <Link to='/login' className='uppercase px-4 py-2'>
              Sign in
            </Link>
          </>
        )}
        <Link to='/cart'>
          <Badge
            badgeContent={totalQuantity}
            color='primary'
            className='cursor-pointer'
          >
            <ShoppingCart />
          </Badge>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
