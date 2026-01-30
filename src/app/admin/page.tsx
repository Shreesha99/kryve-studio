'use client';

import { useUser } from '@/firebase';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { Header } from '@/components/common/header';
import { FirebaseLoginForm } from '@/components/admin/firebase-login-form';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-24">
          <FirebaseLoginForm />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-24">
        <AdminDashboard />
      </main>
    </div>
  );
}
