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
  // Ensure date is always a string. Handle Timestamps and string dates.
  let date;
  if (data.date instanceof Timestamp) {
    date = data.date.toDate().toISOString();
  } else if (typeof data.date === 'string') {
    date = data.date;
  } else if (data.date && typeof data.date.seconds === 'number') {
    // Handle serialized Timestamps
    date = new Timestamp(data.date.seconds, data.date.nanoseconds).toDate().toISOString();
  } else {
    // Fallback for unexpected formats
    date = new Date().toISOString();
  }

  return {
    id: doc.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    date: date,
    imageUrl: data.imageUrl,
    imageHint: data.imageHint,
  } as Post;
};


let cachedPosts: Post[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

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
  const postsCollection = collection(firestore, 'blog_posts');
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
  const postsCollection = collection(firestore, 'blog_posts');
  const q = query(postsCollection, where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return postFromDoc(querySnapshot.docs[0]);
}
