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

let cachedPosts: Post[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export function invalidatePostsCache() {
  cachedPosts = null;
  lastFetchTime = null;
}

export async function getPosts(forceRefresh = false): Promise<Post[]> {
  const now = Date.now();
  if (!forceRefresh && cachedPosts && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
    return cachedPosts;
  }

  const { firestore } = initializeFirebase();
  const postsCollection = collection(firestore, 'posts');
  const q = query(postsCollection, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  const posts = querySnapshot.docs.map(postFromDoc);
  cachedPosts = posts;
  lastFetchTime = now;
  
  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Check cache first for faster individual post loading
  if (cachedPosts) {
    const cachedPost = cachedPosts.find(p => p.slug === slug);
    if (cachedPost) {
      return cachedPost;
    }
  }

  const { firestore } = initializeFirebase();
  const postsCollection = collection(firestore, 'posts');
  const q = query(postsCollection, where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return postFromDoc(querySnapshot.docs[0]);
}
