import { Users, PartyPopper, Building2, Cake } from 'lucide-react'

const suitabilityItems = [
  {
    icon: Users,
    title: 'Liburan Keluarga',
    description: 'Tempat luas dan nyaman untuk berkumpul bersama keluarga.',
  },
  {
    icon: PartyPopper,
    title: 'Gathering',
    description: 'Cocok untuk acara keluarga maupun komunitas.',
  },
  {
    icon: Building2,
    title: 'Company Outing',
    description: 'Suasana tenang untuk meeting santai dan team building.',
  },
  {
    icon: Cake,
    title: 'Acara Spesial',
    description: 'Ideal untuk ulang tahun, reuni, maupun perayaan lainnya.',
  },
]

export function VillaSuitability() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Sangat Cocok Untuk
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Villa ini ideal untuk berbagai kebutuhan berikut.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {suitabilityItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-emerald-100/50 bg-white/95 p-5 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="mb-3 size-6 text-amber-400" />
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
