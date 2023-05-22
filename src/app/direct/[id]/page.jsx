'use client';
import Chat from '@/components/chat';
import React, { useEffect, useState } from 'react';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useParams } from 'next/navigation';

const Room = () => {
  const [messages, setMessages] = useState([]);
  const params = useParams();

  useEffect(() => {
    const roomId = params.id;
    const roomMessagesRef = collection(
      db,
      'direct_messages',
      roomId,
      'messages'
    );
    const roomMessagesQuery = query(
      roomMessagesRef,
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(roomMessagesQuery, (querySnapshot) => {
      const messageList = [];
      querySnapshot.forEach((doc) => {
        messageList.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messageList);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  console.log(messages);

  return (
    <>
      <Chat messages={messages} type="direct" />
    </>
  );
};

export default Room;
