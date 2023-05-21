'use client';
import React, { useEffect, useState } from 'react';
import Modal from './modal';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc,
  doc,
  arrayUnion,
} from 'firebase/firestore';
import { MdContentCopy } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const Sidenav = ({ rooms, getRooms, type }) => {
  const [open, setOpen] = useState(false);
  const [room_id, setRoomId] = useState('Loading...');
  const [user] = useAuthState(auth);
  const router = useRouter();

  // const getRooms = async () => {
  //   const querySnapshot = await getDocs(collection(db, 'rooms'));
  //   setRooms(querySnapshot.docs.map((doc) => doc.data()));
  // };

  useEffect(() => {
    getRooms();
  }, []);

  const joinRoom = async (e) => {
    e.preventDefault();
    const roomId = prompt('Enter Room ID');
    if (!roomId) {
      toast.error('Please enter a room id!');
      return;
    }
    try {
      // Check if the room exists
      const roomRef = doc(db, 'rooms', roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        toast.error('Room does not exist!');
        return;
      }

      // Update the user's room array
      const userDocRef = doc(db, 'users', user.email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Update existing user document
        const userRooms = userDocSnapshot.data().rooms || [];
        const updatedRooms = [...userRooms, roomId];

        await updateDoc(userDocRef, { rooms: updatedRooms });
        console.log('User rooms updated successfully!');
      } else {
        // Create new user document
        await setDoc(userDocRef, { rooms: [roomId] });
        console.log('New user document created successfully!');
      }

      // Update the room's participants array
      await updateDoc(roomRef, {
        participants: arrayUnion(user.email),
      });

      toast.success('Room joined successfully!');
    } catch (error) {
      console.error('Error joining the room:', error);
      toast.error('Error joining the room!');
    }
  };

  const sendDm = async (e) => {
    e.preventDefault();
    const email = prompt('Enter email of the user you want to DM');
    if (!email) {
      toast.error('Please enter an email!');
      return;
    }

    if (email === user.email) {
      toast.error('You cannot DM yourself!');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        toast.error('User does not exist!');
        return;
      }

      // check if user has the email in dmEmails array
      const dmEmails = userDocSnapshot.data().dmEmails;
      if (dmEmails.includes(user.email)) {
        toast.error('You already have a DM with this user!');
        return;
      }

      const dmRef = await addDoc(collection(db, 'direct_messages'), {
        participants: [user.email, email],
        name: email.split('@')[0],
      });

      const dmId = dmRef.id;

      await updateDoc(dmRef, { room_id: dmId });

      const dmUserDocRef = doc(db, 'users', email);
      await updateDoc(dmUserDocRef, {
        dms: arrayUnion(dmId),
        dmEmails: arrayUnion(user.email),
      });

      const currentUserDocRef = doc(db, 'users', user.email);
      await updateDoc(currentUserDocRef, {
        dms: arrayUnion(dmId),
        dmEmails: arrayUnion(email),
      });

      toast.success('Direct message created successfully!');
    } catch (error) {
      console.error('Error sending DM:', error);
      toast.error('Error sending DM!');
    }
  };

  const createRoom = async () => {
    const docRef = await addDoc(collection(db, 'rooms'), {
      name: user.displayName.split(' ')[0] + "'s Room",
      created_at: serverTimestamp(),
      creator: user.email,
      participants: [user.email],
    });

    //update docRef adding room_id which is docRef.id
    await updateDoc(docRef, { room_id: docRef.id });

    setRoomId(docRef.id);

    const roomId = docRef.id;

    const userDocRef = doc(db, 'users', user.email);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // Update existing user document
      const userRooms = userDocSnapshot.data().rooms || [];
      const updatedRooms = [...userRooms, roomId];

      await updateDoc(userDocRef, { rooms: updatedRooms });
      console.log('User rooms updated successfully!');
    } else {
      // Create new user document
      await setDoc(userDocRef, { rooms: [roomId] });
      console.log('New user document created successfully!');
    }

    getRooms();
  };

  const handleRoomClick = async (e, room_id) => {
    e.preventDefault();
    router.push(`/${type}/${room_id}`);
  };

  return (
    <>
      <Modal open={open} setOpen={setOpen} room_id={room_id} />
      <div
        className="
      flex flex-col
      w-64
      h-full
      overflow-hidden
     "
      >
        {type === 'rooms' ? (
          <div className="flex gap-2 px-2 py-4 justify-around">
            <button
              type="button"
              onClick={() => {
                void createRoom({ room_id });
                setOpen(true);
              }}
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center px-6 py-2"
            >
              Create Room
            </button>
            <button
              type="button"
              onClick={joinRoom}
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center px-6 py-2"
            >
              Join Room
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={sendDm}
            className="text-white bg-gradient-to-r from-purple-500 my-2 mx-2 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm text-center px-6 py-2"
          >
            Create New DM
          </button>
        )}
        <div className="flex flex-col px-2 flex-1 py-3 h-5/6 sidenav overflow-y-auto">
          {rooms && rooms.length > 0 ? (
            <>
              {rooms.map((room, key) => {
                return (
                  <div
                    className="text-white py-2 flex gap-x-4 items-center cursor-pointer"
                    key={room.room_id}
                    onClick={(e) => handleRoomClick(e, room.room_id)}
                  >
                    <div className="rounded-full h-10 w-10 overflow-hidden object-contain">
                      <img
                        className="h-full w-full object-cover"
                        height={500}
                        width={500}
                        src={`https://avatars.dicebear.com/api/initials/${room.creator}.svg`}
                      />
                    </div>
                    <div className="flex flex-col text-sm font-Rubik font-semibold justify-center items-start">
                      <div>
                        {type == 'direct'
                          ? room.participants
                              .filter(
                                (participant) => participant !== user.email
                              )[0]
                              .split('@')[0]
                          : room.name}
                      </div>
                      <div className="text-gray-400 flex justify-center items-center gap-2 text-xs">
                        {room.id}
                        <span
                          onClick={() => {
                            navigator.clipboard.writeText(room.id);
                            toast.success('Copied to clipboard!');
                          }}
                        >
                          <MdContentCopy />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Sidenav;
