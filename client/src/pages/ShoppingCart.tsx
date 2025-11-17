import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartProduct from '../components/CartProduct.tsx';
import { RootState } from '../store';
import React from "react";

interface CartProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

interface CartState {
  products: CartProduct[];
  totalPrice: number;
  totalQuantity: number;
}

const ShoppingCart: React.FC = () => {
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

  return (
    <>
      <section className='px-8 py-4'>
        <h1 className='uppercase mt-4 mb-8 text-4xl text-center'>your bag</h1>
        <div className='grid sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
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
            {/* <a className='underline cursor-pointer'>Your Wishlist (0)</a> */}
          </div>
          <div>
            <button
              onClick={handleCheckout}
              disabled={cart.totalPrice <= 0 || cart.products.length === 0}
              className='text-sm lg:text-md cursor-pointer uppercase block p-4 border-2 hover:text-black hover:border-black hover:bg-white bg-black text-white transition ease-out duration-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              Checkout Now
            </button>
          </div>
        </div>
        <div className='my-12 grid gap-8 lg:grid-cols-[2fr_1fr]'>
          <div>
            {cart.products.map((product: CartProduct, index) => (
              <div key={index}>
                <CartProduct product={product} />
              </div>
            ))}
          </div>
          <div>
            <div className='border rounded-xl p-4'>
              <h1 className='uppercase text-4xl mb-8'>order summary</h1>
              <div className='flex justify-between mb-8'>
                <span className='capitalize'>subtotal</span>
                <span>$ {cart.totalPrice}</span>
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
                <span className='font-bold text-2xl'>$ {cart.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShoppingCart;
