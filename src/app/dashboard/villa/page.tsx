'use client'

import { useState } from 'react'
import {
  Plus, Search, MapPin, Bed, Bath, Users,
  Eye, Pencil, MoreHorizontal, ChevronDown,
} from 'lucide-react'

type VillaStatus = 'aktif' | 'nonaktif'

type VillaItem = {
  id: string
  name: string
  location: string
  price: number
  capacity: number
  bedrooms: number
  bathrooms: number
  status: VillaStatus
  featured: boolean
  thumbnail: string
  slug: string
}

const dummyVillas: VillaItem[] = [
  {
    id: '1', name: 'Villa Kirana', location: 'Cisarua, Puncak Bogor', price: 2500000,
    capacity: 12, bedrooms: 4, bathrooms: 3, status: 'aktif', featured: true,
    thumbnail: '/images/placeholder.svg', slug: 'villa-kirana',
  },
  {
    id: '2', name: 'Villa Savana', location: 'Megamendung, Puncak Bogor', price: 1800000,
    capacity: 8, bedrooms: 3, bathrooms: 2, status: 'aktif', featured: false,
    thumbnail: '/images/placeholder.svg', slug: 'villa-savana',
  },
  {
    id: '3', name: 'Villa Highland', location: 'Cipanas, Puncak Bogor', price: 3200000,
    capacity: 16, bedrooms: 5, bathrooms: 4, status: 'aktif', featured: true,
    thumbnail: '/images/placeholder.svg', slug: 'villa-highland',
  },
  {
    id: '4', name: 'Villa Marbella', location: 'Puncak, Bogor', price: 1500000,
    capacity: 6, bedrooms: 2, bathrooms: 2, status: 'nonaktif', featured: false,
    thumbnail: '/images/placeholder.svg', slug: 'villa-marbella',
  },
  {
    id: '5', name: 'Villa Azura', location: 'Cisarua, Puncak Bogor', price: 2100000,
    capacity: 10, bedrooms: 4, bathrooms: 3, status: 'aktif', featured: false,
    thumbnail: '/images/placeholder.svg', slug: 'villa-azura',
  },
]

const statusOptions = ['Semua', 'Aktif', 'Nonaktif']
const sortOptions = ['Terbaru', 'Harga', 'Nama']

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString('id-ID')}`
}

function VillaCard({ villa }: { villa: VillaItem }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-gray-100">
        <div className="flex h-full items-center justify-center text-gray-300">
          <svg className="size-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
        {villa.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
            Featured
          </span>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            villa.status === 'aktif'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {villa.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900">{villa.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="size-3.5 shrink-0" />
          {villa.location}
        </p>

        <p className="mt-2 text-lg font-bold text-emerald-700">{formatPrice(villa.price)}</p>
        <p className="-mt-0.5 text-[11px] text-gray-400">/malam</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bed className="size-3.5" />
            {villa.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-3.5" />
            {villa.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {villa.capacity}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
            <Eye className="size-4" />
            Preview
          </button>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
            <Pencil className="size-4" />
            Edit
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <MoreHorizontal className="size-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
                    Duplicate
                  </button>
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Nonaktifkan
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VillaPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [sort, setSort] = useState('Terbaru')
  const [statusOpen, setStatusOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const filtered = dummyVillas
    .filter((v) => {
      if (statusFilter === 'Aktif') return v.status === 'aktif'
      if (statusFilter === 'Nonaktif') return v.status === 'nonaktif'
      return true
    })
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Harga') return a.price - b.price
      if (sort === 'Nama') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Kelola Villa</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola seluruh villa yang tampil di website StayPuncak.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700">
          <Plus className="size-4" />
          Tambah Villa
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari villa..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => { setStatusOpen(!statusOpen); setSortOpen(false) }}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            {statusFilter}
            <ChevronDown className="size-4 text-gray-400" />
          </button>
          {statusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setStatusOpen(false) }}
                    className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                      statusFilter === opt ? 'text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setSortOpen(!sortOpen); setStatusOpen(false) }}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Urut: {sort}
            <ChevronDown className="size-4 text-gray-400" />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setSortOpen(false) }}
                    className={`flex w-full items-center px-4 py-2 text-left text-sm ${
                      sort === opt ? 'text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-300">
            <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Belum ada villa</h3>
          <p className="mt-1 text-sm text-gray-500">Tambahkan villa pertama Anda.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>
      )}
    </div>
  )
}
