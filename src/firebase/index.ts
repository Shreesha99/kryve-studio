'use client';

// The actual implementation of initializeFirebase has been moved to `init.ts`
// to allow it to be used in server-side contexts without violating the
// 'use client' module boundary. We re-export it here to ensure client-side
// code that imports from this file continues to work as expected.
export { initializeFirebase, getSdks } from './init';

// The rest of these exports are for client-side components and hooks.
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
