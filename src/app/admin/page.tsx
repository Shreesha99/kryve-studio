import { getSession } from '@/lib/auth';
import { LoginForm } from '@/components/admin/login-form';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';


export default async function AdminPage() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-24">
            <LoginForm />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-24">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
}
