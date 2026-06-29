'use client'

export function PriceSort({
  selectedSort,
  search,
  location,
  capacity,
}: {
  selectedSort?: string
  search?: string
  location?: string
  capacity?: string
}) {
  return (
    <form method="GET">
      <input type="hidden" name="q" value={search ?? ''} />
      <input type="hidden" name="location" value={location ?? ''} />
      <input type="hidden" name="capacity" value={capacity ?? ''} />
      <select
        name="sort"
        defaultValue={selectedSort ?? ''}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 sm:w-auto"
      >
        <option value="">Default</option>
        <option value="price_asc">Termurah</option>
        <option value="price_desc">Termahal</option>
      </select>
    </form>
  )
}
