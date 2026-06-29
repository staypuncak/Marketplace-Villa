import { Search } from 'lucide-react'

export function SearchInput({
  defaultValue,
  selectedLocation,
  capacity,
}: {
  defaultValue?: string
  selectedLocation?: string
  capacity?: string
}) {
  return (
    <form method="GET" className="relative w-full sm:max-w-xs">
      <input type="hidden" name="location" value={selectedLocation ?? ''} />
      <input type="hidden" name="capacity" value={capacity ?? ''} />
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Cari villa..."
        className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50"
      />
    </form>
  )
}
