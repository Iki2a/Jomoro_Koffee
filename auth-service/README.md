# Auth Service

Microservice ini bertanggung jawab atas seluruh proses autentikasi, manajemen pengguna (register/login), dan penerbitan token JWT dalam ekosistem aplikasi **Jomoro Koffee**.

## Spesifikasi Teknis
- **Framework**: NestJS
- **Port Default**: `3001`
- **Database**: MySQL (`jomoro_auth`)
- **ORM**: Prisma

## Fitur Utama
1. **Registrasi User**: Memungkinkan pengguna baru mendaftar (default role: `CUSTOMER`).
2. **Login**: Verifikasi kredensial dan mengembalikan **JWT Token** untuk akses ke endpoint yang diproteksi.
3. **Internal User Info**: Endpoint khusus yang digunakan oleh service lain (seperti Transaction Service) untuk mengambil data profil user via ID.

## Prasyarat
Pastikan MySQL sudah berjalan di perangkat Anda dan sesuaikan pengaturan **port** di dalam file `.env`. Port database tergantung konfigurasi MySQL di perangkat Anda (umumnya `3306` atau `3307`).

```env
# Ganti <PORT_MYSQL> dengan port MySQL Anda (misal: 3306 atau 3307)
DATABASE_URL="mysql://root:@localhost:<PORT_MYSQL>/jomoro_auth"
JWT_SECRET="rahasia_jomoro"
```

## Cara Menjalankan
1. Instal dependensi:
   ```bash
   npm install
   ```
2. Migrasi dan sinkronisasi database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. (Opsional) Jalankan Seeding untuk membuat akun Admin dan Customer bawaan:
   ```bash
   npx ts-node prisma/seed.ts
   ```
4. Jalankan aplikasi (Development):
   ```bash
   npm run start:dev
   ```

## API Documentation
Saat service berjalan, dokumentasi **Swagger UI** dapat diakses di:
[http://localhost:3001/api](http://localhost:3001/api)
