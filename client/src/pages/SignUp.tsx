import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { validation } from "../helpers/validation.ts";
import { InputField } from "../components/InputField.tsx";
import { fields } from "../constants/auth/inputFields.ts";
import { register } from "../store/auth-actions.ts";
import { RootState, AppDispatch } from "../store";

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isFetching, error, errorMessage, currentUser } = useSelector(
      (state: RootState) => state.auth
  );

  const navigate = useNavigate();

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser && !isFetching && !error) {
      navigate('/');
    }
  }, [currentUser, isFetching, error, navigate]);

  const handleChangeFields = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validation(userData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await dispatch(
          register({
            username: userData.name,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
          })
      );
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
      <div className='px-4 w-full h-screen flex justify-center items-center bg-login bg-no-repeat bg-cover'>
        <div className='border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem]'>
          <h1 className='uppercase text-xl mb-4 font-bold'>Sign up</h1>
          {error && (
              <p className='text-red-500 bg-red-100 p-2 rounded mb-4'>
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
          )}
          {isFetching && <p className='text-blue-500 mb-4'>Registering...</p>}
          <aside>
            {fields.map((field, index) => (
                <div key={index}>
                  <InputField
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={userData[field.name as keyof UserData]}
                      onChange={handleChangeFields}
                      error={errors[field.name as keyof ValidationErrors]}
                  />
                </div>
            ))}
          </aside>
          <p className='mb-4'>
            By creating an account I consent to the processing of my personal data in
            accordance with the{' '}
            <a href='' className='uppercase font-bold'>
              Privacy policy
            </a>
          </p>
          <button
              style={{ zIndex: 9999 }}
              type='submit'
              onClick={handleSubmitForm}
              className='submit mb-4 bg-teal-700 text-white p-2 disabled:bg-teal-500 disabled:cursor-not-allowed'
              disabled={isFetching}
          >
            Create
          </button>
          <Link to='/login' className='capitalize underline mb-4'>
            Already have an account
          </Link>
        </div>
      </div>
  );
};
