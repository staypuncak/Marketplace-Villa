'use client'

export function LocationFilter({
  locations,
  selectedLocation,
  search,
  capacity,
}: {
  locations: string[]
  selectedLocation?: string
  search?: string
  capacity?: string
}) {
  return (
    <form method="GET">
      <input type="hidden" name="q" value={search ?? ''} />
      <input type="hidden" name="capacity" value={capacity ?? ''} />
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
