import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Add, Remove } from '@mui/icons-material';
import { useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { publicRequest } from '../request-methods.ts';
import { addProduct } from '../store/cart-slice.ts';
import { AppDispatch } from '../store';

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  size?: string[];
  color?: string[];
  categories?: string[];
  inStock?: boolean;
}

const SingleProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [uiState, setUiState] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const placeholderImage = 'https://via.placeholder.com/500?text=No+Image';

  const loadProduct = useCallback(async () => {
    if (!id) {
      setErrorMessage('Product ID not found');
      setUiState('error');
      return;
    }

    try {
      setUiState('loading');
      setErrorMessage(null);

      const response = await publicRequest<Product>(`/products/${id}`);

      if (!response?._id) {
        throw new Error('Invalid product data');
      }

      setProduct(response);

      if (response.size?.length) {
        setSelectedSize(response.size[0]);
      }

      setUiState('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load product';
      setErrorMessage(msg);
      setUiState('error');
      setProduct(null);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  }, []);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    if (product.size?.length && !selectedSize) {
      alert('Please select a size');
      return;
    }

    dispatch(
      addProduct({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
        size: selectedSize || 'One Size',
      })
    );

    alert('Added to cart!');
    setQuantity(1);
  }, [product, selectedSize, quantity, dispatch]);

  const handleRetry = useCallback(() => {
    loadProduct();
  }, [loadProduct]);

  const hasMultipleSizes = useMemo(() => product?.size?.length ?? 0 > 0, [product?.size]);
  const hasColors = useMemo(() => product?.color?.length ?? 0 > 0, [product?.color]);
  const isInStock = useMemo(() => product?.inStock !== false, [product?.inStock]);

  if (uiState === 'loading') {
    return (
      <section className='p-8 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4' />
          <p className='text-gray-600'>Loading product...</p>
        </div>
      </section>
    );
  }

  if (uiState === 'error') {
    return (
      <section className='p-8 min-h-screen flex items-center justify-center'>
        <div className='max-w-md w-full bg-red-50 border-2 border-red-300 rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-red-700 mb-3'>Error Loading Product</h2>
          <p className='text-red-600 mb-4'>{errorMessage}</p>
          <div className='flex gap-2'>
            <button
              onClick={handleRetry}
              className='flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition'
            >
              Try Again
            </button>
            <a
              href='/'
              className='flex-1 bg-gray-600 text-white py-2 px-4 rounded text-center hover:bg-gray-700 transition'
            >
              Home
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className='p-8 min-h-screen flex items-center justify-center'>
        <div className='max-w-md w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-gray-700 mb-3'>Product Not Found</h2>
          <p className='text-gray-600 mb-4'>We couldn't find the product you're looking for.</p>
          <a href='/' className='inline-block w-full bg-teal-700 text-white py-2 px-4 rounded text-center hover:bg-teal-800 transition'>
            Back to Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className='p-8 grid md:grid-cols-2 gap-8'>
      <div className='flex justify-center items-center'>
        <img
          src={product.image || placeholderImage}
          alt={product.title}
          className='w-full h-auto max-h-[500px] object-cover rounded'
          onError={(e) => {
            (e.target as HTMLImageElement).src = placeholderImage;
          }}
          loading='lazy'
          decoding='async'
        />
      </div>

      <div>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>{product.title}</h1>
        <p className='text-gray-600 text-lg mb-6'>{product.description}</p>

        <div className='mb-6'>
          <span className='text-3xl md:text-4xl font-bold text-teal-700'>
            ${product.price}
          </span>
          {!isInStock && (
            <p className='mt-2 font-semibold text-red-600'>Out of Stock</p>
          )}
        </div>

        {hasMultipleSizes ? (
          <div className='mb-6'>
            <label htmlFor='size-select' className='block text-lg font-semibold mb-2'>
              Select Size
            </label>
            <select
              id='size-select'
              onChange={handleSizeChange}
              value={selectedSize}
              className='w-[6rem] border border-gray-300 rounded-lg focus:outline-none focus:border-teal-700 m-0 p-3'
            >
              <option value=''>Choose a size</option>
              {product.size?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        ): null}

        <div className='grid sm:grid-cols-2 gap-4 mb-6'>
          <div className='flex items-center justify-start gap-2 border border-gray-300 rounded-lg p-2'>
            <button
              onClick={() => handleQuantityChange(-1)}
              className='p-2 hover:bg-gray-100 rounded transition'
              disabled={quantity <= 1}
              aria-label='Decrease quantity'
            >
              <Remove />
            </button>
            <span className='flex-1 text-center font-semibold text-lg'>{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className='p-2 hover:bg-gray-100 rounded transition'
              aria-label='Increase quantity'
            >
              <Add />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className='uppercase bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition ease-out duration-500 rounded p-4 font-semibold'
            aria-label={`Add ${quantity} item(s) to cart`}
          >
            Add to Cart
          </button>
        </div>

        {hasColors ? (
          <div className='mt-6'>
            <p className='font-semibold mb-2'>Available Colors:</p>
            <div className='flex gap-2 flex-wrap'>
              {product.color?.map((color) => (
                <span
                  key={color}
                  className='px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm'
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        ): null}
      </div>
    </section>
  );
};

export default React.memo(SingleProduct);
