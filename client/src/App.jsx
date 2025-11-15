import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import ShoppingCategories from './pages/ShoppingCategory.jsx';
import SingleProduct from './pages/SingleProduct';
import ShoppingCart from './pages/ShoppingCart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Signup from './pages/Signup';
import Login from './pages/Login';
import {AdminPanel} from "./pages/AdminPanel.jsx";
import {publicRequest} from "./request-methods.js";
import store from "./store/index.js";
import {TestSignUp} from "./pages/TestSignUp.jsx";

const App = () => {
  const ProtectedAdminPanel = () => {
    const user = useSelector((store) => store.auth.currentUser);
    console.log('Current user in ProtectedAdminPanel:', user); // Для отладки
    return user && user.isAdmin ? <AdminPanel /> : <Navigate to="/" />;
  };
    return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/categories/:category' element={<ShoppingCategories/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<TestSignUp/>}/>
        <Route path='/categories/:category' element={<ShoppingCategories/>}/>
        <Route path='/products/:id' element={<SingleProduct/>}/>
        <Route path='/cart' element={<ShoppingCart/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/adminpanel' element={<ProtectedAdminPanel />} />
      </Routes>
        {/*<Route path='/categories/:category'>*/}
        {/*  <ShoppingCategories />*/}
        {/*</Route>*/}
        {/*<Route path='/products/:id'>*/}
        {/*  <SingleProduct />*/}
        {/*</Route>*/}
        {/*<Route path='/cart'>*/}
        {/*  <ShoppingCart />*/}
        {/*</Route>*/}
        {/*<Route path='/orders'>*/}
        {/*  <Orders />*/}
        {/*</Route>*/}
        {/*<Route path='/login'>{user ? <Redirect to='/' /> : <Login />}</Route>*/}
        {/*<Route path='/signup'>*/}
        {/*  <Signup />*/}
        {/*</Route>*/}
        {/*<Route path={'/adminpanel'}>*/}
        {/*  <AdminPanel/>*/}
        {/*</Route>*/}
    </Router>
  );
};

export default App;
