'use client'

import { Search, BadgeCheck, Tag, CheckCircle2, Shield, RotateCcw } from 'lucide-react'
import { LocationFilter } from './location-filter'
import { CapacityFilter } from './capacity-filter'
import { PriceSort } from './price-sort'

type Props = {
  defaultValue?: string
  selectedLocation?: string
  capacity?: string
  sort?: string
  locations: string[]
}

export function SearchCard({ defaultValue, selectedLocation, capacity, sort, locations }: Props) {
  return (
    <div className="rounded-3xl border border-emerald-100/50 bg-white p-5 shadow-lg sm:p-8">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Temukan Villa Terverifikasi
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Cari villa sesuai kebutuhan liburan Anda.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form
            method="GET"
            action="/#villa-discovery"
            className="relative flex-1"
          >
            <input type="hidden" name="location" value={selectedLocation ?? ''} />
            <input type="hidden" name="capacity" value={capacity ?? ''} />
            <input type="hidden" name="sort" value={sort ?? ''} />
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                defaultValue={defaultValue}
                placeholder="Cari villa..."
                className="w-full rounded-xl border border-emerald-200 bg-background py-2.5 pl-10 pr-28 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-700 px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                Cari Villa
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <LocationFilter
            locations={locations}
            selectedLocation={selectedLocation}
            search={defaultValue}
            capacity={capacity}
            sort={sort}
          />
          <CapacityFilter
            selectedCapacity={capacity}
            search={defaultValue}
            location={selectedLocation}
            sort={sort}
          />
          <PriceSort
            selectedSort={sort}
            search={defaultValue}
            location={selectedLocation}
            capacity={capacity}
          />
          <form method="GET" action="/#villa-discovery">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-brand bg-transparent px-3 py-2 text-sm text-brand transition-colors hover:bg-brand hover:text-white sm:w-auto"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-emerald-100/50 pt-4 lg:grid-cols-4">
          <div className="flex items-start gap-2">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium">Villa Terverifikasi</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Dicek langsung oleh tim kami
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Tag className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium">Harga Transparan</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Tidak ada biaya tersembunyi
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium">Tanpa Biaya Tambahan</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Harga final, semua jelas
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium">Booking Aman</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Admin resmi, transaksi aman
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
