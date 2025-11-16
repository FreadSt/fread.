import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/auth-actions.ts';
import { loginFailure } from '../store/auth-slice.ts';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((store) => store.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (auth.currentUser && !auth.isFetching && !auth.error) {
      navigate('/');
    }
  }, [auth.currentUser, auth.isFetching, auth.error, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!password.trim() || !username.trim()) {
      dispatch(loginFailure('Please fill in all fields'));
      return;
    }

    try {
      await dispatch(login({ username, password }));
      // Очищаем форму
      setFormData({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='px-4 w-full h-screen flex justify-center items-center bg-login bg-no-repeat bg-cover'>
      <form
        onSubmit={formSubmitHandler}
        className='border bg-white p-6 flex flex-col min-w-[17rem] sm:min-w-[22rem] md:min-w-[25rem]'
      >
        <h1 className='uppercase text-xl mb-4 font-bold'>Log in</h1>
        {auth.error && (
          <p className='text-red-500 bg-red-100 p-2 rounded mb-4'>
            {auth.errorMessage || 'Something went wrong. Please try again.'}
          </p>
        )}
        {auth.isFetching && (
          <p className='text-blue-500 mb-4'>Logging in...</p>
        )}
        <input
          className='p-2 mb-4 border-2 rounded focus:outline-none'
          type='text'
          placeholder='Username'
          name='username'
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          className='p-2 mb-4 border-2 rounded focus:outline-none'
          type='password'
          placeholder='Password'
          name='password'
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          type='submit'
          className='mb-4 bg-teal-700 text-white p-2 disabled:bg-teal-500 disabled:cursor-not-allowed'
          disabled={auth.isFetching}
        >
          Login
        </button>
        <Link to='/signup' className='capitalize underline mb-4'>
          Create a new account
        </Link>
      </form>
    </div>
  );
};

export default Login;
