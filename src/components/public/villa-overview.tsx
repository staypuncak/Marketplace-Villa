import { Users, Bed, Bath, MapPin } from 'lucide-react'

type VillaOverviewProps = {
  capacity: number
  location: string
}

export function VillaOverview({ capacity, location }: VillaOverviewProps) {
  const items = [
    { icon: Users, label: 'Kapasitas', value: `Hingga ${capacity} Tamu` },
    { icon: Bed, label: 'Kamar Tidur', value: '3 Kamar' },
    { icon: Bath, label: 'Kamar Mandi', value: '2 Kamar Mandi' },
    { icon: MapPin, label: 'Lokasi', value: location },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 rounded-xl border bg-white/80 p-4 text-center shadow-sm backdrop-blur-sm"
          >
            <Icon className="size-5 text-amber-500" />
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
            <p className="text-sm font-semibold text-foreground">{item.value}</p>
          </div>
        )
      })}
    </div>
  )
}
