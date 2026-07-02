import { Users, Bed, Bath, MapPin } from 'lucide-react'

type VillaOverviewProps = {
  capacity: number
  location: string
}

function formatLocation(location: string) {
  const parts = location.split(',').map((s) => s.trim())
  if (parts.length === 2) {
    return (
      <>
        {parts[0]}
        <br />
        {parts[1]} Bogor
      </>
    )
  }
  return location
}

export function VillaOverview({ capacity, location }: VillaOverviewProps) {
  const items = [
    { icon: Users, label: 'Kapasitas Maksimal', value: `${capacity} Tamu` },
    { icon: Bed, label: 'Kamar Tidur', value: '3 Kamar' },
    { icon: Bath, label: 'Kamar Mandi', value: '2 Kamar Mandi' },
    { icon: MapPin, label: 'Lokasi', value: formatLocation(location) },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-emerald-100/50 bg-white/95 p-5 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Icon className="size-6 text-amber-400" />
            <p className="text-lg font-bold tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        )
      })}
    </div>
  )
}
