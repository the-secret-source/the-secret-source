import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ArtistCardSkeleton() {
  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="items-center">
        <Skeleton className="h-8 w-48 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-3 text-center">
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-5/6 mx-auto rounded-md" />
        <Skeleton className="h-5 w-3/4 mx-auto rounded-md" />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <Skeleton className="h-10 w-44 rounded-md" />
      </CardFooter>
    </Card>
  )
}
