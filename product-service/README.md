# Product Service

Microservice ini menangani semua operasi yang berkaitan dengan manajemen katalog, produk, kategori, dan pengaturan inventori/stok dalam ekosistem **Jomoro Koffee**.

## Spesifikasi Teknis
- **Framework**: NestJS
- **Port Default**: `3002`
- **Database**: MySQL (`jomoro_product`)
- **ORM**: Prisma

## Fitur Utama
1. **Public Catalog**: Endpoint terbuka untuk (`Guest`) melihat semua kategori dan daftar produk.
2. **Product Management**: Endpoint khusus `ADMIN` untuk menambah, mengubah, atau menghapus produk.
3. **Stock Management**: API untuk mengatur dan mengurangi jumlah stok ketika checkout terjadi (dapat dipanggil oleh Transaction Service).

## Prasyarat
Pastikan MySQL sudah berjalan di perangkat Anda dan sesuaikan pengaturan **port** di dalam file `.env`. Port database tergantung konfigurasi MySQL di perangkat Anda (umumnya `3306` atau `3307`).

```env
# Ganti <PORT_MYSQL> dengan port MySQL Anda (misal: 3306 atau 3307)
DATABASE_URL="mysql://root:@localhost:<PORT_MYSQL>/jomoro_product"
JWT_SECRET="rahasia_jomoro" 
# JWT_SECRET harus sama dengan Auth Service agar guard bisa memvalidasi token
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
3. (Opsional) Jalankan Seeding untuk memasukkan beberapa kategori dan produk kopi bawaan:
   ```bash
   npx ts-node prisma/seed.ts
   ```
4. Jalankan aplikasi (Development):
   ```bash
   npm run start:dev
   ```

## API Documentation
Saat service berjalan, dokumentasi **Swagger UI** dapat diakses di:
[http://localhost:3002/api](http://localhost:3002/api)
