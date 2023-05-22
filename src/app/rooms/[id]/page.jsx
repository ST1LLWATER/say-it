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
    // Get the room ID from the URL params
    const roomId = params.id;

    // Reference to the 'messages' collection within the specified room
    const roomMessagesRef = collection(db, 'rooms', roomId, 'messages');

    // Construct a query to retrieve the latest 50 messages ordered by timestamp
    const roomMessagesQuery = query(
      roomMessagesRef,
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    // Subscribe to the snapshot changes of the room's messages
    const unsubscribe = onSnapshot(roomMessagesQuery, (querySnapshot) => {
      // Process the query snapshot to get the message data
      const messageList = [];
      querySnapshot.forEach((doc) => {
        messageList.push({ ...doc.data(), id: doc.id });
      });
      // Update the state with the retrieved messages
      setMessages(messageList);
    });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Render the Chat component and pass the messages and type props */}
      <Chat messages={messages} type="room" />
    </>
  );
};

export default Room;
