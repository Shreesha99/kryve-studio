import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  isLoggedIn?: boolean;
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'elysium-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// This function must be called from a server component or action
export async function getSession(): Promise<IronSession<SessionData>> {
  if (!process.env.SECRET_COOKIE_PASSWORD || process.env.SECRET_COOKIE_PASSWORD.length < 32) {
    throw new Error('SECRET_COOKIE_PASSWORD environment variable must be set and be at least 32 characters long.');
  }
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
