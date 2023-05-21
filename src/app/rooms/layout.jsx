'use client';
import Sidenav from '@/components/sidenav';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const Layout = ({ children }) => {
  const [user] = useAuthState(auth);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // useCallback(() => {
  //   const getRooms = async () => {
  //     const querySnapshot = await getDocs(collection(db, 'rooms'));
  //     setRooms(querySnapshot.docs.map((doc) => doc.data()));
  //   };
  // }, []);
  const getRooms = useCallback(async () => {
    try {
      const userDocRef = doc(db, 'users', user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userRooms = userData.rooms || [];

        const roomPromises = userRooms.map(async (roomId) => {
          const roomDocRef = doc(db, 'rooms', roomId);
          const roomDocSnapshot = await getDoc(roomDocRef);

          if (roomDocSnapshot.exists()) {
            return { id: roomId, ...roomDocSnapshot.data() };
          } else {
            console.log(`Room document not found for ID: ${roomId}`);
            return null;
          }
        });

        const roomDocs = await Promise.all(roomPromises);
        const userRoomsData = roomDocs.filter((room) => room !== null);
        setRooms(userRoomsData); // Set the fetched rooms to the rooms state
      } else {
        toast.error('User does not exist!');
      }
    } catch (error) {
      console.error('Error retrieving user rooms:', error);
      return [];
    }
  }, []);

  console.log(rooms);

  useEffect(() => {
    if (!user) {
      void router.push('/');
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading)
    return (
      <h1 className="mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-gray-900 w-full h-full flex-1 overflow-y-hidden  flex justify-center items-center md:text-5xl lg:text-6xl">
        Loading...
      </h1>
    );

  return (
    <div className="flex flex-1 overflow-y-hidden">
      <Sidenav rooms={rooms} getRooms={getRooms} type="rooms" />
      <div className="flex flex-col w-full h-full flex-1 overflow-y-hidden">
        <div className="container h-full mx-auto bg-gray-800 shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
