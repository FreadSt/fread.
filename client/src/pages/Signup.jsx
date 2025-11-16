import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/auth-actions.ts';
import {loginFailure} from '../store/auth-slice.ts';

const Signup = () => {
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isFetching, error, errorMessage, currentUser } = useSelector((state) => state.auth);

    // Редирект при успешной регистрации
    useEffect(() => {
        if (currentUser && !isFetching && !error) {
            navigate('/');
        }
    }, [currentUser, isFetching, error, navigate]);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const username = usernameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (!password.trim() || !username.trim() || !email.trim()) {
            dispatch(loginFailure('Please fill in all fields'));
            return;
        }

        if (password !== confirmPassword) {
            dispatch(loginFailure('Passwords do not match'));
            return;
        }

        try {
            await dispatch(register({ username, email, password }));
            usernameRef.current.value = '';
            emailRef.current.value = '';
            passwordRef.current.value = '';
            confirmPasswordRef.current.value = '';
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
      <div className='px-4 w-full h-screen flex justify-center items-center bg-login bg-no-repeat bg-cover'>
          <form
            onSubmit={handleSubmitForm}
            className='border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem]'
          >
              <h1 className='uppercase text-xl mb-4 font-bold'>Sign up</h1>
              {error && (
                <p className='text-red-500 bg-red-100 p-2 rounded mb-4'>
                    {errorMessage || 'Something went wrong. Please try again.'}
                </p>
              )}
              {isFetching && (
                <p className='text-blue-500 mb-4'>Registering...</p>
              )}
              <div className='grid gap-4 md:grid-cols-2 mb-4'>
                  <input
                    className='block p-2 border-2 rounded focus:outline-none'
                    type='text'
                    placeholder='Username'
                    ref={usernameRef}
                  />
                  <input
                    className='block p-2 border-2 rounded focus:outline-none'
                    type='email'
                    placeholder='Email'
                    ref={emailRef}
                  />
              </div>
              <div className='grid gap-4 md:grid-cols-2 mb-4'>
                  <input
                    className='block p-2 border-2 rounded focus:outline-none'
                    type='password'
                    placeholder='Password'
                    ref={passwordRef}
                  />
                  <input
                    className='block p-2 border-2 rounded focus:outline-none'
                    type='password'
                    placeholder='Confirm Password'
                    ref={confirmPasswordRef}
                  />
              </div>
              <p className='mb-4'>
                  By creating an account I consent to the processing of my personal data in
                  accordance with the{' '}
                  <a href='' className='uppercase font-bold'>
                      Privacy policy
                  </a>
              </p>
              <button
                className='mb-4 bg-teal-700 text-white p-2 disabled:bg-teal-500 disabled:cursor-not-allowed'
                disabled={isFetching}
              >
                  Create
              </button>
              <Link to='/login' className='capitalize underline mb-4'>
                  Already have an account
              </Link>
          </form>
      </div>
    );
};

export default Signup;
