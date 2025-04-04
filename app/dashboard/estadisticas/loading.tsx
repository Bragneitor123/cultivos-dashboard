import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4">
            <CardTitle className="text-lg">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4">
            <CardTitle className="text-lg">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4">
            <CardTitle className="text-lg">
              <Skeleton className="h-6 w-64" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full max-w-2xl mx-auto">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

