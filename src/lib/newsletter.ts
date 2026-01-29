'use client';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function addSubscriber(email: string) {
  const { firestore } = initializeFirebase();
  try {
    const subscribersCollection = collection(firestore, 'subscribers');
    await addDoc(subscribersCollection, {
      email: email,
      subscribedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding subscriber: ', error);
    throw new Error('Could not add subscriber to the database.');
  }
}
