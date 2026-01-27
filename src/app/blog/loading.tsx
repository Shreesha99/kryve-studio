import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/30">
        <section className="container mx-auto max-w-7xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-48">
          <div className="space-y-4 text-center">
            <Skeleton className="mx-auto h-12 w-1/2" />
            <Skeleton className="mx-auto h-7 w-2/3" />
          </div>

          <div className="mt-16 space-y-16">
            {/* Featured Post Skeleton */}
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="mt-4 h-6 w-1/3" />
                </div>
            </div>

            {/* Other Posts Skeleton */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col space-y-4 rounded-lg border bg-card p-4">
                  <Skeleton className="aspect-video w-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="pt-2">
                      <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
