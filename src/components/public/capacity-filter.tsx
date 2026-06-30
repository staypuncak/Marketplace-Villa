'use client'

const CAPACITY_OPTIONS = [
  { value: '', label: 'Min Kapasitas' },
  { value: '1', label: '1+ Tamu' },
  { value: '4', label: '4+ Tamu' },
  { value: '6', label: '6+ Tamu' },
  { value: '8', label: '8+ Tamu' },
  { value: '10', label: '10+ Tamu' },
  { value: '16', label: '16+ Tamu' },
  { value: '25', label: '25+ Tamu' },
]

export function CapacityFilter({
  selectedCapacity,
  search,
  location,
  sort,
}: {
  selectedCapacity?: string
  search?: string
  location?: string
  sort?: string
}) {
  return (
    <form method="GET" action="/#villa-discovery">
      <input type="hidden" name="q" value={search ?? ''} />
      <input type="hidden" name="location" value={location ?? ''} />
      <input type="hidden" name="sort" value={sort ?? ''} />
      <select
        name="capacity"
        defaultValue={selectedCapacity ?? ''}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 sm:w-auto"
      >
        {CAPACITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  )
}
