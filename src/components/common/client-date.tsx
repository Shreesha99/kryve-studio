'use client';

import { useState, useEffect } from 'react';

export function ClientDate() {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    // This code runs only on the client, after hydration.
    setDateString(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // Return a placeholder or null during server-rendering and initial client-render
  if (!dateString) {
    // Returning a placeholder prevents layout shift
    return <span className="inline-block h-4 w-40 animate-pulse rounded-md bg-muted" />;
  }

  return <>{dateString}</>;
}
