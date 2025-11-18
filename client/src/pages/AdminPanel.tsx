import React, { useState } from 'react';
import { userRequest } from '../request-methods.ts';
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import AdminChat from "../components/AdminChat.tsx";

interface Product {
  title: string;
  description: string;
  image: string;
  categories: string[];
  size: string[];
  color: string[];
  price: number;
  inStock: boolean;
}

interface AdminPanelState {
  product: Product;
  message: string;
}

export const AdminPanel:React.FC = () => {
  const { currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [state, setState] = useState<AdminPanelState>({
    product: {
      title: '',
      description: '',
      image: '',
      categories: [],
      size: [],
      color: [],
      price: 0,
      inStock: true,
    },
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      product: { ...prev.product, [name]: value },
    }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Product
  ): void => {
    const { value } = e.target;
    setState((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [field]: value.split(',').map((item) => item.trim()),
      },
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await userRequest.post('/products', state.product);
      setState((prev) => ({
        ...prev,
        message: 'Product added successfully!',
        product: {
          title: '',
          description: '',
          image: '',
          categories: [],
          size: [],
          color: [],
          price: 0,
          inStock: true,
        },
      }));
    } catch (error: unknown) {
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as Error).message ||
        'Error adding product';
      setState((prev) => ({
        ...prev,
        message: 'Error adding product: ' + errorMessage,
      }));
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className='flex flex-col items-center justify-center h-screen gap-4'>
        <h1 className='text-4xl font-bold text-red-600'>Access Denied</h1>
        <p className='text-gray-600 text-lg'>You do not have admin privileges</p>
        <Navigate to='/' replace />
      </div>
    );
  }

  return (
    <div className='flex justify-between  gap-4 p-4 box-sizing bg-gray-100 overflow-y-hidden'>
      <div className='flex justify-center p-4 w-1/2'>
        <section className='w-[80%]'>
          <h1 className='text-3xl mb-4'>Admin Panel</h1>
          <form onSubmit={handleSubmit} className='max-w-lg shadow-md p-4 rounded max-h-screen bg-white'>
            <div className='mb-4'>
              <label className='block mb-2'>Title</label>
              <input
                type='text'
                name='title'
                value={state.product.title}
                onChange={handleInputChange}
                className='w-full p-2 border'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Description</label>
              <input
                type='text'
                name='description'
                value={state.product.description}
                onChange={handleInputChange}
                className='w-full p-2 border'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Image URL</label>
              <input
                type='text'
                name='image'
                value={state.product.image}
                onChange={handleInputChange}
                className='w-full p-2 border'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Categories (comma-separated)</label>
              <input
                type='text'
                value={state.product.categories.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'categories')}
                className='w-full p-2 border'
                placeholder='e.g., shoes, man, casual'
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Sizes (comma-separated)</label>
              <input
                type='text'
                value={state.product.size.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'size')}
                className='w-full p-2 border'
                placeholder='e.g., s, m, l'
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Colors (comma-separated)</label>
              <input
                type='text'
                value={state.product.color.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'color')}
                className='w-full p-2 border'
                placeholder='e.g., black, white'
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Price</label>
              <input
                type='number'
                name='price'
                value={state.product.price}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    product: {
                      ...prev.product,
                      price: Number(e.target.value),
                    },
                  }))
                }
                className='w-full p-2 border'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>In Stock</label>
              <input
                type='checkbox'
                name='inStock'
                checked={state.product.inStock}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    product: {
                      ...prev.product,
                      inStock: e.target.checked,
                    },
                  }))
                }
              />
            </div>
            <button
              type='submit'
              className='bg-teal-700 text-white p-2 rounded hover:bg-teal-800'
            >
              Add Product
            </button>
            {state.message && <p className='mt-4 text-red-700'>{state.message}</p>}
          </form>
        </section>
      </div>
      <div>
        <AdminChat/>
      </div>
    </div>
  );
};
