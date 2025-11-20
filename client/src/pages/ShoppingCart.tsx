import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartProduct from '../components/CartProduct.tsx';
import {AppDispatch, RootState} from '../store';
import { CartProduct as CartProductType, CartState } from '../types/index';
import React from "react";
import {getCartItemKey} from "../helpers/idModifier.ts";
import {clearCart} from "../store/cart-slice.ts";

const ShoppingCart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart as CartState);
  const navigate = useNavigate();

  const continueShoppingClickHandler = (): void => {
    navigate('/', { replace: true });
  };

  const handleCheckout = (): void => {
    if (cart.totalPrice > 0 && cart.products.length > 0) {
      navigate('/checkout');
    }
  };

  const handleClear = (): void => {
    if(cart.products) {
      dispatch(clearCart(cart.products));
    }
  }
  return (
    <>
      <section className='px-8 py-4 xs:px-3'>
        <h1 className='uppercase mt-4 mb-8 text-4xl text-center'>your bag</h1>
        <div className='grid sm:grid-cols-3 gap-4 sm:gap-2 md:gap-6 lg:gap-8'>
          <div>
            <a
              onClick={continueShoppingClickHandler}
              className='text-sm lg:text-md cursor-pointer uppercase block p-4 border-2 border-black hover:bg-black hover:text-white transition ease-out duration-500'
            >
              continue shopping
            </a>
          </div>
          <div className='flex'>
            <p className='mr-4 cursor-pointer'>
              Shopping Bag ({cart.totalQuantity})
            </p>
          </div>
          <div className='flex'>
            <button
              onClick={handleCheckout}
              disabled={cart.totalPrice <= 0 || cart.products.length === 0}
              className='text-sm lg:text-md lg:w-1/2 cursor-pointer uppercase block p-4 border-2 hover:text-black hover:border-black hover:bg-white bg-black text-white transition ease-out duration-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              Checkout Now
            </button>
            <button
              onClick={handleClear}
              disabled={cart.totalPrice <= 0 || cart.products.length === 0}
              className='text-sm lg:text-md lg:w-1/2 cursor-pointer uppercase block p-4 border-2 hover:text-teal-900 hover:border-teal-900 hover:bg-white bg-teal-900 text-white transition ease-out duration-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              Clear cart
            </button>
          </div>
        </div>
        <div className='my-12 grid gap-8 lg:grid-cols-[2fr_1fr]'>
          <div>
            {cart.products.length > 0 ? (
              cart.products.map((product: CartProductType) => (
                <div key={getCartItemKey(product)}>
                  <CartProduct product={product}/>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-600 py-8'>Your cart is empty</p>
            )}
          </div>
          <div>
            <div className='border rounded-xl p-4'>
              <h1 className='uppercase text-4xl mb-8'>order summary</h1>
              <div className='flex justify-between mb-8'>
                <span className='capitalize'>subtotal</span>
                <span>$ {cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className='flex justify-between mb-8'>
                <span className='capitalize'>estimated shipping</span>
                <span>$ 00.00</span>
              </div>
              <div className='flex justify-between mb-8'>
                <span className='capitalize'>shipping discount</span>
                <span>-$ 00.00</span>
              </div>
              <div className='flex justify-between mb-8'>
                <span className='capitalize font-bold text-2xl'>Total</span>
                <span className='font-bold text-2xl'>$ {cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShoppingCart;
