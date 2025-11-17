import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login.tsx';
import {AdminPanel} from "./pages/AdminPanel.js";
import {SignUp} from "./pages/SignUp.tsx";
import {Layout} from "./layout.tsx";
import {LoadingFallback} from "./pages/LoadingFallback.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const Home = React.lazy(() => import('./pages/Home.js'));
const Cart = React.lazy(() => import('./pages/ShoppingCart.tsx'));
const Checkout = React.lazy(() => import('./pages/Checkout.tsx'));
const Orders = React.lazy(() => import('./pages/Orders.jsx'));
const ShoppingCategory = React.lazy(() => import('./pages/ShoppingCategory.tsx'));

const Suspense: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <React.Suspense fallback={<LoadingFallback />}>{children}</React.Suspense>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Suspense>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/categories/:category"
            element={
              <Suspense>
                <ShoppingCategory />
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense>
                <Cart />
              </Suspense>
            }
          />
          <Route
            path="/checkout"
            element={
              <React.Suspense >
                <Checkout />
              </React.Suspense>
            }
          />
          <Route
            path="/orders"
            element={
              <React.Suspense>
                <Orders />
              </React.Suspense>
            }
          />
          <Route
            path="/adminpanel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
