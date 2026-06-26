# Decision Log

**Project:** StayPuncak.com

**Version:** 1.0.0

---

# DEC-001

## Title

Business Model Supports Multi-Owner

---

## Status

Approved

---

## Date

2026-06-26

---

## Background

StayPuncak saat ini mengelola beberapa villa milik sendiri, namun sebagian besar villa menggunakan sistem consignment dari pemilik villa lain.

Walaupun Owner Dashboard belum menjadi bagian dari MVP, model bisnis menunjukkan bahwa konsep multi-owner akan menjadi kebutuhan jangka panjang.

---

## Alternatives Considered

### Option A

Mendesain sistem hanya untuk satu owner.

**Pros**

- Lebih cepat.
    

**Cons**

- Membutuhkan redesign besar di masa depan.
    

---

### Option B (Selected)

Sejak awal mengenalkan konsep Owner pada model data dan Architecture.

**Pros**

- Future Ready.
    
- Tidak perlu migrasi besar.
    
- Mendukung pertumbuhan bisnis.
    

**Cons**

- Sedikit lebih kompleks pada tahap awal.
    

---

## Decision

Architecture dan Database harus mengenal entity **Owner** sejak MVP.

Dashboard Owner belum dikembangkan pada fase pertama.

---

## Rationale

Future scalability lebih penting daripada optimasi jangka pendek.

---

## Impact

Affected Documents:

- Architecture
    
- Database
    
- Roadmap
    

---

# DEC-002

## Title

Booking Uses WhatsApp Instead of Online Checkout

---

## Status

Approved

---

## Background

Target utama MVP adalah meningkatkan lead, bukan mengotomatisasi seluruh proses booking.

---

## Alternatives Considered

### Online Checkout

Tidak dipilih karena:

- lebih kompleks
    
- membutuhkan payment gateway
    
- meningkatkan waktu development
    

---

### WhatsApp Booking (Selected)

Customer memilih tanggal.

Data booking dikirim otomatis ke WhatsApp.

---

## Decision

Booking dilakukan melalui WhatsApp.

---

## Rationale

Lebih cepat divalidasi.

Lebih sesuai dengan proses bisnis client saat ini.

---

## Impact

Affected Documents:

- PRD
    
- Architecture
    
- Roadmap
    

---

# DEC-003

## Title

SEO Becomes Primary Growth Strategy

---

## Status

Approved

---

## Background

Client ingin membangun aset digital jangka panjang.

Website bukan sekadar company profile.

---

## Decision

SEO menjadi prioritas utama sejak MVP.

Website dirancang sebagai mesin akuisisi lead.

---

## Rationale

Organic traffic memberikan pertumbuhan yang berkelanjutan.

---

## Impact

Affected Documents:

- PRD
    
- Architecture
    
- Roadmap
    

---

# DEC-004

## Title

Admin Only Dashboard for MVP

---

## Status

Approved

---

## Decision

Dashboard hanya digunakan Admin pada MVP.

Role lain dipersiapkan melalui Architecture.

---

## Rationale

Mengurangi kompleksitas.

Tetap future ready.

---

## Impact

Affected Documents:

- Architecture
    
- Database
    

---

# DEC-005

## Title

Architecture Must Support Future Growth

---

## Status

Approved

---

## Decision

Architecture harus mendukung:

- Multi Owner
    
- Multi Language
    
- Availability Calendar
    
- Owner Dashboard
    
- Online Payment
    

Tanpa redesign besar.

---

## Rationale

MVP dibangun sebagai fondasi, bukan produk sekali pakai.

---

## Impact

Affected Documents:

- Architecture
    
- Database
    
- Roadmap