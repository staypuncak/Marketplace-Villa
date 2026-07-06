'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import VillaForm, { type VillaFormData } from '@/components/dashboard/villa/villa-form'

export default function EditVillaPage() {
  const params = useParams()
  const id = params.id as string

  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [initialData, setInitialData] = useState<Partial<VillaFormData>>({})

  useEffect(() => {
    async function fetchVilla() {
      try {
        const { data, error } = await supabase
          .from('villas')
          .select('*, media(*)')
          .eq('id', id)
          .single()

        if (error || !data) {
          setNotFound(true)
          return
        }

        const row = data as Record<string, unknown>
        const mediaArr = (row.media as { is_cover: boolean; image_url: string; sort_order: number }[] | undefined) ?? []

        const cover = mediaArr.find((m) => m.is_cover)
        const hero = mediaArr.find((m) => !m.is_cover && m.sort_order === 1)
        const gallery = mediaArr
          .filter((m) => !m.is_cover && m.sort_order >= 2)
          .sort((a, b) => a.sort_order - b.sort_order)

        setInitialData({
          name: (row.name as string) ?? '',
          slug: (row.slug as string) ?? '',
          price: String(Number(row.price) || 0),
          location: (row.location as string) ?? '',
          description: (row.description as string) ?? '',
          isFeatured: (row.is_featured as boolean) ?? false,
          isActive: (row.status as string) === 'active',
          category: (row.category as string) ?? '',
          guests: String((row.capacity as number) || 0),
          bedrooms: String((row.bedrooms as number) || 0),
          bathrooms: String((row.bathrooms as number) || 0),
          selectedFacilities: (row.facilities as string[]) ?? [],
          checkInTime: (row.check_in_time as string) ?? '14:00',
          checkOutTime: (row.check_out_time as string) ?? '12:00',
          minStay: String((row.minimum_stay as number) || 0),
          bookingNotes: (row.booking_notes as string) ?? '',
          featuredOrder: String((row.featured_order as number) || 0),
          seoTitle: (row.seo_title as string) ?? '',
          metaDescription: (row.meta_description as string) ?? '',
          priceInformation: (row.price_information as string) ?? '',
          thumbnailPath: cover?.image_url ?? '',
          heroPath: hero?.image_url ?? '',
          galleryPaths: gallery.map((m) => m.image_url),
        })
      } catch (err) {
        console.error('Edit villa fetch error:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchVilla()
  }, [id, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
          <span className="text-red-600">!</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Villa tidak ditemukan</h2>
        <p className="text-sm text-gray-500">
          Villa dengan ID tersebut tidak ditemukan atau telah dihapus.
        </p>
        <Link
          href="/dashboard/villa"
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
        >
          <ArrowLeft className="size-4" /> Kembali ke Daftar Villa
        </Link>
      </div>
    )
  }

  return (
    <VillaForm mode="edit" villaId={id} initialData={initialData} />
  )
}
