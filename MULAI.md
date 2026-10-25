# Visual Search Lab — Panduan Instalasi & Menjalankan Aplikasi

## Prasyarat

Pastikan Node.js sudah terinstal di komputer Anda.

- Unduh Node.js dari: https://nodejs.org (pilih versi LTS)
- Setelah instalasi, restart terminal/Command Prompt
- Verifikasi dengan menjalankan: `node --version` dan `npm --version`

---

## Cara Menjalankan (Development)

Buka Command Prompt atau PowerShell, lalu jalankan perintah berikut:

```
cd "d:\Kiro\tictactoeqaila\TicTacToe\visual-search-lab"
npm install
npm run dev
```

Setelah `npm run dev` berjalan, buka browser dan kunjungi:
```
http://localhost:5173
```

---

## Cara Build (Produksi)

```
npm run build
npm run preview
```

File hasil build akan ada di folder `dist/`.

---

## Struktur Proyek

```
visual-search-lab/
├── src/
│   ├── types/
│   │   └── experiment.ts          # Semua tipe data TypeScript
│   ├── engine/
│   │   ├── stimulusGenerator.ts   # Generator objek stimulus (seeded RNG)
│   │   ├── trialScheduler.ts      # Penjadwalan 128 percobaan
│   │   ├── reactionTime.ts        # Pengukuran RT dengan performance.now()
│   │   └── experimentController.ts # CRUD sesi eksperimen
│   ├── analysis/
│   │   ├── statistics.ts          # Mean, median, SD, akurasi
│   │   ├── linearRegression.ts    # Regresi linear OLS
│   │   └── searchSlope.ts         # Search Slope + interpretasi otomatis
│   ├── storage/
│   │   ├── sessionStorage.ts      # localStorage CRUD
│   │   └── csvExport.ts           # Ekspor data mentah & ringkasan CSV
│   ├── components/
│   │   ├── Header.tsx             # Navigasi header
│   │   ├── StimulusBoard.tsx      # Area pencarian objek (SVG shapes)
│   │   ├── TrialProgress.tsx      # Indikator kemajuan percobaan
│   │   ├── StatCard.tsx           # Kartu statistik
│   │   ├── ReactionTimeChart.tsx  # Grafik RT vs Set Size (Recharts)
│   │   ├── AccuracyChart.tsx      # Grafik akurasi (Recharts)
│   │   └── TrialTable.tsx         # Tabel data percobaan
│   ├── pages/
│   │   ├── HomePage.tsx           # Beranda
│   │   ├── SetupPage.tsx          # Pengaturan eksperimen
│   │   ├── ExperimentPage.tsx     # Layar eksperimen utama
│   │   ├── ResultsPage.tsx        # Hasil & analisis
│   │   ├── TheoryPage.tsx         # Landasan teori
│   │   └── HistoryPage.tsx        # Riwayat sesi
│   ├── App.tsx                    # Root komponen + navigasi
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind CSS
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## Fitur Aplikasi

- Feature Search & Conjunction Search
- 128 percobaan utama (2 kondisi × 4 set size × 2 target status × 8 repetisi)
- 10 percobaan latihan sebelum eksperimen
- Pengukuran waktu reaksi dengan `performance.now()`
- Search Slope via regresi linear
- Grafik hubungan Set Size vs Waktu Reaksi
- Ekspor data ke CSV (data mentah + ringkasan)
- Penyimpanan data di localStorage (tidak hilang saat refresh)
- Riwayat sesi dengan statistik singkat
