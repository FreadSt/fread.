import React, {useEffect} from 'react';
import { Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import {logout} from "../store/auth-slice.ts";
import { clearCartOnLogout } from '../store/cart-slice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const totalQuantity = useSelector(
    (store: RootState) => store.cart.totalQuantity
  );
  const currentUser = useSelector(
    (store: RootState) => store.auth.currentUser
  );

  useEffect(() => {

  }, [currentUser, navigate]);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(clearCartOnLogout());
    dispatch(logout());
  };

  return (
    <nav className='grid grid-cols-2 p-4 border-b font-semibold h-18'>
      <h1 className='font-bold text-3xl flex items-center justify-start px-4 tracking-wider'>
        <Link to='/'>fread.</Link>
      </h1>
      <div className='flex justify-end items-center px-4 text-md md:text-lg'>
        {currentUser ? (
          <>
            <span className='px-4 py-2 capitalize'>Hello, {currentUser.username}</span>
            {currentUser.isAdmin && <Link to={'/adminpanel'}>Admin Panel</Link> }
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
