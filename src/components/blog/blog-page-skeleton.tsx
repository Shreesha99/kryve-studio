import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
    );
}
