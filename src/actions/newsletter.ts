'use server';

import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { z } from 'zod';

const emailSchema = z.string().email();

export async function unsubscribeFromNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const validation = emailSchema.safeParse(email);
  if (!validation.success) {
    return { success: false, message: 'Invalid email address provided.' };
  }

  const { firestore } = initializeFirebase();
  const subscribersCollection = collection(firestore, 'subscribers');
  
  try {
    const q = query(subscribersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // It's good practice not to reveal if an email exists or not.
      // We'll return success even if the email wasn't found.
      return { success: true, message: 'You have been unsubscribed.' };
    }

    // In a robust system, you'd handle this in a transaction.
    // For this app, deleting one by one is fine.
    const deletePromises = querySnapshot.docs.map(document => 
      deleteDoc(doc(firestore, 'subscribers', document.id))
    );
    await Promise.all(deletePromises);

    return { success: true, message: 'You have been successfully unsubscribed.' };
  } catch (error) {
    console.error('Error during unsubscription:', error);
    return { success: false, message: 'An error occurred. Please try again later.' };
  }
}
