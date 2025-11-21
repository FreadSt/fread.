import React, { useState } from 'react';
import { userRequest } from '../request-methods.ts';
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {AdminChat} from "../components/AdminChat.tsx";

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
    <div className='min-h-[calc(100vh-64px)] bg-gray-100 lg:p-8 md:p-8 sm:p-4 xs:p-2'>
      <div className='max-w-full grid grid-cols-1 md:grid-cols-4 gap-6'>
        <section className='md:col-span-2 bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-semibold mb-4'>Admin Panel</h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Title</label>
              <input
                type='text'
                name='title'
                value={state.product.title}
                onChange={handleInputChange}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Description</label>
              <input
                type='text'
                name='description'
                value={state.product.description}
                onChange={handleInputChange}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Image URL</label>
              <input
                type='text'
                name='image'
                value={state.product.image}
                onChange={handleInputChange}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Categories (comma-separated)</label>
              <input
                type='text'
                value={state.product.categories.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'categories')}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                placeholder='e.g., shoes, man, casual'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Sizes (comma-separated)</label>
              <input
                type='text'
                value={state.product.size.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'size')}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                placeholder='e.g., s, m, l'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Colors (comma-separated)</label>
              <input
                type='text'
                value={state.product.color.join(', ')}
                onChange={(e) => handleArrayInputChange(e, 'color')}
                className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                placeholder='e.g., black, white'
              />
            </div>

            <div className='grid grid-cols-2 gap-4 items-center'>
              <div>
                <label className='block text-sm font-medium mb-1'>Price</label>
                <input
                  type='number'
                  name='price'
                  value={state.product.price}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      product: { ...prev.product, price: Number(e.target.value) },
                    }))
                  }
                  className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300'
                  required
                />
              </div>

              <div className='flex items-center space-x-3'>
                <label className='text-sm font-medium'>In Stock</label>
                <input
                  type='checkbox'
                  name='inStock'
                  checked={state.product.inStock}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      product: { ...prev.product, inStock: e.target.checked },
                    }))
                  }
                  className='h-4 w-4 rounded border-gray-300 focus:ring-teal-300'
                  aria-label='In stock'
                />
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='submit'
                className='px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-300'
              >
                Add Product
              </button>

              {state.message && (
                <p className='text-sm text-gray-700'>{state.message}</p>
              )}
            </div>
          </form>
        </section>

        <aside className='md:col-span-2'>
          <AdminChat/>
        </aside>
      </div>
    </div>
  );
};
