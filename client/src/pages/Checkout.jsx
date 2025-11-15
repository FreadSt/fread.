import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { userRequest } from '../request-methods';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Announcement from '../layout/Announcement';
import Footer from '../layout/Footer';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51LbSFeDby8a9HLcBzbuGETbDJiWZkCbNQx3gSpAfRZIKSrvsKakFGjvkNPTvzuHNNXKDYojDjdk3XhLlTajrQmeZ00JSyq9AOO');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const cart = useSelector((store) => store.cart);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await userRequest.post('/checkout/payment-intent', {
          amount: Math.round(cart.totalPrice * 100), // Amount in cents
          currency: 'usd',
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to initialize payment');
        console.error('Payment intent error:', err);
      }
    };

    if (cart.totalPrice > 0) {
      createPaymentIntent();
    }
  }, [cart.totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Stripe is not ready. Please wait...');
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // You can add billing details here if needed
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Payment succeeded - redirect to orders page
        navigate('/orders', { state: { paymentIntent } });
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      variables: {
        display: 'flex',
        flexDirection: 'column'
      },
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  if (!clientSecret) {
    return (
      <>
        <Announcement />
        <Navbar />
        <section className="px-8 py-12 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto mb-4"></div>
            <p className="text-lg">Initializing payment...</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Announcement />
      <Navbar />
      <section className="px-8 py-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center uppercase">Checkout</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="border rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 uppercase">Payment Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border rounded-lg p-4 bg-white">
                  <label className="block text-sm font-medium mb-2">Card Information</label>
                  <CardElement options={cardElementOptions}/>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!stripe || processing || !clientSecret}
                  className="w-full bg-teal-700 text-white py-4 px-6 rounded-lg font-semibold uppercase hover:bg-teal-800 transition ease-out duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : `Pay $${cart.totalPrice.toFixed(2)}`}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold uppercase hover:bg-gray-50 transition ease-out duration-300"
                >
                  Cancel
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="border rounded-xl p-6 h-fit">
              <h2 className="text-2xl font-semibold mb-6 uppercase">Order Summary</h2>

              <div className="space-y-4">
                {cart.products.map((product) => (
                  <div key={product._id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                    <p className="font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 pt-6 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Discount</span>
                  <span className="font-medium">-$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

// Wrap the component in Elements provider
const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;

