# Transaction Service

Microservice ini menangani fitur *e-commerce* utama dalam aplikasi **Jomoro Koffee**, seperti pengelolaan keranjang belanja (Cart), proses pemesanan (Checkout/Orders), dan pengambilan profil pelanggan. Service ini membutuhkan validasi dari Auth Service (melalui JWT) dan berinteraksi secara internal dengan Product Service (untuk cek dan potong stok).

## Spesifikasi Teknis
- **Framework**: NestJS
- **Port Default**: `3003`
- **Database**: MySQL (`jomoro_transaction`)
- **ORM**: Prisma

## Fitur Utama
1. **Cart Management**: Memungkinkan `CUSTOMER` untuk menambah, mengubah *quantity*, dan menghapus produk di keranjang belanja.
2. **Orders & Checkout**: Proses mengubah keranjang belanja menjadi pesanan resmi. Memanggil API Product Service di *background* untuk mengurangi stok produk.
3. **User Profile**: Menyajikan profil detail untuk `CUSTOMER` yang sedang login (dengan memanggil endpoint internal Auth Service).

## Prasyarat
Pastikan MySQL sudah berjalan di perangkat Anda dan sesuaikan pengaturan **port** di dalam file `.env`. Port database tergantung konfigurasi MySQL di perangkat Anda (umumnya `3306` atau `3307`).

```env
# Ganti <PORT_MYSQL> dengan port MySQL Anda (misal: 3306 atau 3307)
DATABASE_URL="mysql://root:@localhost:<PORT_MYSQL>/jomoro_transaction"
JWT_SECRET="rahasia_jomoro"
# JWT_SECRET harus sama dengan service lain untuk men-decode token
```
*Note: Pastikan Auth Service dan Product Service juga berjalan, karena service ini melakukan HTTP call internal ke `localhost:3001` dan `localhost:3002`.*

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
3. Jalankan aplikasi (Development):
   ```bash
   npm run start:dev
   ```

## API Documentation
Saat service berjalan, dokumentasi **Swagger UI** dapat diakses di:
[http://localhost:3003/api](http://localhost:3003/api)
