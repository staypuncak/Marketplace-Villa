'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, Star, Loader2, CheckCircle2, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type TestimonialRow = Tables<'testimonials'>

type TestimonialItem = {
  id: string
  guestName: string
  guestCity: string | null
  villaName: string | null
  villaId: string | null
  rating: number
  content: string
  status: string
  sortOrder: number
  createdAt: string | null
}

type FormData = {
  guest_name: string
  guest_city: string
  villa_name: string
  villa_id: string
  rating: number
  content: string
  status: string
  sort_order: number
}

const initialForm = {
  guest_name: '',
  guest_city: '',
  villa_name: '',
  villa_id: '',
  rating: 5,
  content: '',
  status: 'published',
  sort_order: 0,
}

const statusConfig: Record<string, { label: string; class: string }> = {
  published: { label: 'Published', class: 'bg-emerald-100 text-emerald-700' },
  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-500' },
  archived: { label: 'Archived', class: 'bg-red-100 text-red-600' },
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2)
}

const avatarColors = [
  'bg-emerald-600', 'bg-teal-600', 'bg-lime-700', 'bg-blue-700', 'bg-amber-700',
  'bg-rose-600', 'bg-violet-600', 'bg-cyan-600', 'bg-orange-600', 'bg-pink-600',
]

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}

export default function TestimonialPage() {
  const supabase = createClient()
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(initialForm)
  const [villas, setVillas] = useState<{ id: string; name: string }[]>([])

  const fetchTestimonials = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials((data ?? []).map((r) => ({
        id: r.id,
        guestName: r.guest_name,
        guestCity: r.guest_city,
        villaName: r.villa_name,
        villaId: r.villa_id,
        rating: r.rating ?? 5,
        content: r.content,
        status: r.status ?? 'draft',
        sortOrder: r.sort_order ?? 0,
        createdAt: r.created_at,
      })))
    } catch (err) {
      console.error('Failed to fetch testimonials:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  useEffect(() => {
    const fetchVillas = async () => {
      const { data } = await supabase
        .from('villas')
        .select('id, name')
        .order('name')

      if (data) setVillas(data)
    }
    fetchVillas()
  }, [supabase])

  const openCreate = () => {
    setForm(initialForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (t: TestimonialItem) => {
    setForm({
      guest_name: t.guestName,
      guest_city: t.guestCity || '',
      villa_name: t.villaName || '',
      villa_id: t.villaId || '',
      rating: t.rating,
      content: t.content,
      status: t.status,
      sort_order: t.sortOrder,
    })
    setEditingId(t.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.guest_name.trim() || !form.content.trim()) {
      setToast('Nama tamu dan isi testimoni wajib diisi')
      return
    }

    setSaving(true)
    try {
      const payload = {
        guest_name: form.guest_name.trim(),
        guest_city: form.guest_city.trim() || null,
        villa_name: form.villa_name.trim() || null,
        villa_id: form.villa_id || null,
        rating: form.rating,
        content: form.content.trim(),
        status: form.status,
        sort_order: form.sort_order,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setToast('Testimonial berhasil diperbarui')
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({ ...payload, created_at: new Date().toISOString() })

        if (error) throw error
        setToast('Testimonial berhasil ditambahkan')
      }

      setShowForm(false)
      fetchTestimonials()
    } catch (err) {
      console.error('Save error:', err)
      setToast('Gagal menyimpan testimonial')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      setToast(`Testimonial ${next === 'published' ? 'dipublikasikan' : 'diarsipkan sebagai draft'}`)
      fetchTestimonials()
    } catch {
      setToast('Gagal mengubah status')
    }
  }

  const archiveTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      setToast('Testimonial diarsipkan')
      fetchTestimonials()
    } catch {
      setToast('Gagal mengarsipkan testimonial')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Testimonial</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola ulasan tamu yang tampil di homepage StayPuncak.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          Tambah Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Star className="size-8 text-gray-300" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Belum ada testimonial</h3>
          <p className="mt-1 text-sm text-gray-500">Tambahkan testimonial pertama dari tamu.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t, i) => {
            const status = statusConfig[t.status] || { label: t.status, class: 'bg-gray-100 text-gray-500' }
            return (
              <div key={t.id} className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white', avatarColors[i % avatarColors.length])}>
                        {getInitials(t.guestName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-semibold text-gray-900">{t.guestName}</h3>
                          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', status.class)}>
                            {status.label}
                          </span>
                        </div>
                        <p className="truncate text-xs text-gray-400">
                          {t.guestCity && `${t.guestCity}`}
                          {t.guestCity && t.villaName && ' · '}
                          {t.villaName && `Menginap di ${t.villaName}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('size-3.5', i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {truncate(t.content, 150)}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                    <span>Urutan: {t.sortOrder}</span>
                    <span className="mx-1">·</span>
                    <span>{t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => openEdit(t)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(t.id, t.status)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      {t.status === 'published' ? 'Draft' : 'Publikasikan'}
                    </button>
                    {t.status !== 'archived' && (
                      <button
                        onClick={() => archiveTestimonial(t.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        Arsipkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-20">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Testimonial' : 'Tambah Testimonial'}
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nama Tamu *</label>
                <input
                  type="text"
                  value={form.guest_name}
                  onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Kota</label>
                <input
                  type="text"
                  value={form.guest_city}
                  onChange={(e) => setForm({ ...form, guest_city: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Villa terkait</label>
                <select
                  value={form.villa_id}
                  onChange={(e) => {
                    const selected = villas.find((v) => v.id === e.target.value)
                    setForm({ ...form, villa_id: e.target.value, villa_name: selected?.name || '' })
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Pilih villa (opsional)</option>
                  {villas.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, rating: i + 1 })}
                    >
                      <Star className={cn('size-6', i < form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Isi Testimoni *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Urutan Tampil</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                {editingId ? 'Simpan Perubahan' : 'Tambah Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="size-5 shrink-0" />
          {toast}
          <button onClick={() => setToast(null)} className="ml-2">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
