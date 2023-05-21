'use client';
import React, { useEffect } from 'react';
import GoogleSignin from '@/assets/gsignin.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const Welcome = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  console.log('RERENDER TEST HOMEPAGE');

  useEffect(() => {
    if (user) {
      router.push('/rooms');
    }
  }, [user]);

  return (
    <main className="welcome">
      <h2 className="text-4xl font-bold text-center my-8 text-blue-500">
        Welcome to Say-It Live Chat.
      </h2>
      <p className="text-2xl font-bold text-center text-blue-500">
        Sign in with Google to chat with with your fellow mates.
      </p>
      <button className="border-0 w-full flex justify-center items-center bg-transparent">
        <img
          className="w-auto h-8 mx-auto my-4"
          onClick={googleSignIn}
          src={GoogleSignin.src}
          alt="sign in with google"
          type="button"
        />
      </button>
    </main>
  );
};

export default Welcome;
