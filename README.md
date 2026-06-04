# Jomoro Koffee — Microservices Backend

Sistem backend berbasis Microservice untuk rantai kedai kopi "Jomoro Koffee". Project ini terdiri dari 3 service NestJS mandiri yang saling berkomunikasi menggunakan protokol HTTP.

---

## 1. Arsitektur & Port Service

| Nama Service | Deskripsi | Port | Database |
|---|---|---|---|
| **Auth Service** | Autentikasi user (Register, Login, Sign JWT token, Internal User Info) | `3001` | `jomoro_auth` |
| **Product Service** | Manajemen Kategori, Produk, Stok/Inventory | `3002` | `jomoro_product` |
| **Transaction Service** | Manajemen Keranjang Belanja (Cart) dan Pesanan (Order/Checkout) | `3003` | `jomoro_transaction` |

*Note: Seluruh database berjalan di MySQL bawaan **XAMPP** pada port **`3307`** (menggunakan user `root` tanpa password).*

---

## 2. Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi, pastikan Anda telah memasang:
1. **Node.js** (v22.16.0 atau versi v18+ yang stabil)
2. **XAMPP** dengan modul **MySQL** berjalan di port **`3307`**.
   *(Jika MySQL Anda berjalan di port default `3306` atau memiliki password tertentu, Anda bisa menyesuaikan berkas `.env` di masing-masing folder service).*

---

## 3. Cara Instalasi & Setup Pertama Kali

Jika database atau package belum di-setup, ikuti langkah berikut:

### A. Instalasi Dependensi
Jalankan perintah berikut di folder masing-masing service untuk mengunduh package (`npm install` sudah dijalankan sebelumnya):
```bash
# Untuk Auth Service
cd auth-service
npm install

# Untuk Product Service
cd ../product-service
npm install

# Untuk Transaction Service
cd ../transaction-service
npm install
```

### B. Sinkronisasi Database (Prisma db push)
Sinkronisasikan skema Prisma ke database MySQL lokal:
```bash
# Auth Service
cd auth-service
npx prisma generate
npx prisma db push

# Product Service
cd ../product-service
npx prisma generate
npx prisma db push

# Transaction Service
cd ../transaction-service
npx prisma generate
npx prisma db push
```

### C. Seeding Data Awal (Opsional)
Kami menyediakan data awal (user admin, user customer, kategori, dan produk kopi) yang dapat langsung dimasukkan ke database:
```bash
# Seed data user di Auth Service
cd auth-service
npx ts-node prisma/seed.ts

# Seed data produk dan kategori di Product Service
cd ../product-service
npx ts-node prisma/seed.ts
```

---

## 4. Cara Menjalankan Microservices

Buka 3 tab terminal terpisah untuk menjalankan masing-masing microservice:

*   **Tab Terminal 1 (Auth Service)**:
    ```bash
    cd auth-service
    npm run start:dev
    ```
*   **Tab Terminal 2 (Product Service)**:
    ```bash
    cd product-service
    npm run start:dev
    ```
*   **Tab Terminal 3 (Transaction Service)**:
    ```bash
    cd transaction-service
    npm run start:dev
    ```

---

## 5. Cara Melihat & Menguji API (Swagger UI)

Setiap microservice telah dilengkapi dengan dokumentasi interaktif **Swagger UI**. Buka peramban (browser) Anda ke alamat berikut:

*   **Auth Service API**: [http://localhost:3001/api](http://localhost:3001/api)
*   **Product Service API**: [http://localhost:3002/api](http://localhost:3002/api)
*   **Transaction Service API**: [http://localhost:3003/api](http://localhost:3003/api)

### Akun Percobaan (Default Credentials):
-   **Admin User**:
    -   Email: `admin@jomoro.com`
    -   Password: `admin1234`
-   **Customer User**:
    -   Email: `customer@jomoro.com`
    -   Password: `customer1234`

---

## 6. Uji Coba Otomatis (E2E Integration Test)

Kami telah menyiapkan script test E2E di root project untuk menguji seluruh alur integrasi antar-layanan (Login -> Detail Profil -> Buat Produk Baru oleh Admin -> Masukkan ke Keranjang Belanja -> Checkout -> Pengurangan Stok Otomatis).

**Cara menjalankan tes:**
1. Pastikan ketiga microservice di atas sudah dalam keadaan berjalan (`running`).
2. Buka terminal baru di folder root project (`D:\JOMORO`).
3. Jalankan perintah:
   ```bash
   node test-e2e.js
   ```
4. Output terminal akan menampilkan log langkah-langkah pengetesan hingga berhasil (`ALL INTEGRATION TESTS PASSED SUCCESSFULLY!`).
