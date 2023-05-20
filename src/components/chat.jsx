'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  serverTimestamp,
  addDoc,
  collection,
  doc,
  withConverter,
} from 'firebase/firestore';
import { auth, db } from '@/firebase';

const Chat = ({ messages }) => {
  const [message, setMessage] = useState('');
  const params = useParams();
  const [user] = useAuthState(auth);

  const messageConverter = {
    toFirestore: (messageData) => {
      return {
        ...messageData,
        timestamp: serverTimestamp(),
      };
    },
  };

  const addMessageToRoom = async (roomId) => {
    const roomRef = doc(db, 'rooms', roomId);
    const messagesRef = collection(roomRef, 'messages').withConverter(
      messageConverter
    );

    const messageData = {
      sender: user.displayName,
      content: message,
    };

    await addDoc(messagesRef, messageData);

    setMessage('');
  };

  return (
    <div className="flex flex-col gap-x-4 h-full w-full p-4 justify-end">
      <div className="overflow-y-auto flex py-2 flex-col-reverse">
        {true &&
          messages.map((message, index) => {
            return (
              <div key={index} className="py-2 px-1">
                <div className="text-gray-600 text-sm">{message.sender}</div>
                <div className="text-md font-light font-Rubik">
                  {message.content}
                </div>
              </div>
            );
          })}
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void addMessageToRoom(params.id, message);
          }}
          className="flex gap-x-4 justify-center mt-4 items-center"
        >
          <div className="w-full">
            {/* <input
              type="text"
              id="text"
              name="text"
              value={message}
              placeholder="Send Message"
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
              className="w-full bg-white bg-opacity-50 rounded border border-gray-100 focus:border-rose-700 focus:ring-2 focus:ring-rose-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out"
            /> */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Send Message"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center px-6 py-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
