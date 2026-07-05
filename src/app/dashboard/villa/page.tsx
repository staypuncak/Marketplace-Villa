'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, MapPin, Bed, Bath, Users,
  Eye, Pencil, ChevronDown, Archive, X, CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type VillaRow = Tables<'villas'>
type MediaRow = Tables<'media'>

type VillaItem = VillaRow & {
  thumbnail: string
}

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString('id-ID')}`
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return { label: 'Aktif', class: 'bg-emerald-100 text-emerald-700' }
    case 'draft':
      return { label: 'Draft', class: 'bg-gray-100 text-gray-500' }
    case 'archived':
      return { label: 'Arsip', class: 'bg-amber-100 text-amber-700' }
    default:
      return { label: 'Nonaktif', class: 'bg-gray-100 text-gray-500' }
  }
}

function VillaCard({
  villa,
  onArchive,
}: {
  villa: VillaItem
  onArchive: (v: VillaItem) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const badge = getStatusBadge(villa.status)

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
        {villa.is_featured && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
            Featured
          </span>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.class}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900">{villa.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="size-3.5 shrink-0" />
          {villa.location ?? '—'}
        </p>

        <p className="mt-2 text-lg font-bold text-emerald-700">{formatPrice(villa.price)}</p>
        <p className="-mt-0.5 text-[11px] text-gray-400">/malam</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bed className="size-3.5" />
            {villa.bedrooms ?? '—'}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-3.5" />
            {villa.bathrooms ?? '—'}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {villa.capacity}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          <Link
            href={`/villa/${villa.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Eye className="size-4" />
            Preview
          </Link>
          <Link
            href={`/dashboard/villa/${villa.id}/edit`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Pencil className="size-4" />
            Edit
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <ChevronDown className="size-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => { setMenuOpen(false); onArchive(villa) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <Archive className="size-4" />
                    {villa.status === 'archived' ? 'Aktifkan Kembali' : 'Arsipkan'}
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

function ConfirmDialog({
  villa,
  onConfirm,
  onCancel,
  loading,
}: {
  villa: VillaItem
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  const isArchived = villa.status === 'archived'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
            <Archive className="size-6 text-red-600" />
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {isArchived ? 'Aktifkan villa ini?' : 'Arsipkan villa ini?'}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {isArchived
            ? 'Villa akan tampil kembali di website publik.'
            : 'Villa tidak akan tampil di website publik, tetapi datanya tetap tersimpan.'}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-700">{villa.name}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : isArchived ? 'Aktifkan' : 'Arsipkan'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      <CheckCircle2 className="size-5 shrink-0" />
      {message}
    </div>
  )
}

const statusOptions = ['Semua', 'Aktif', 'Draft', 'Arsip']
const sortOptions = ['Terbaru', 'Harga', 'Nama']

export default function VillaPage() {
  const [villas, setVillas] = useState<VillaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [sort, setSort] = useState('Terbaru')
  const [statusOpen, setStatusOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<VillaItem | null>(null)
  const [archiving, setArchiving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    let cancelled = false

    const fetchVillas = async () => {
      try {
        const { data, error } = await supabase
          .from('villas')
          .select('*, media(*)')
          .order('created_at', { ascending: false })

        if (cancelled) return
        if (error) throw error

        const items: VillaItem[] = (data ?? []).map((row) => {
          const mediaArr = (row as { media: MediaRow[] }).media ?? []
          const cover = mediaArr.find((m) => m.is_cover)
          return {
            ...row,
            thumbnail: cover?.image_url ?? '',
          }
        })

        setVillas(items)
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch villas:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchVillas()

    return () => { cancelled = true }
  }, [supabase])

  async function handleArchive() {
    if (!archiveTarget) return
    setArchiving(true)
    try {
      const newStatus = archiveTarget.status === 'archived' ? 'active' : 'archived'
      const { error } = await supabase
        .from('villas')
        .update({ status: newStatus })
        .eq('id', archiveTarget.id)

      if (error) throw error

      setVillas((prev) =>
        prev.map((v) =>
          v.id === archiveTarget.id ? { ...v, status: newStatus } : v,
        ),
      )

      setToast(
        newStatus === 'archived'
          ? 'Villa berhasil diarsipkan'
          : 'Villa berhasil diaktifkan kembali',
      )
      setArchiveTarget(null)
    } catch (err) {
      console.error('Archive error:', err)
      setToast('Gagal mengarsipkan villa')
    } finally {
      setArchiving(false)
    }
  }

  const filtered = villas
    .filter((v) => {
      if (statusFilter === 'Aktif') return v.status === 'active'
      if (statusFilter === 'Draft') return v.status === 'draft'
      if (statusFilter === 'Arsip') return v.status === 'archived'
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
        <Link href="/dashboard/villa/create" className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700">
          <Plus className="size-4" />
          Tambah Villa
        </Link>
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
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
            <VillaCard
              key={villa.id}
              villa={villa}
              onArchive={setArchiveTarget}
            />
          ))}
        </div>
      )}

      {archiveTarget && (
        <ConfirmDialog
          villa={archiveTarget}
          onConfirm={handleArchive}
          onCancel={() => setArchiveTarget(null)}
          loading={archiving}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
