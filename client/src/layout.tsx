import React from 'react';
import { Outlet } from 'react-router-dom';
import Announcement from './layout/Announcement.tsx';
import Navbar from './layout/Navbar.tsx';
import Newsletter from './layout/Newsletter.tsx';
import Footer from './layout/Footer.tsx';

export const Layout: React.FC = () => {
    return (
        <>
            <Announcement />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Newsletter />
            <Footer />
        </>
    );
};

