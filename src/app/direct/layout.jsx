'use client';
import Sidenav from '@/components/sidenav';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

const layout = ({ children }) => {
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
    const querySnapshot = await getDocs(collection(db, 'direct'));
    setRooms(querySnapshot.docs.map((doc) => doc.data()));
  }, []);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.email);

    const unsubscribe = onSnapshot(userDocRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userDms = userData.dms || [];

        // Fetch the direct messages based on the IDs in userDms
        const directMessagesPromises = userDms.map(async (dmId) => {
          const dmDocRef = doc(db, 'direct_messages', dmId);
          const dmDocSnapshot = await getDoc(dmDocRef);
          if (dmDocSnapshot.exists()) {
            return { id: dmDocSnapshot.id, ...dmDocSnapshot.data() };
          }
        });

        const directMessages = await Promise.all(directMessagesPromises);
        // Filter out any undefined elements (if a DM document doesn't exist)
        const filteredDirectMessages = directMessages.filter(Boolean);

        // Update the state with the fetched direct messages
        setRooms(filteredDirectMessages);
      }
    });

    return () => unsubscribe();
  }, [user?.email]);

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
      <Sidenav rooms={rooms} getRooms={getRooms} type="direct" />
      <div className="flex flex-col w-full h-full flex-1 overflow-y-hidden">
        <div className="container h-full mx-auto bg-gray-800 shadow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
