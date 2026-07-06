'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Building, Search, Plus, X, Image, Loader2, AlertCircle, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET, getVillaThumbnailPath, getVillaHeroPath, getVillaGalleryPath } from '@/lib/storage/media-paths'

const steps = ['Informasi Dasar', 'Media', 'Fasilitas', 'Booking', 'SEO & Publish']

const facilityOptions = [
  'Private Pool', 'WiFi', 'BBQ', 'Karaoke', 'Kitchen',
  'Mountain View', 'Smart TV', 'Hot Water', 'Parking',
  'Playground', 'Campfire', 'Meeting Room',
]

const categoryOptions = ['Private Villa', 'Family Villa', 'Luxury Villa', 'Villa dengan Private Pool']

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:h-10 sm:w-10 sm:text-sm',
                  i < step ? 'bg-emerald-600 text-white' : i === step ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-2 border-gray-200 bg-white text-gray-400',
                )}
              >
                {i < step ? <Check className="size-4 sm:size-5" /> : i + 1}
              </div>
              <span className={cn('mt-1.5 hidden text-xs font-medium sm:block', i === step ? 'text-emerald-700' : 'text-gray-400')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('mx-2 h-0.5 w-8 transition-colors sm:mx-3 sm:w-16', i < step ? 'bg-emerald-600' : 'bg-gray-200')} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CreateVillaPage() {
  const [step, setStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [slug, setSlug] = useState('')
  const [guests, setGuests] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [customFacilities, setCustomFacilities] = useState<string[]>([])
  const [thumbnailPath, setThumbnailPath] = useState('')
  const [heroPath, setHeroPath] = useState('')
  const [galleryPaths, setGalleryPaths] = useState<string[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [category, setCategory] = useState('')
  const [checkInTime, setCheckInTime] = useState('14:00')
  const [checkOutTime, setCheckOutTime] = useState('12:00')
  const [minStay, setMinStay] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [featuredOrder, setFeaturedOrder] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [priceInformation, setPriceInformation] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else setSuccess(true)
  }
  const prev = () => setStep(step - 1)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)

    try {
      const supabase = createClient()

      const { data: villa, error: villaError } = await supabase
        .from('villas')
        .insert({
          name,
          slug,
          location: location || null,
          price: Number(price) || 0,
          capacity: Number(guests) || 0,
          description: description || null,
          status: isActive ? 'active' : 'draft',
          facilities: selectedFacilities,
          bedrooms: Number(bedrooms) || null,
          bathrooms: Number(bathrooms) || null,
          category: category || null,
          is_featured: isFeatured,
          featured_order: Number(featuredOrder) || null,
          check_in_time: checkInTime || null,
          check_out_time: checkOutTime || null,
          minimum_stay: Number(minStay) || null,
          booking_notes: bookingNotes || null,
          seo_title: seoTitle || null,
          meta_description: metaDescription || null,
          og_image_url: thumbnailPath || heroPath || null,
          price_information: priceInformation.trim() || null,
        })
        .select('id')
        .single()

      if (villaError) {
        setSaveError(villaError.message)
        setSaving(false)
        return
      }

      const mediaInserts: {
        villa_id: string
        image_url: string
        is_cover: boolean
        sort_order: number
      }[] = []

      if (thumbnailPath) {
        mediaInserts.push({ villa_id: villa.id, image_url: thumbnailPath, is_cover: true, sort_order: 0 })
      }
      if (heroPath) {
        mediaInserts.push({ villa_id: villa.id, image_url: heroPath, is_cover: false, sort_order: 1 })
      }
      galleryPaths.forEach((path, i) => {
        mediaInserts.push({ villa_id: villa.id, image_url: path, is_cover: false, sort_order: i + 2 })
      })

      if (mediaInserts.length > 0) {
        const { error: mediaError } = await supabase.from('media').insert(mediaInserts)
        if (mediaError) {
          setSaveError(mediaError.message)
          setSaving(false)
          return
        }
      }

      setSuccess(true)
    } catch {
      setSaveError('Gagal menyimpan villa. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg space-y-8">
        <Link href="/dashboard/villa" className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800">
          <ArrowLeft className="size-4" /> Kembali ke Daftar Villa
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
            🎉
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Villa berhasil dibuat</h2>
          <p className="mt-1 text-sm text-gray-500">Villa Anda sekarang sudah masuk daftar.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700">
              Lihat Villa
            </button>
            <button onClick={() => { setStep(0); setSuccess(false) }} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50">
              Tambah Villa Lagi
            </button>
            <Link href="/dashboard/villa" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 shadow-sm transition-all hover:bg-gray-50">
              Kembali ke Daftar Villa
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard/villa" className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800">
        <ArrowLeft className="size-4" /> Kembali ke Daftar Villa
      </Link>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Tambah Villa Baru</h2>
        <p className="mt-1 text-sm text-gray-500">
          Lengkapi informasi villa secara bertahap agar mudah dikelola dan siap dipublikasikan.
        </p>
      </div>

      <StepIndicator step={step} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {step === 0 && (
          <StepInformasiDasar
            slug={slug} setSlug={setSlug}
            name={name} setName={setName}
            price={price} setPrice={setPrice}
            location={location} setLocation={setLocation}
            description={description} setDescription={setDescription}
            isFeatured={isFeatured} setIsFeatured={setIsFeatured}
            isActive={isActive} setIsActive={setIsActive}
            category={category} setCategory={setCategory}
          />
        )}
        {step === 1 && (
          <StepMedia
            slug={slug}
            thumbnailPath={thumbnailPath} setThumbnailPath={setThumbnailPath}
            heroPath={heroPath} setHeroPath={setHeroPath}
            galleryPaths={galleryPaths} setGalleryPaths={setGalleryPaths}
          />
        )}
        {step === 2 && (
          <StepFasilitas
            guests={guests} setGuests={setGuests}
            bedrooms={bedrooms} setBedrooms={setBedrooms}
            bathrooms={bathrooms} setBathrooms={setBathrooms}
            selectedFacilities={selectedFacilities} setSelectedFacilities={setSelectedFacilities}
            customFacilities={customFacilities} setCustomFacilities={setCustomFacilities}
          />
        )}
        {step === 3 && (
          <StepBooking
            checkInTime={checkInTime} setCheckInTime={setCheckInTime}
            checkOutTime={checkOutTime} setCheckOutTime={setCheckOutTime}
            minStay={minStay} setMinStay={setMinStay}
            bookingNotes={bookingNotes} setBookingNotes={setBookingNotes}
            featuredOrder={featuredOrder} setFeaturedOrder={setFeaturedOrder}
            priceInformation={priceInformation} setPriceInformation={setPriceInformation}
          />
        )}
        {step === 4 && (
          <StepSeo
            slug={slug}
            guests={guests} bedrooms={bedrooms} bathrooms={bathrooms}
            selectedFacilities={selectedFacilities}
            thumbnailPath={thumbnailPath} heroPath={heroPath} galleryPaths={galleryPaths}
            seoTitle={seoTitle} setSeoTitle={setSeoTitle}
            metaDescription={metaDescription} setMetaDescription={setMetaDescription}
          />
        )}
      </div>

      {saveError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          {saveError}
          <button onClick={() => setSaveError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {step > 0 && (
            <button onClick={prev} className="flex w-full items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 sm:w-auto">
              <ArrowLeft className="size-4" /> Kembali
            </button>
          )}
        </div>
        <button
          onClick={step < steps.length - 1 ? next : handleSave}
          disabled={saving}
          className="flex w-full items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {saving ? (
            <><Loader2 className="size-4 animate-spin" /> Menyimpan...</>
          ) : (
            <>{step < steps.length - 1 ? 'Lanjut' : 'Simpan Villa'} <ArrowRight className="size-4" /></>
          )}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function StepInformasiDasar({
  slug, setSlug,
  name, setName,
  price, setPrice,
  location, setLocation,
  description, setDescription,
  isFeatured, setIsFeatured,
  isActive, setIsActive,
  category, setCategory,
}: {
  slug: string; setSlug: (v: string) => void
  name: string; setName: (v: string) => void
  price: string; setPrice: (v: string) => void
  location: string; setLocation: (v: string) => void
  description: string; setDescription: (v: string) => void
  isFeatured: boolean; setIsFeatured: (v: boolean) => void
  isActive: boolean; setIsActive: (v: boolean) => void
  category: string; setCategory: (v: string) => void
}) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val))
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Nama Villa" required>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="contoh: Villa Bukit Respati"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </Field>
      <Field label="Slug">
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="villa-bukit-respati"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <p className="mt-1 text-xs text-gray-400">URL otomatis dibuat dari nama villa dan bisa disesuaikan.</p>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Lokasi" required>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cisarua, Puncak Bogor"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </Field>
        <Field label="Harga per Malam" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2.500.000"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </Field>
      </div>
      <Field label="Kategori">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={cn(
                'rounded-xl border px-4 py-2 text-sm transition-all',
                category === cat
                  ? 'border-emerald-300 bg-emerald-50 font-medium text-emerald-700'
                  : 'border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Field>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">Aktif</span>
        </label>
      </div>
      <Field label="Deskripsi Singkat">
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi villa untuk homepage..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </Field>
    </div>
  )
}

function MediaCard({ label, badge, helper, ratio, counter, children }: {
  label: string
  badge?: string
  helper: string
  ratio?: string
  counter?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
            {badge && (
              <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600">{badge}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-400">{helper}</p>
        </div>
        {counter && <span className="text-xs font-medium text-gray-400">{counter}</span>}
      </div>
      {ratio && <p className="mt-2 text-[11px] font-medium text-gray-400">Rasio: {ratio}</p>}
      <div className="mt-3">{children}</div>
    </div>
  )
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Hanya file JPG, PNG, dan WEBP yang diterima.'
  if (file.size > MAX_FILE_SIZE) return 'Ukuran file maksimal 5 MB.'
  return null
}

function StepMedia({
  slug,
  thumbnailPath, setThumbnailPath,
  heroPath, setHeroPath,
  galleryPaths, setGalleryPaths,
}: {
  slug: string
  thumbnailPath: string; setThumbnailPath: (v: string) => void
  heroPath: string; setHeroPath: (v: string) => void
  galleryPaths: string[]; setGalleryPaths: (v: string[]) => void
}) {
  const [uploading, setUploading] = useState<'thumbnail' | 'hero' | 'gallery' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const getPublicUrl = (path: string) =>
    supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl

  const uploadSingle = async (file: File, getPath: (slug: string) => string, setPath: (v: string) => void) => {
    const validationError = validateFile(file)
    if (validationError) { setError(validationError); return }

    if (!slug.trim()) { setError('Isi nama villa terlebih dahulu sebelum upload gambar.'); return }

    const path = getPath(slug)
    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true })
    if (uploadError) { setError(uploadError.message); return }

    setPath(path)
    setError(null)
  }

  const handleThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('thumbnail')
    await uploadSingle(file, getVillaThumbnailPath, setThumbnailPath)
    setUploading(null)
    if (thumbnailRef.current) thumbnailRef.current.value = ''
  }

  const handleHero = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('hero')
    await uploadSingle(file, getVillaHeroPath, setHeroPath)
    setUploading(null)
    if (heroRef.current) heroRef.current.value = ''
  }

  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (galleryPaths.length + files.length > 20) { setError('Maksimal 20 foto untuk galeri.'); return }

    if (!slug.trim()) { setError('Isi nama villa terlebih dahulu sebelum upload gambar.'); return }

    setUploading('gallery')
    const newPaths = [...galleryPaths]
    for (const file of files) {
      const validationError = validateFile(file)
      if (validationError) { setError(validationError); continue }

      const index = newPaths.length + 1
      const path = getVillaGalleryPath(slug, index)
      const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: true })
      if (uploadError) { setError(uploadError.message); continue }

      newPaths.push(path)
    }
    setGalleryPaths(newPaths)
    setUploading(null)
    setError(null)
    if (galleryRef.current) galleryRef.current.value = ''
  }

  const removeThumbnail = () => {
    // TODO: also delete from storage if needed
    setThumbnailPath('')
  }
  const removeHero = () => {
    // TODO: also delete from storage if needed
    setHeroPath('')
  }
  const removeGallery = (index: number) => {
    // TODO: also delete from storage if needed
    setGalleryPaths(galleryPaths.filter((_, i) => i !== index))
  }

  if (!slug.trim()) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <Image className="mx-auto size-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">Isi nama villa terlebih dahulu sebelum upload gambar.</p>
          <p className="mt-1 text-xs text-gray-400">Lengkapi informasi dasar di Step 1 terlebih dahulu.</p>
        </div>
        <p className="text-center text-xs text-gray-400">Upload gambar akan dihubungkan ke Supabase Storage pada sprint berikutnya.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <MediaCard label="Thumbnail Villa" badge="Wajib" helper="Gambar utama yang tampil di card villa dan daftar rekomendasi." ratio="4:3 atau 1:1">
          <input ref={thumbnailRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleThumbnail} className="hidden" />
          {uploading === 'thumbnail' ? (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7">
              <div className="text-center">
                <Loader2 className="mx-auto size-6 animate-spin text-emerald-600" />
                <p className="mt-2 text-sm text-gray-500">Mengupload...</p>
              </div>
            </div>
          ) : thumbnailPath ? (
            <div className="relative">
              <img src={getPublicUrl(thumbnailPath)} alt="Thumbnail" className="h-40 w-full rounded-xl object-cover" />
              <button onClick={removeThumbnail} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-red-500 text-white shadow transition-colors hover:bg-red-600">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ) : (
            <div onClick={() => thumbnailRef.current?.click()} className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
              <div className="text-center">
                <Upload className="mx-auto size-6 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Klik untuk upload atau drag foto ke sini</p>
                <p className="mt-0.5 text-xs text-gray-300">JPG, PNG, WEBP</p>
              </div>
            </div>
          )}
        </MediaCard>

        <MediaCard label="Hero Detail Villa" badge="Wajib" helper="Gambar besar yang tampil di halaman detail villa." ratio="16:9">
          <input ref={heroRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleHero} className="hidden" />
          {uploading === 'hero' ? (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7">
              <div className="text-center">
                <Loader2 className="mx-auto size-6 animate-spin text-emerald-600" />
                <p className="mt-2 text-sm text-gray-500">Mengupload...</p>
              </div>
            </div>
          ) : heroPath ? (
            <div className="relative">
              <img src={getPublicUrl(heroPath)} alt="Hero" className="h-48 w-full rounded-xl object-cover" />
              <button onClick={removeHero} className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-red-500 text-white shadow transition-colors hover:bg-red-600">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ) : (
            <div onClick={() => heroRef.current?.click()} className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
              <div className="text-center">
                <Upload className="mx-auto size-6 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Klik untuk upload atau drag foto ke sini</p>
                <p className="mt-0.5 text-xs text-gray-300">JPG, PNG, WEBP</p>
              </div>
            </div>
          )}
        </MediaCard>

        <MediaCard label="Galeri Foto Villa" helper="Tambahkan beberapa foto untuk memperlihatkan suasana villa, kamar, kolam, dapur, dan area sekitar." ratio="Minimal 5 foto — Maksimal 20 foto" counter={`${galleryPaths.length} / 20 foto`}>
          <input ref={galleryRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleGallery} className="hidden" />
          {uploading === 'gallery' ? (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7">
              <div className="text-center">
                <Loader2 className="mx-auto size-6 animate-spin text-emerald-600" />
                <p className="mt-2 text-sm text-gray-500">Mengupload...</p>
              </div>
            </div>
          ) : galleryPaths.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {galleryPaths.map((path, i) => (
                <div key={path} className="relative">
                  <img src={getPublicUrl(path)} alt={`Gallery ${i + 1}`} className="h-24 w-full rounded-lg object-cover" />
                  <button onClick={() => removeGallery(i)} className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow transition-colors hover:bg-red-600">
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {galleryPaths.length < 20 && (
                <div onClick={() => galleryRef.current?.click()} className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
                  <Plus className="size-6 text-gray-300" />
                </div>
              )}
            </div>
          ) : (
            <div onClick={() => galleryRef.current?.click()} className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
              <div className="text-center">
                <Upload className="mx-auto size-6 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Klik untuk upload atau drag foto ke sini</p>
                <p className="mt-0.5 text-xs text-gray-300">JPG, PNG, WEBP</p>
              </div>
            </div>
          )}
        </MediaCard>
      </div>
    </div>
  )
}

