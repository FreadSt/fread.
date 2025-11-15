import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Announcement from '../layout/Announcement';
import Footer from '../layout/Footer';
import CartProduct from '../components/CartProduct';

const ShoppingCart = () => {
  const cart = useSelector((store) => store.cart);
  const navigate = useNavigate();

  const continueShoppingClickHandler = () => {
    navigate('/', { replace: true });
  };

  const handleCheckout = () => {
    if (cart.totalPrice > 0 && cart.products.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <>
      <Announcement />
      <Navbar />
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
              Shopping Bag ({cart.totalQantity})
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
            {cart.products.map((product) => (
              <CartProduct key={product._id} product={product} />
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
      <Footer />
    </>
  );
};

export default ShoppingCart;