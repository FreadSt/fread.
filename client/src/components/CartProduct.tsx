import React, {useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { removeProduct, updateProductQuantity } from '../store/cart-slice';
import { AppDispatch } from '../store';
import { CartProduct as CartProductType } from '../types/index';
import { Add, Remove, Delete } from '@mui/icons-material';
import {Link} from "react-router-dom";

interface Props {
  product: CartProductType;
}

const CartProduct: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemove = useCallback(() => {
    dispatch(removeProduct({ _id: product._id, size: product.size }));
  }, [product._id, product.size, dispatch]);

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity > 0) {
        dispatch(
          updateProductQuantity({
            _id: product._id,
            size: product.size,
            quantity: newQuantity,
          })
        );
      }
    },
    [product._id, product.size, dispatch]
  );


  console.log(product, 'product')

  return (
    <div className='border-b pb-6 mb-6'>
      <div className='grid grid-cols-4 gap-4 xs:gap-2 xs:grid-cols-4'>
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.title}
            className='w-full h-40 object-cover rounded'
          />
        </Link>

        <div className='col-span-2'>
          <h3 className='font-semibold text-lg mb-2'>{product.title}</h3>
          <p className='text-sm text-gray-600 mb-2'>Size: {product.size || 'One Size'}</p>
          <p className='text-sm text-gray-600 mb-4'>Price: ${product.price.toFixed(2)}</p>

          <div className='flex items-center gap-2 mb-4'>
            <button
              onClick={() => handleQuantityChange(product.quantity - 1)}
              className='p-1 hover:bg-gray-200 rounded'
              disabled={product.quantity <= 1}
            >
              <Remove fontSize='small' />
            </button>
            <span className='px-4 py-1 border rounded'>{product.quantity}</span>
            <button
              onClick={() => handleQuantityChange(product.quantity + 1)}
              className='p-1 hover:bg-gray-200 rounded'
            >
              <Add fontSize='small' />
            </button>
          </div>
        </div>

        <div className='flex flex-col items-end justify-between'>
          <p className='font-bold text-lg'>
            ${(product.price * product.quantity).toFixed(2)}
          </p>
          <button
            onClick={handleRemove}
            className='text-red-500 hover:text-red-700 transition'
          >
            <Delete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
