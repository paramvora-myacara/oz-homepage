const LIFECYCLE_SORT_ORDER: Record<string, number> = {
  in_review: 0,
  draft: 1,
  live: 2,
}

export function sortDashboardListings<
  T extends { lifecycle_status: string; created_at?: string | null }
>(listings: T[]): T[] {
  return [...listings].sort((a, b) => {
    const orderA = LIFECYCLE_SORT_ORDER[a.lifecycle_status] ?? 99
    const orderB = LIFECYCLE_SORT_ORDER[b.lifecycle_status] ?? 99
    if (orderA !== orderB) return orderA - orderB

    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
    return timeB - timeA
  })
}
