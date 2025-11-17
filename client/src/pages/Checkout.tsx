import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { userRequest } from '../request-methods.ts';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar.tsx';
import Announcement from '../layout/Announcement.tsx';
import Footer from '../layout/Footer.tsx';
import {RootState} from "../store";
import {cardElementOptions} from "../helpers/cardInfo.ts";

interface PaymentIntentResponse{
  clientSecret: string;
}

interface CartProduct{
  _id: string
  title: string
  price: number
  quantity: number
}

interface CartState {
  products: CartProduct[]
  totalPrice: number
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51LbSFeDby8a9HLcBzbuGETbDJiWZkCbNQx3gSpAfRZIKSrvsKakFGjvkNPTvzuHNNXKDYojDjdk3XhLlTajrQmeZ00JSyq9AOO');

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const cart = useSelector((store: RootState) => store.cart as CartState);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    const createPaymentIntent = async (): Promise<void> => {
      try {
        const response = await userRequest.post<PaymentIntentResponse>('/checkout/payment-intent', {
          amount: Math.round(cart.totalPrice * 100),
          currency: 'usd',
        });
        setClientSecret(response.data.clientSecret);
      } catch (err: unknown) {
        const errorMessage =
            (err as any).response?.data?.error ||
            (err as Error).message ||
            'Failed to initialize payment';
        setError(errorMessage);
        console.error('Payment intent error:', err);
      }
    };
    if (cart.totalPrice > 0) {
      createPaymentIntent();
    }
  }, [cart.totalPrice]);

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Stripe is not ready. Please wait...');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
        setProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        navigate('/orders', { state: { paymentIntent } });
      }
    } catch (err) {
      const errorMessage =
          (err as Error).message ||
          'Payment failed. Please try again.';
      setError(errorMessage);
      setProcessing(false);
    }
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
            <div className="border rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6 uppercase">Payment Details</h2>

              <div className="space-y-6">
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
                    onClick={handleSubmit}
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
              </div>
            </div>

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

const Checkout: React.FC = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout
