'use client';

import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // ISO string
  imageUrl: string;
  imageHint: string;
};

// Convert Firestore timestamp to a serializable format (ISO string)
const postFromDoc = (doc: any): Post => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date(data.date).toISOString(),
  } as Post;
};


export async function getPosts(): Promise<Post[]> {
  const { firestore } = initializeFirebase();
  const postsCollection = collection(firestore, 'posts');
  const q = query(postsCollection, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(postFromDoc);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { firestore } = initializeFirebase();
  const postsCollection = collection(firestore, 'posts');
  const q = query(postsCollection, where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return postFromDoc(querySnapshot.docs[0]);
}
