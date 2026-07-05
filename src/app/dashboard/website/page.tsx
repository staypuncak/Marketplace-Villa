'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Save, CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type WebsiteSettingRow = Tables<'website_settings'>

type SectionKey = 'hero' | 'contact' | 'final_cta' | 'footer' | 'seo'

type SectionConfig = {
  key: SectionKey
  label: string
  description: string
  fields: { name: string; label: string; placeholder: string; type?: string }[]
}

const sections: SectionConfig[] = [
  {
    key: 'hero',
    label: 'Hero Section',
    description: 'Atur teks utama yang tampil di halaman depan website.',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', placeholder: 'StayPuncak' },
      { name: 'headline', label: 'Headline', placeholder: 'Villa Premium di Puncak' },
      { name: 'subheadline', label: 'Subheadline', placeholder: 'Nikmati liburan mewah di villa terbaik kawasan Puncak, Bogor.' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact / WhatsApp',
    description: 'Atur nomor WhatsApp dan pesan default untuk tombol WhatsApp.',
    fields: [
      { name: 'whatsapp_number', label: 'WhatsApp Admin Number', placeholder: '62812xxxxxxxx' },
      { name: 'whatsapp_message', label: 'WhatsApp Default Message', placeholder: 'Halo Admin StayPuncak...', type: 'textarea' },
    ],
  },
  {
    key: 'final_cta',
    label: 'Final CTA',
    description: 'Atur teks untuk Call-to-Action di bagian bawah halaman depan.',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', placeholder: 'Ready to Experience?' },
      { name: 'headline', label: 'Headline', placeholder: 'Pesan Villa Impianmu Sekarang' },
      { name: 'subheadline', label: 'Subheadline', placeholder: 'Dapatkan pengalaman menginap terbaik di Puncak.' },
      { name: 'primary_button', label: 'Primary Button Text', placeholder: 'Booking Sekarang' },
      { name: 'secondary_button', label: 'Secondary Button Text', placeholder: 'Hubungi Kami' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    description: 'Atur teks footer dan tautan media sosial.',
    fields: [
      { name: 'description', label: 'Footer Description', placeholder: 'Deskripsi footer...', type: 'textarea' },
      { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/staypuncak' },
      { name: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@staypuncak' },
      { name: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/staypuncak' },
    ],
  },
  {
    key: 'seo',
    label: 'SEO Basic',
    description: 'Atur metadata SEO dasar untuk website publik.',
    fields: [
      { name: 'site_title', label: 'Site Title', placeholder: 'StayPuncak — Villa Premium di Puncak' },
      { name: 'meta_description', label: 'Meta Description', placeholder: 'Deskripsi meta untuk SEO...', type: 'textarea' },
      { name: 'og_image', label: 'Open Graph Image URL', placeholder: 'https://...' },
    ],
  },
]

const defaultValues: Record<SectionKey, Record<string, string>> = {
  hero: { eyebrow: '', headline: '', subheadline: '' },
  contact: { whatsapp_number: '', whatsapp_message: '' },
  final_cta: { eyebrow: '', headline: '', subheadline: '', primary_button: '', secondary_button: '' },
  footer: { description: '', instagram: '', tiktok: '', facebook: '' },
  seo: { site_title: '', meta_description: '', og_image: '' },
}

type ToastMessage = { text: string; variant: 'success' | 'error' } | null

function Toast({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg',
        toast.variant === 'success' ? 'bg-emerald-600' : 'bg-red-600',
      )}
    >
      {toast.variant === 'success' ? <CheckCircle2 className="size-5 shrink-0" /> : <AlertCircle className="size-5 shrink-0" />}
      {toast.text}
    </div>
  )
}

export default function WebsiteSettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<SectionKey | null>(null)
  const [toast, setToast] = useState<ToastMessage>(null)
  const [data, setData] = useState<Record<SectionKey, Record<string, string>>>(structuredClone(defaultValues))

  useEffect(() => {
    let cancelled = false

    const fetchSettings = async () => {
      try {
        const { data: rows, error } = await supabase
          .from('website_settings')
          .select('key, value')
          .in('key', ['hero', 'contact', 'final_cta', 'footer', 'seo'])

        if (cancelled) return
        if (error) throw error

        if (rows) {
          const merged = structuredClone(defaultValues)
          for (const row of rows) {
            const key = row.key as SectionKey
            const saved = row.value as Record<string, string>
            if (merged[key]) {
              for (const field of Object.keys(merged[key])) {
                if (saved[field] !== undefined) {
                  merged[key][field] = saved[field]
                }
              }
            }
          }
          if (!cancelled) setData(merged)
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch settings:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchSettings()
    return () => { cancelled = true }
  }, [supabase])

  const updateField = useCallback((section: SectionKey, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }, [])

  const saveSection = useCallback(async (section: SectionConfig) => {
    setSaving(section.key)
    try {
      const value = data[section.key]
      const { error } = await supabase
        .from('website_settings')
        .upsert({ key: section.key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

      if (error) throw error
      setToast({ text: `${section.label} berhasil disimpan`, variant: 'success' })
    } catch (err) {
      console.error('Failed to save:', err)
      setToast({ text: `Gagal menyimpan ${section.label}`, variant: 'error' })
    } finally {
      setSaving(null)
    }
  }, [data, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Pengaturan Website</h2>
        <p className="mt-1 text-sm text-gray-500">
          Atur konten utama yang tampil di website publik StayPuncak.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">{section.label}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{section.description}</p>
            </div>
            <button
              onClick={() => saveSection(section)}
              disabled={saving === section.key}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving === section.key ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Simpan
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {section.fields.map((field) => {
              const value = data[section.key][field.name] ?? ''
              return (
                <div key={field.name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={value}
                      onChange={(e) => updateField(section.key, field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateField(section.key, field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
