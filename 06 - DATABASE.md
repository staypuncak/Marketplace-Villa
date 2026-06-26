# Database

**Project:** StayPuncak.com

**Version:** 1.0.0

---

# 1. Data Model Overview

Business Domain:

Villa Rental

Core Data Strategy:

Seluruh data berpusat pada Villa sebagai produk utama.

Model data dirancang agar mendukung pertumbuhan menuju sistem multi-owner.

---

# 2. Business Entities

## Owner

Mewakili pemilik villa.

Saat MVP hanya dikelola admin.

Entity ini dipersiapkan untuk Owner Dashboard di masa depan.

---

## Villa

Entity utama.

Menyimpan seluruh informasi villa.

---

## Media

Menyimpan informasi gambar villa.

Satu villa dapat memiliki banyak media.

---

## Booking

Menyimpan permintaan booking.

Booking berasal dari website dan diteruskan melalui WhatsApp.

---

## Customer

Menyimpan informasi calon penyewa.

---

## Admin

Pengguna Dashboard.

---

# 3. Entity Relationships

Owner

↓

Villa

(One to Many)

---

Villa

↓

Media

(One to Many)

---

Villa

↓

Booking

(One to Many)

---

Customer

↓

Booking

(One to Many)

---

Admin

↓

Villa

(Management)

---

# 4. Entity Attributes

## Owner

- Name
    
- Phone
    
- Email
    
- Address
    
- Status
    

---

## Villa

- Name
    
- Slug
    
- Description
    
- Price
    
- Capacity
    
- Location
    
- Google Maps
    
- Status
    

---

## Media

- Villa
    
- Image URL
    
- Cover
    
- Sort Order
    

---

## Booking

- Villa
    
- Customer
    
- Check-in
    
- Check-out
    
- Notes
    
- Status
    

---

## Customer

- Name
    
- Phone
    
- Email
    

---

## Admin

- Name
    
- Email
    
- Role
    

---

# 5. Business Rules

- Setiap Villa memiliki satu Owner.
    
- Satu Owner dapat memiliki banyak Villa.
    
- Satu Villa memiliki banyak Media.
    
- Booking harus memiliki tanggal Check-in dan Check-out.
    
- Booking dilakukan melalui WhatsApp.
    
- Dashboard hanya dapat diakses Admin pada MVP.
    

---

# 6. Security Model

Authentication:

Supabase Auth

Authorization:

Role Based Access

Role MVP:

- Admin
    

Future:

- Owner
    
- Staff
    

---

# 7. Scalability Strategy

Disiapkan untuk:

- Multi Owner
    
- Multi Language
    
- Availability Calendar
    
- Online Payment
    
- Review
    
- Promotion
    

---

# 8. Future Expansion

Entity yang akan ditambahkan:

- Payment
    
- Review
    
- Availability
    
- Promotion
    
- Favorite
    
- Notification
    
- Activity Log
    

Database dirancang agar penambahan entity tersebut tidak memerlukan redesign besar.