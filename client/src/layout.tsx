import React from 'react';
import { Outlet } from 'react-router-dom';
import Announcement from './layout/Announcement.tsx';
import Navbar from './layout/Navbar.tsx';
import Newsletter from './layout/Newsletter.tsx';
import Footer from './layout/Footer.tsx';
import Chat from "./components/Chat.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./store";

export const Layout: React.FC = () => {
  const { currentUser } = useSelector(
    (state: RootState) => state.auth
  );
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

