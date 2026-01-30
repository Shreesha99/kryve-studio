import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { AnimatedGradient } from "../common/animated-gradient";

function FeaturedPostCardSkeleton() {
  return (
    <Card className="overflow-hidden md:grid md:grid-cols-2 md:items-center">
      <CardHeader className="p-0 h-80 md:h-full">
        <Skeleton className="h-full w-full" />
      </CardHeader>
      <div className="p-8 md:p-12">
        <CardContent className="p-0">
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-5/6 mb-6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full mt-2" />
          <Skeleton className="h-5 w-4/6 mt-2" />
        </CardContent>
        <CardFooter className="p-0 pt-8">
           <Skeleton className="h-10 w-32" />
        </CardFooter>
      </div>
    </Card>
  )
}

function PostCardSkeleton() {
    return (
        <Card className="flex h-full flex-col overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="aspect-video w-full" />
            </CardHeader>
            <CardContent className="flex-grow p-6 space-y-3">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-6 pt-0">
                 <Skeleton className="h-4 w-1/2" />
            </CardFooter>
        </Card>
    )
}


export function BlogPageSkeleton() {
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <AnimatedGradient className="opacity-20 dark:opacity-10" />
            <Header />
            <main className="relative z-10 flex-1">
                <section className="container mx-auto max-w-7xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-48">
                <div className="space-y-4 text-center mb-16">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                </div>

                <div className="animate-pulse space-y-16">
                    <FeaturedPostCardSkeleton />

                    <div className="space-y-8">
                      <Skeleton className="h-8 w-1/4 mt-16" />
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                          <PostCardSkeleton />
                          <PostCardSkeleton />
                          <PostCardSkeleton />
                      </div>
                    </div>
                </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
