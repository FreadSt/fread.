import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userRequest } from '../request-methods.ts';
import Navbar from '../layout/Navbar';
import Announcement from '../layout/Announcement';
import Footer from '../layout/Footer';

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.currentUser);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    image: '',
    categories: [],
    size: [],
    color: [],
    price: '',
    inStock: true,
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userRequest.post('/products', product);
      setMessage('Product added successfully!');
      setProduct({
        title: '',
        description: '',
        image: '',
        categories: [],
        size: [],
        color: [],
        price: '',
        inStock: true,
      });
    } catch (error) {
      setMessage('Error adding product: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!user || !user.isAdmin) return null; // Дополнительная проверка на клиенте

  return (
    <>
      <Announcement />
      <Navbar />
      <section className='p-8'>
        <h1 className='text-3xl mb-4'>Admin Panel</h1>
        <form onSubmit={handleSubmit} className='max-w-lg'>
          <div className='mb-4'>
            <label className='block mb-2'>Title</label>
            <input
              type='text'
              name='title'
              value={product.title}
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
              value={product.description}
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
              value={product.image}
              onChange={handleInputChange}
              className='w-full p-2 border'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Categories (comma-separated)</label>
            <input
              type='text'
              value={product.categories.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'categories')}
              className='w-full p-2 border'
              placeholder='e.g., shoes, man, casual'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Sizes (comma-separated)</label>
            <input
              type='text'
              value={product.size.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'size')}
              className='w-full p-2 border'
              placeholder='e.g., s, m, l'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Colors (comma-separated)</label>
            <input
              type='text'
              value={product.color.join(', ')}
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
              value={product.price}
              onChange={(e) => setProduct((prev) => ({ ...prev, price: Number(e.target.value) }))}
              className='w-full p-2 border'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>In Stock</label>
            <input
              type='checkbox'
              name='inStock'
              checked={product.inStock}
              onChange={(e) => setProduct((prev) => ({ ...prev, inStock: e.target.checked }))}
            />
          </div>
          <button
            type='submit'
            className='bg-teal-700 text-white p-2 rounded hover:bg-teal-800'
          >
            Add Product
          </button>
          {message && <p className='mt-4 text-red-700'>{message}</p>}
        </form>
      </section>
      <Footer />
    </>
  );
};
