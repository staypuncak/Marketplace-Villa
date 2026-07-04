'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Building, Search, Plus, X, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [guests, setGuests] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [customFacilities, setCustomFacilities] = useState<string[]>([])
  const [thumbnailSelected, setThumbnailSelected] = useState(false)
  const [heroSelected, setHeroSelected] = useState(false)
  const [galleryCount, setGalleryCount] = useState(0)

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else setSuccess(true)
  }
  const prev = () => setStep(step - 1)

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
        {step === 0 && <StepInformasiDasar />}
        {step === 1 && (
          <StepMedia
            thumbnailSelected={thumbnailSelected} setThumbnailSelected={setThumbnailSelected}
            heroSelected={heroSelected} setHeroSelected={setHeroSelected}
            galleryCount={galleryCount} setGalleryCount={setGalleryCount}
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
        {step === 3 && <StepBooking />}
        {step === 4 && <StepSeo guests={guests} bedrooms={bedrooms} bathrooms={bathrooms} selectedFacilities={selectedFacilities} thumbnailSelected={thumbnailSelected} heroSelected={heroSelected} galleryCount={galleryCount} />}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {step > 0 && (
            <button onClick={prev} className="flex w-full items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 sm:w-auto">
              <ArrowLeft className="size-4" /> Kembali
            </button>
          )}
        </div>
        <button onClick={next} className="flex w-full items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 sm:w-auto">
          {step < steps.length - 1 ? 'Lanjut' : 'Simpan Villa'} <ArrowRight className="size-4" />
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

function StepInformasiDasar() {
  return (
    <div className="space-y-5">
      <Field label="Nama Villa" required>
        <input type="text" placeholder="contoh: Villa Bukit Respati" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Slug">
        <input type="text" placeholder="villa-bukit-respati" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500" readOnly />
        <p className="mt-1 text-xs text-gray-400">URL otomatis dibuat dari nama villa dan bisa disesuaikan.</p>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Lokasi" required>
          <input type="text" placeholder="Cisarua, Puncak Bogor" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </Field>
        <Field label="Harga per Malam" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">Rp</span>
            <input type="number" placeholder="2.500.000" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </Field>
      </div>
      <Field label="Kategori">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button key={cat} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
              {cat}
            </button>
          ))}
        </div>
      </Field>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
          <span className="text-sm text-gray-700">Aktif</span>
        </label>
      </div>
      <Field label="Deskripsi Singkat">
        <textarea rows={3} placeholder="Deskripsi villa untuk homepage..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
    </div>
  )
}

function MediaCard({
  label, badge, helper, ratio, selected, galleryCount: _galleryCount,
}: {
  label: string
  badge?: string
  helper: string
  ratio?: string
  selected?: boolean
  galleryCount?: number
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
        {typeof _galleryCount === 'number' && (
          <span className="text-xs font-medium text-gray-400">{_galleryCount} / 20 foto</span>
        )}
      </div>
      {ratio && <p className="mt-2 text-[11px] font-medium text-gray-400">Rasio: {ratio}</p>}
      <div className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-7 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
        <div className="text-center">
          {selected ? (
            <div className="flex items-center justify-center gap-1 text-emerald-600">
              <Check className="size-5" />
              <span className="text-sm font-medium">Sudah dipilih</span>
            </div>
          ) : (
            <>
              <Image className="mx-auto size-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">Klik untuk upload atau drag foto ke sini</p>
              <p className="mt-0.5 text-xs text-gray-300">JPG, PNG, WEBP</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function StepMedia({
  thumbnailSelected, setThumbnailSelected,
  heroSelected, setHeroSelected,
  galleryCount, setGalleryCount,
}: {
  thumbnailSelected: boolean; setThumbnailSelected: (v: boolean) => void
  heroSelected: boolean; setHeroSelected: (v: boolean) => void
  galleryCount: number; setGalleryCount: (v: number) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <MediaCard
          label="Thumbnail Villa"
          badge="Wajib"
          helper="Gambar utama yang tampil di card villa dan daftar rekomendasi."
          ratio="4:3 atau 1:1"
          selected={thumbnailSelected}
        />
        <MediaCard
          label="Hero Detail Villa"
          badge="Wajib"
          helper="Gambar besar yang tampil di halaman detail villa."
          ratio="16:9"
          selected={heroSelected}
        />
        <MediaCard
          label="Galeri Foto Villa"
          helper="Tambahkan beberapa foto untuk memperlihatkan suasana villa, kamar, kolam, dapur, dan area sekitar."
          ratio="Minimal 5 foto — Maksimal 20 foto"
          galleryCount={galleryCount}
        />
      </div>
      <p className="text-center text-xs text-gray-400">Upload gambar akan dihubungkan ke Supabase Storage pada sprint berikutnya.</p>
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

function StepBooking() {
  return (
    <div className="space-y-5">
      <Field label="Nomor WhatsApp Booking">
        <input type="text" placeholder="+62 812-3456-7890" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Check-in Time">
          <input type="time" defaultValue="14:00" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </Field>
        <Field label="Check-out Time">
          <input type="time" defaultValue="12:00" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
        </Field>
      </div>
      <Field label="Minimum Stay (malam)">
        <input type="number" placeholder="1" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Catatan Booking">
        <textarea rows={3} placeholder="Informasi tambahan untuk tamu..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Featured Order / Homepage Priority">
        <input type="number" placeholder="1" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
    </div>
  )
}

function StepSeo({ guests, bedrooms, bathrooms, selectedFacilities, thumbnailSelected, heroSelected, galleryCount }: { guests: string; bedrooms: string; bathrooms: string; selectedFacilities: string[]; thumbnailSelected: boolean; heroSelected: boolean; galleryCount: number }) {
  return (
    <div className="space-y-5">
      <Field label="SEO Title">
        <input type="text" placeholder="Villa Bukit Respati — StayPuncak" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Meta Description">
        <textarea rows={2} placeholder="Nikmati liburan keluarga di Villa Bukit Respati..." className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
      </Field>
      <Field label="Preview URL">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
          <Search className="size-4" />
          staypuncak.com/villa/<span className="text-gray-400">villa-bukit-respati</span>
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
              <span>Thumbnail: {thumbnailSelected ? 'Sudah dipilih' : 'Belum diupload'}</span>
              <span>Hero: {heroSelected ? 'Sudah dipilih' : 'Belum diupload'}</span>
              <span>Galeri: {galleryCount} foto</span>
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
