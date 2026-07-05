'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Plus, Loader2, CheckCircle2, X, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type BlogPostRow = Tables<'blog_posts'>

type PostItem = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  featured_image_url: string | null
  status: string
  is_featured: boolean
  published_at: string | null
  seo_title: string | null
  meta_description: string | null
  content: string
  created_at: string | null
}

type FormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  featured_image_url: string
  status: string
  is_featured: boolean
  published_at: string
  seo_title: string
  meta_description: string
}

const initialForm: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  featured_image_url: '',
  status: 'draft',
  is_featured: false,
  published_at: '',
  seo_title: '',
  meta_description: '',
}

const statusConfig: Record<string, { label: string; class: string }> = {
  published: { label: 'Published', class: 'bg-emerald-100 text-emerald-700' },
  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-500' },
  archived: { label: 'Archived', class: 'bg-red-100 text-red-600' },
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}

export default function BlogPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(initialForm)

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts((data ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        category: r.category,
        featured_image_url: r.featured_image_url,
        status: r.status ?? 'draft',
        is_featured: r.is_featured ?? false,
        published_at: r.published_at,
        seo_title: r.seo_title,
        meta_description: r.meta_description,
        content: r.content,
        created_at: r.created_at,
      })))
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const openCreate = () => {
    setForm(initialForm)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (p: PostItem) => {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      content: p.content,
      category: p.category || '',
      featured_image_url: p.featured_image_url || '',
      status: p.status,
      is_featured: p.is_featured,
      published_at: p.published_at ? p.published_at.slice(0, 10) : '',
      seo_title: p.seo_title || '',
      meta_description: p.meta_description || '',
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.slug.trim()) {
      setToast('Judul, slug, dan konten wajib diisi')
      return
    }

    setSaving(true)
    try {
      const now = new Date().toISOString()
      const publishedAt = form.status === 'published' && !form.published_at
        ? now
        : form.published_at
          ? new Date(form.published_at).toISOString()
          : null

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || null,
        content: form.content.trim(),
        category: form.category.trim() || null,
        featured_image_url: form.featured_image_url.trim() || null,
        status: form.status,
        is_featured: form.is_featured,
        published_at: publishedAt,
        seo_title: form.seo_title.trim() || null,
        meta_description: form.meta_description.trim() || null,
        updated_at: now,
      }

      if (editingId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editingId)

        if (error) throw error
        setToast('Artikel berhasil diperbarui')
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({ ...payload, created_at: now })

        if (error) throw error
        setToast('Artikel berhasil ditambahkan')
      }

      setShowForm(false)
      fetchPosts()
    } catch (err) {
      console.error('Save error:', err)
      setToast('Gagal menyimpan artikel')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'published' ? 'draft' : 'published'
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          status: next,
          updated_at: new Date().toISOString(),
          published_at: next === 'published' ? new Date().toISOString() : undefined,
        })
        .eq('id', id)

      if (error) throw error
      setToast(`Artikel ${next === 'published' ? 'dipublikasikan' : 'diarsipkan sebagai draft'}`)
      fetchPosts()
    } catch {
      setToast('Gagal mengubah status')
    }
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_featured: !current, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      setToast(!current ? 'Ditandai sebagai unggulan' : 'Unggulan dihapus')
      fetchPosts()
    } catch {
      setToast('Gagal mengubah unggulan')
    }
  }

  const archivePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      setToast('Artikel diarsipkan')
      fetchPosts()
    } catch {
      setToast('Gagal mengarsipkan artikel')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Blog</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola artikel dan konten SEO StayPuncak.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
        >
          <Plus className="size-4" />
          Tambah Artikel
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Star className="size-8 text-gray-300" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Belum ada artikel</h3>
          <p className="mt-1 text-sm text-gray-500">Tambahkan artikel blog pertama.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => {
            const status = statusConfig[p.status] || { label: p.status, class: 'bg-gray-100 text-gray-500' }
            return (
              <div key={p.id} className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-gray-900">{p.title}</h3>
                        {p.is_featured && (
                          <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
                        )}
                        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', status.class)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-400 font-mono">{p.slug}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    {p.category && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 font-medium text-brand">{p.category}</span>
                    )}
                    <span>{formatDate(p.published_at || p.created_at)}</span>
                  </div>

                  {p.excerpt && (
                    <p className="mt-2 text-sm text-gray-500">{truncate(p.excerpt, 120)}</p>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      {p.status === 'published' ? 'Draft' : 'Publikasikan'}
                    </button>
                    <button
                      onClick={() => toggleFeatured(p.id, p.is_featured)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    >
                      {p.is_featured ? 'Non-Featured' : 'Featured'}
                    </button>
                    {p.status !== 'archived' && (
                      <button
                        onClick={() => archivePost(p.id)}
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
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Artikel' : 'Tambah Artikel'}
            </h3>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Judul Artikel *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({
                      ...form,
                      title: e.target.value,
                      slug: editingId ? form.slug : slugify(e.target.value),
                    })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Panduan, Tips, Rekomendasi..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Featured</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.is_featured ? 'bg-emerald-600' : 'bg-gray-300',
                    )}
                  >
                    <span className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      form.is_featured ? 'translate-x-6' : 'translate-x-1',
                    )} />
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Published At</label>
                  <input
                    type="date"
                    value={form.published_at}
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Ringkasan singkat artikel..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Featured Image URL</label>
                <input
                  type="text"
                  value={form.featured_image_url}
                  onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">SEO Title</label>
                  <input
                    type="text"
                    value={form.seo_title}
                    onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Meta Description</label>
                  <input
                    type="text"
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
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
                {editingId ? 'Simpan Perubahan' : 'Tambah Artikel'}
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
