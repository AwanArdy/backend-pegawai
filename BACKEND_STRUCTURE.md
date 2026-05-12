# Spesifikasi Backend & Database (Node.js + MySQL)

Dokumen ini merupakan panduan bagi pengembang untuk membangun Backend terpisah yang kompatibel dengan sistem SIMPEG.

---

## 1. Struktur Folder (Node.js + Express)

Rekomendasi struktur folder menggunakan pola **MVC (Model-View-Controller)** atau **Layered Architecture** agar kode bersih dan mudah dikelola:

```text
simpeg-backend/
├── src/
│   ├── config/             # Koneksi Database (Sequelize/Knex/Pool)
│   ├── controllers/        # Logika penanganan request (HTTP)
│   ├── models/             # Definisi skema tabel MySQL
│   ├── routes/             # Definisi endpoint API
│   ├── middlewares/        # Auth (JWT) & Validasi data
│   ├── services/           # Logika bisnis (hitung pangkat/KGB)
│   ├── utils/              # Helper (format tanggal, dll)
│   └── app.js              # Entry point Express
├── uploads/                # Folder penyimpanan file SK/Dokumen
├── .env                    # Konfigurasi DB_HOST, DB_USER, JWT_SECRET
├── package.json
└── README.md
```

---

## 2. Skema Database (MySQL)

Berikut adalah desain tabel yang dibutuhkan agar sesuai dengan data di Frontend:

### Tabel `users` (Autentikasi)
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| name | VARCHAR(100) | NOT NULL | |
| nip | VARCHAR(20) | UNIQUE, NOT NULL | Digunakan sebagai Username |
| email | VARCHAR(100) | UNIQUE, NOT NULL | |
| password | VARCHAR(255) | NOT NULL | Hashed (Bcrypt) |
| role | ENUM | 'admin', 'pegawai', 'pimpinan' | |
| jabatan | VARCHAR(100) | | |
| avatar | VARCHAR(255) | | URL/Path ke foto profil |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |

### Tabel `master_golongan`
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| kode | VARCHAR(10) | UNIQUE | e.g., IV/e, III/d |
| nama | VARCHAR(100) | | e.g., Pembina Utama |
| ruang | VARCHAR(5) | | e.g., a, b, c, d, e |

### Tabel `master_jabatan`
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| nama | VARCHAR(100) | | |
| tipe | ENUM | 'Struktural', 'Fungsional', 'Pelaksana' | |
| eselon | VARCHAR(10) | | e.g., II.a, III.b, - |

### Tabel `master_unit_kerja`
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| nama | VARCHAR(100) | | |
| kode | VARCHAR(20) | UNIQUE | |
| lokasi | VARCHAR(255) | | |

### Tabel `pegawai` (Data Master)
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| nip | VARCHAR(20) | UNIQUE, NOT NULL | |
| nama | VARCHAR(100) | NOT NULL | |
| jabatan_id | INT | FK (master_jabatan.id) | |
| golongan_id | INT | FK (master_golongan.id) | |
| unit_kerja_id | INT | FK (master_unit_kerja.id) | |
| email | VARCHAR(100) | | |
| phone | VARCHAR(20) | | |
| tmt_pangkat | DATE | | Tanggal terakhir naik pangkat |
| tmt_kgb | DATE | | Tanggal terakhir KGB |
| status | ENUM | 'aktif', 'cuti', 'pensiun' | |
| avatar | VARCHAR(255) | | URL/Path ke foto profil |

### Tabel `approvals` (Workflow)
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| pegawai_id | INT | FK (pegawai.id) | |
| type | ENUM | 'Kenaikan Pangkat', 'KGB', 'Cuti', 'Mutasi', 'Lainnya' | |
| submitted_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | |
| status | ENUM | 'pending', 'approved', 'rejected' | |
| dokumen_url | VARCHAR(255) | | Path ke folder uploads/ |
| catatan | TEXT | | Alasan jika ditolak |

### Tabel `riwayat` (Log Perubahan/History)
| Field | Type | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| id | INT | PK, Auto Increment | |
| pegawai_id | INT | FK (pegawai.id) | |
| type | ENUM | 'pangkat', 'kgb', 'dokumen', 'approval' | |
| title | VARCHAR(255) | | |
| description | TEXT | | |
| date | DATE | | |
| status | ENUM | 'pending', 'approved', 'rejected' | Optional |

---

## 3. Daftar Endpoint API Utama (Requirements)

### Auth
- `POST /api/auth/login`: Mengembalikan Token JWT dan data User.
- `GET /api/auth/me`: Mengambil data user yang sedang login dari token.
- `PUT /api/auth/update-password`: Mengubah password user.

### Dashboard (Analytics)
- `GET /api/dashboard/stats`: Summary (Total Pegawai, Upcoming Pangkat, Upcoming KGB, Pending Approvals).
- `GET /api/dashboard/trends`: Data grafik bulanan Pangkat & KGB.
- `GET /api/dashboard/distribution`: Distribusi pegawai per Golongan/Pangkat.

