import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isFetching } = useSelector(
    (state: RootState) => state.auth
  );

  if (isFetching) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700' />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to='/login' replace />;
  }

  if (!currentUser.isAdmin) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <h1 className='text-4xl font-bold text-red-600'>Access Denied</h1>
        <p className='text-gray-600 text-lg'>You do not have admin privileges</p>
        <Navigate to='/' replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