function StepFasilitas({
  guests, setGuests,
  bedrooms, setBedrooms,
  bathrooms, setBathrooms,
  selectedFacilities, setSelectedFacilities,
  customFacilities, setCustomFacilities,
}: {
  guests: string; setGuests: (v: string) => void
  bedrooms: string; setBedrooms: (v: string) => void
  bathrooms: string; setBathrooms: (v: string) => void
  selectedFacilities: string[]; setSelectedFacilities: (v: string[]) => void
  customFacilities: string[]; setCustomFacilities: (v: string[]) => void
}) {
  const [customInput, setCustomInput] = useState('')

  const toggleFacility = (f: string) => {
    setSelectedFacilities(
      selectedFacilities.includes(f)
        ? selectedFacilities.filter((s) => s !== f)
        : [...selectedFacilities, f]
    )
  }

  const allFacilities = [...facilityOptions, ...customFacilities]

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    if (allFacilities.some((f) => f.toLowerCase() === trimmed.toLowerCase())) return
    setCustomFacilities([...customFacilities, trimmed])
    setSelectedFacilities([...selectedFacilities, trimmed])
    setCustomInput('')
  }

  const removeCustom = (f: string) => {
    setCustomFacilities(customFacilities.filter((c) => c !== f))
    setSelectedFacilities(selectedFacilities.filter((s) => s !== f))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Fitur Utama Villa</h3>
        <p className="mt-1 text-xs text-gray-400">Data ini akan tampil di card villa dan halaman detail.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Kapasitas Tamu" required>
            <input
              type="number"
              placeholder="0"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </Field>
          <Field label="Jumlah Kamar Tidur" required>
            <input
              type="number"
              placeholder="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </Field>
          <Field label="Jumlah Kamar Mandi" required>
            <input
              type="number"
              placeholder="0"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">Fasilitas Tambahan</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {allFacilities.map((f) => {
            const isSelected = selectedFacilities.includes(f)
            const isCustom = customFacilities.includes(f)
            return (
              <div key={f} className="relative">
                <button
                  onClick={() => toggleFacility(f)}
                  className={cn(
                    'rounded-xl border px-4 py-2 text-sm transition-all',
                    isSelected
                      ? 'border-emerald-300 bg-emerald-50 font-medium text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/50',
                  )}
                >
                  {f}
                </button>
                {isCustom && (
                  <button
                    onClick={() => removeCustom(f)}
                    className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-400 text-white shadow-sm transition-colors hover:bg-red-500"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
            placeholder="Tambah fasilitas lain, contoh: Meja Billiard"
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={addCustom}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
          >
            <Plus className="size-4" /> Tambah
          </button>
        </div>
      </div>
    </div>
  )
}

function StepBooking({
  checkInTime, setCheckInTime,
  checkOutTime, setCheckOutTime,
  minStay, setMinStay,
  bookingNotes, setBookingNotes,
  featuredOrder, setFeaturedOrder,
  priceInformation, setPriceInformation,
}: {
  checkInTime: string; setCheckInTime: (v: string) => void
  checkOutTime: string; setCheckOutTime: (v: string) => void
  minStay: string; setMinStay: (v: string) => void
  bookingNotes: string; setBookingNotes: (v: string) => void
  featuredOrder: string; setFeaturedOrder: (v: string) => void
  priceInformation: string; setPriceInformation: (v: string) => void
}) {
  return (
    <div className="space-y-5">
      <Field label="Informasi Harga">
        <textarea
          rows={4}
          value={priceInformation}
          onChange={(e) => setPriceInformation(e.target.value)}
          placeholder={'Contoh:\nMinggu–Kamis : Rp3.000.000\nJumat : Rp4.000.000\nSabtu : Rp7.000.000\n\natau\nFlat Rate\nRp4.000.000'}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <p className="mt-1 text-xs text-gray-400">
          Informasi ini akan tampil di halaman detail villa. Kosongkan jika villa hanya menggunakan satu harga.
        </p>
      </Field>
      <Field label="Nomor WhatsApp Booking">
        <input type="text" placeholder="+62 812-3456-7890" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Check-in Time">
          <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </Field>
        <Field label="Check-out Time">
          <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </Field>
      </div>
      <Field label="Minimum Stay (malam)">
        <input type="number" value={minStay} onChange={(e) => setMinStay(e.target.value)} placeholder="1" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Catatan Booking">
        <textarea rows={3} value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} placeholder="Informasi tambahan untuk tamu..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Featured Order / Homepage Priority">
        <input type="number" value={featuredOrder} onChange={(e) => setFeaturedOrder(e.target.value)} placeholder="1" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
    </div>
  )
}

function StepSeo({ slug, guests, bedrooms, bathrooms, selectedFacilities, thumbnailPath, heroPath, galleryPaths, seoTitle, setSeoTitle, metaDescription, setMetaDescription }: { slug: string; guests: string; bedrooms: string; bathrooms: string; selectedFacilities: string[]; thumbnailPath: string; heroPath: string; galleryPaths: string[]; seoTitle: string; setSeoTitle: (v: string) => void; metaDescription: string; setMetaDescription: (v: string) => void }) {
  return (
    <div className="space-y-5">
      <Field label="SEO Title">
        <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Villa Bukit Respati — StayPuncak" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Meta Description">
        <textarea rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Nikmati liburan keluarga di Villa Bukit Respati..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Preview URL">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
          <Search className="size-4" />
          staypuncak.com/villa/<span className="text-gray-400">{slug || 'villa-bukit-respati'}</span>
        </div>
      </Field>
      <Field label="Publikasi">
        <div className="flex gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm transition-colors hover:border-emerald-300">
            <input type="radio" name="publish" className="text-emerald-600" /> Draft
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm transition-colors hover:border-emerald-300">
            <input type="radio" name="publish" className="text-emerald-600" /> Publish
          </label>
        </div>
      </Field>
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ringkasan</p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-gray-200 text-gray-400">
            <Building className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Villa Bukit Respati</p>
            <p className="text-xs text-gray-500">Cisarua, Puncak Bogor</p>
            <p className="text-xs font-medium text-emerald-700">Rp 2.500.000 / malam</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400">
              <span>Kapasitas: {guests || '-'} tamu</span>
              <span>Kamar Tidur: {bedrooms || '-'}</span>
              <span>Kamar Mandi: {bathrooms || '-'}</span>
              <span>Fasilitas: {selectedFacilities.length} dipilih</span>
              <span>Thumbnail: {thumbnailPath ? 'Sudah diupload' : 'Belum diupload'}</span>
              <span>Hero: {heroPath ? 'Sudah diupload' : 'Belum diupload'}</span>
              <span>Galeri: {galleryPaths.length} foto</span>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">Draft</span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Featured</span>
          </div>
        </div>
      </div>
    </div>
  )
}
