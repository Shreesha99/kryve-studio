"use client";

import {
  useContext,
  createContext,
  type ReactNode,
} from "react";
import type { Auth } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

export interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export interface FirebaseProviderProps {
  children: ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: FirebaseProviderProps) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().firestore;
}
