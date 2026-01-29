"use client";

import React, { ReactNode } from "react";
import {
  FirebaseProvider,
  useFirebase as useFirebaseClient,
} from "./provider";
import { initializeFirebase } from ".";

export const useFirebase = useFirebaseClient;

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, firestore } = initializeFirebase();
  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
