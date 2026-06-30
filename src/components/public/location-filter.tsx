'use client'

export function LocationFilter({
  locations,
  selectedLocation,
  search,
  capacity,
  sort,
}: {
  locations: string[]
  selectedLocation?: string
  search?: string
  capacity?: string
  sort?: string
}) {
  return (
    <form method="GET" action="/#villa-discovery">
      <input type="hidden" name="q" value={search ?? ''} />
      <input type="hidden" name="capacity" value={capacity ?? ''} />
      <input type="hidden" name="sort" value={sort ?? ''} />
      <select
        name="location"
        defaultValue={selectedLocation ?? ''}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 sm:w-auto"
      >
        <option value="">Semua Lokasi</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </form>
  )
}
