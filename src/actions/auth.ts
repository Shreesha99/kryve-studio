'use server';

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(password: string): Promise<{ error?: string }> {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is not set.');
  }
  if (password === process.env.ADMIN_PASSWORD) {
    const session = await getSession();
    session.isLoggedIn = true;
    await session.save();
    revalidatePath('/admin');
    redirect('/admin');
  }
  return { error: 'Invalid password.' };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  revalidatePath('/admin');
  redirect('/admin');
}
