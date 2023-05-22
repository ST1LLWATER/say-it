'use client';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const Home = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    createUserIfNotExists();
  }, []);

  // Function to create a user document if it does not already exist
  const createUserIfNotExists = async () => {
    // Get the reference to the user document in Firestore
    const userDocRef = doc(db, 'users', user.email);

    // Get the snapshot of the user document
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      // Create a new user document with rooms and dms arrays
      await setDoc(userDocRef, { rooms: [], dms: [], dmEmails: [] });
      console.log('New user document created successfully!');
    }
  };

  return (
    <div className="flex justify-center h-full items-center">
      <h1 className="mb-4 text-3xl font-extrabold text-center text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
        <span className="text-transparent w-full text-center bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Join A Room Or Create One!
        </span>
      </h1>
    </div>
  );
};

export default Home;
