import React, {useEffect, useRef} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Announcement from './layout/Announcement.tsx';
import Navbar from './layout/Navbar.tsx';
import Newsletter from './layout/Newsletter.tsx';
import Footer from './layout/Footer.tsx';
import Chat from "./components/Chat.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./store";
import {clearCartOnLogout, setCartUserId} from "./store/cart-slice.ts";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const prevUserRef = useRef<typeof currentUser>(currentUser);
  const prevAuthRef = useRef<boolean>(!!currentUser);
  useEffect(() => {
    if (prevUserRef.current && !currentUser) {
      console.log('Logged out');
      dispatch(clearCartOnLogout());
      navigate('/', { replace: true });
    }
    prevUserRef.current = currentUser;
  }, [currentUser, navigate, dispatch]);

  useEffect(() => {
    if (currentUser && !prevAuthRef.current) {
      console.log('Logged in:', currentUser._id);
      dispatch(setCartUserId(currentUser._id));
    }
    prevAuthRef.current = !!currentUser;
  }, [currentUser, dispatch]);

    return (
        <>
          {
            currentUser?.isAdmin ?
              <>
                <Navbar />
                {currentUser && <Chat/>}
                <main className='bg-gray-100'>
                  <Outlet />
                </main>
              </>
              :
              <>
                <Announcement />
                <Navbar />
                {currentUser && <Chat/>}
                <main className='bg-gray-100'>
                  <Outlet />
                </main>
                <Newsletter />
                <Footer />
              </>
          }
        </>
    );
};