### Pegawai
- `GET /api/pegawai`: List semua pegawai (filter search, golongan, unit, status).
- `POST /api/pegawai`: Tambah pegawai baru.
- `GET /api/pegawai/:id`: Detail satu pegawai termasuk riwayat.
- `PUT /api/pegawai/:id`: Update data pegawai.
- `DELETE /api/pegawai/:id`: Hapus pegawai.
- `POST /api/pegawai/:id/create-account`: Membuat akun user dari data pegawai.

### Master Data
- `GET /api/master/golongan`: CRUD data master golongan.
- `GET /api/master/jabatan`: CRUD data master jabatan.
- `GET /api/master/unit-kerja`: CRUD data master unit kerja.

### Approval
- `GET /api/approvals`: List pengajuan (filter status: pending, approved, rejected).
- `POST /api/approvals`: Upload dokumen pengajuan.
- `PUT /api/approvals/:id`: Proses keputusan (Approve/Reject) + Update status & riwayat pegawai.

---

## 5. Tahapan Pembangunan (Roadmap)

Agar pembangunan berjalan terstruktur, ikuti urutan langkah berikut:

### Fase 1: Inisialisasi Project & Environment
1.  **Project Setup**: Jalankan `npm init` dan install dependencies utama (`express`, `mysql2`, `sequelize/knex`, `dotenv`, `cors`, `helmet`, `morgan`).
2.  **Struktur Folder**: Buat folder sesuai standar di Bab 1.
3.  **Konfigurasi Database**: Buat file config untuk koneksi ke MySQL dan pastikan koneksi berhasil.
4.  **Error Handling**: Buat middleware global untuk menangani error (500, 404).

### Fase 2: Skema Database & Migrasi
1.  **Model & Migrasi**: Buat file model dan migrasi untuk semua tabel (Users, Master Data, Pegawai, Approvals, Riwayat).
2.  **Relasi**: Pastikan Foreign Key antara `pegawai` ke tabel master terpasang dengan benar.
3.  **Seeding Data Master**: Buat seeder untuk isi awal tabel `master_golongan`, `master_jabatan`, dan `master_unit_kerja` (ambil data dari mock frontend).
4.  **Seeder Admin**: Buat satu user admin awal untuk keperluan testing login.

### Fase 3: Autentikasi & Middleware
1.  **Bcrypt & JWT**: Implementasi hashing password saat register/seeding dan generate token saat login.
2.  **Auth Controller**: Buat endpoint `/api/auth/login` dan `/api/auth/me`.
3.  **Auth Middleware**: Buat middleware untuk memverifikasi JWT dan mengecek role user (RBAC).

### Fase 4: Master Data CRUD
1.  **Implementasi API**: Buat CRUD lengkap untuk Golongan, Jabatan, dan Unit Kerja.
2.  **Validasi**: Tambahkan validasi input agar data master tidak duplikat atau kosong.

### Fase 5: Core Kepegawaian
1.  **CRUD Pegawai**: Implementasi list, detail, create, update, dan delete pegawai.
2.  **Join Queries**: Pastikan endpoint GET pegawai mengembalikan nama golongan/jabatan (bukan hanya ID).
3.  **Search & Filter**: Implementasi pencarian berdasarkan NIP/Nama dan filter berdasarkan unit kerja/status.
4.  **Account Creation**: Buat logika khusus untuk membuat user dari data pegawai (`/api/pegawai/:id/create-account`).

### Fase 6: Workflow Approval & File Upload
1.  **Multer Configuration**: Setup folder `uploads/` dan konfigurasi multer untuk menerima file PDF/Gambar.
2.  **Submission**: Buat endpoint POST `/api/approvals` untuk pegawai mengajukan dokumen.
3.  **Decision Logic**: Buat logic PUT `/api/approvals/:id` untuk pimpinan.
    *   Jika **Approved**: Update data di tabel `pegawai` (misal: jika kenaikan pangkat, update `tmt_pangkat` dan `golongan_id`) serta catat di tabel `riwayat`.
    *   Jika **Rejected**: Simpan alasan penolakan di kolom `catatan`.

### Fase 7: Dashboard & Analytics
1.  **Aggregation Queries**: Buat query SQL (COUNT, GROUP BY) untuk menghitung statistik pegawai.
2.  **Trend Data**: Buat query untuk mendapatkan data kenaikan pangkat/KGB per bulan untuk grafik.
3.  **Distribution**: Buat query sebaran pegawai berdasarkan golongan/ruang.

### Fase 8: Finalisasi & Testing
1.  **API Documentation**: Buat dokumentasi menggunakan Swagger atau Postman Collection.
2.  **Security Audit**: Pastikan tidak ada data sensitif (password) yang bocor di API respons.
3.  **Frontend Integration**: Tes koneksi antara FE React dan BE Express.
