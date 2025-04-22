import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonLoaderProps {
  type: "trade" | "history" | "finance" | "profile" | "copytrader"
  count?: number
}

export function SkeletonLoader({ type, count = 3 }: SkeletonLoaderProps) {
  const renderTradeLoader = () => (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  )

  const renderHistoryLoader = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )

  const renderFinanceLoader = () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <Skeleton className="h-[200px] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )

  const renderProfileLoader = () => (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="w-full md:w-2/3 space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )

  const renderCopytraderLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )

  switch (type) {
    case "trade":
      return renderTradeLoader()
    case "history":
      return renderHistoryLoader()
    case "finance":
      return renderFinanceLoader()
    case "profile":
      return renderProfileLoader()
    case "copytrader":
      return renderCopytraderLoader()
    default:
      return null
  }
}
