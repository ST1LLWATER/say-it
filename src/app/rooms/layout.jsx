'use client';
import Sidenav from '@/components/sidenav';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';

const layout = ({ children }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      void router.push('/');
    } else {
      setLoading(false);
    }
  }, [user]);

  console.log(user);
  if (loading)
    return (
      <h1 className="mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-gray-900 w-full h-full flex-1 overflow-y-hidden  flex justify-center items-center md:text-5xl lg:text-6xl">
        Loading...
      </h1>
    );

  return (
    <div className="flex flex-1 overflow-y-hidden">
      <Sidenav />
      <div className="flex flex-col w-full h-full flex-1 overflow-y-hidden">
        <div className="container h-full mx-auto bg-gray-800 shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
