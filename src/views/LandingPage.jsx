import React from 'react';

export default function LandingPage({ onEnterSystem, onNavigateToTrace }) {
  const problems = [
    { title: 'Melacak Asal Beras Sulit', desc: 'Konsumen kesulitan mengetahui asal padi, kapan dipanen, dan apakah beras bebas bahan kimia berbahaya.', icon: '🔍' },
    { title: 'Perbedaan Data Stok', desc: 'Ketidaksesuaian laporan stok antara petani, penggilingan, dan gudang pusat menimbulkan spekulasi harga.', icon: '📉' },
    { title: 'Keterlambatan Pengiriman', desc: 'Distribusi beras rentan hambatan logistik tanpa sistem pelacakan (real-time tracking) yang terintegrasi.', icon: '🚚' },
    { title: 'Manipulasi Transaksi', desc: 'Kerentanan pemalsuan nota pembelian dan manipulasi kualitas beras di pasar tingkat akhir.', icon: '⚠️' },
    { title: 'Kurangnya Info Kualitas', desc: 'Informasi grade/kualitas beras (Premium/Medium) sering dimanipulasi oleh pihak perantara.', icon: '🌾' }
  ];

  const solutions = [
    { title: 'Blockchain Ledger', desc: 'Mencatat setiap aksi (panen, giling, kirim, bayar) secara permanen & anti-tamper.', icon: '⛓️' },
    { title: 'QR Traceability', desc: 'Pelacakan lengkap asal-usul beras dari sawah hingga piring dengan sekali pindai QR.', icon: '🔍' },
    { title: 'Escrow Payment', desc: 'Dana pembelian ditahan sistem dan hanya dicairkan ke petani setelah beras diterima pembeli.', icon: '🔒' },
    { title: 'Low-Stock Alert', desc: 'Peringatan otomatis saat stok beras berada di bawah batas safety stock untuk re-stock cepat.', icon: '🚨' },
    { title: 'Dashboard Monitoring', desc: 'Akses transparansi logistik & transaksi bagi semua aktor dalam ekosistem supply chain.', icon: '📊' }
  ];

  const supplyChainFlow = [
    { step: 'Petani Input Panen', desc: 'Petani mencatat berat gabah dan tanggal panen ke sistem.', icon: '🚜' },
    { step: 'Penggilingan Proses Gabah', desc: 'Pabrik memproses gabah menjadi beras putih bersih berkualitas.', icon: '⚙️' },
    { step: 'Gudang Kontrol Stok', desc: 'Distributor memantau tingkat stok beras di gudang penyimpanan.', icon: '🏢' },
    { step: 'Distributor Kirim Beras', desc: 'Beras dikirim ke pembeli retail dengan tracking kurir logistik.', icon: '🚚' },
    { step: 'Konsumen Terima Produk', desc: 'Pembeli mengonfirmasi penerimaan barang untuk mencairkan dana.', icon: '🛍️' }
  ];

  const blockchainFlow = [
    { block: 'Block 1: Panen', desc: 'Merekam ID Panen, Petani, Berat Gabah & Hash unik.', color: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
    { block: 'Block 2: Giling', desc: 'Merekam konversi gabah ke beras (kg) & tanggal giling.', color: 'border-sky-500 bg-sky-50 text-sky-700' },
    { block: 'Block 3: Stok', desc: 'Merekam masuknya stok beras ke gudang penyimpanan.', color: 'border-amber-500 bg-amber-50 text-amber-700' },
    { block: 'Block 4: Kirim', desc: 'Merekam ID Pengiriman, nama kurir, & status transit.', color: 'border-indigo-500 bg-indigo-50 text-indigo-700' },
    { block: 'Block 5: Selesai', desc: 'Merekam tanda terima barang & pelepasan dana escrow.', color: 'border-brand-green bg-emerald-50 text-brand-green-dark' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md text-base">
              RC
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-lg tracking-tight block">RiceChain</span>
              <span className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider block">Digital Supply Chain</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onNavigateToTrace}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Lihat Traceability
            </button>
            <button
              onClick={onEnterSystem}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md shadow-emerald-600/10 transition-all duration-200"
            >
              Masuk ke Sistem
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#065f46,transparent_60%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b0f19_1px,transparent_1px),linear-gradient(to_bottom,#0b0f19_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold">
              <span>🌾</span> UTS Analisis & Perancangan TI
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              RiceChain
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light">
              Digital Supply Chain Berbasis Blockchain untuk Distribusi Beras. Transparansi data dari sawah petani hingga ke tangan konsumen.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onEnterSystem}
                className="bg-brand-green hover:bg-emerald-500 text-slate-900 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200"
              >
                Masuk ke Sistem 🚪
              </button>
              <button
                onClick={onNavigateToTrace}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all duration-200"
              >
                Lihat Traceability 🔍
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Visual Blockchain Mock Globe/Network */}
            <div className="w-80 h-80 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center p-8 relative animate-[spin_60s_linear_infinite]">
              <div className="w-full h-full rounded-full border-2 border-emerald-500/40 flex items-center justify-center p-8 animate-[spin_30s_linear_infinite_reverse]">
                <div className="w-full h-full rounded-full bg-emerald-950/80 border border-emerald-500 flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/20 select-none">
                  <span className="text-5xl mb-2">⛓️</span>
                  <span className="text-xs font-mono font-bold tracking-widest text-emerald-400">LEDGER LOCKED</span>
                </div>
              </div>
              <div className="absolute top-0 bg-slate-800 text-emerald-400 p-2 rounded-lg border border-slate-700 text-xs font-mono">
                Block #0672
              </div>
              <div className="absolute bottom-4 right-0 bg-slate-800 text-sky-400 p-2 rounded-lg border border-slate-700 text-xs font-mono">
                Escrow Active
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs text-brand-green-dark font-extrabold uppercase tracking-widest">Masalah Utama</span>
          <h2 className="text-3xl font-extrabold text-slate-800">Mengapa Rantai Pasok Beras Konvensional Bermasalah?</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Sistem tradisional sering kali tidak efisien, rawan pemalsuan data, dan merugikan produsen utama (petani).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {problems.map((p, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="text-3xl bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center">{p.icon}</span>
              <h3 className="font-bold text-slate-800 text-sm leading-snug">{p.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed flex-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs text-brand-green-dark font-extrabold uppercase tracking-widest">Solusi RiceChain</span>
            <h2 className="text-3xl font-extrabold text-slate-800">Solusi Teknologi Blockchain RiceChain</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">Kami mengintegrasikan teknologi terdesentralisasi untuk menciptakan transparansi mutlak.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {solutions.map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4">
                <span className="text-3xl bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600">{s.icon}</span>
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed flex-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supply Chain Flow Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs text-brand-green-dark font-extrabold uppercase tracking-widest">Alur Supply Chain</span>
          <h2 className="text-3xl font-extrabold text-slate-800">Proses Distribusi Fisik Beras</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">Perjalanan beras dari benih hingga sampai ke piring makan konsumen akhir.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
          {supplyChainFlow.map((flow, idx) => {
            const isLast = idx === supplyChainFlow.length - 1;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                {/* Connecting Arrow for Desktop */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 bg-white border border-slate-200 p-1 rounded-full shadow text-[10px] text-slate-400">
                    ➔
                  </div>
                )}
                
                <span className="text-4xl mb-4 bg-emerald-50 p-3 rounded-2xl text-emerald-700">{flow.icon}</span>
                <h4 className="font-bold text-slate-800 text-sm mb-2">{flow.step}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{flow.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blockchain Blocks Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#075985,transparent_55%)] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs text-sky-400 font-extrabold uppercase tracking-widest">Blockchain Ledger</span>
            <h2 className="text-3xl font-extrabold">Audit Log Blockchain: Transparansi Terdistribusi</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Setiap aksi fisik di lapangan langsung memicu penulisan data kriptografis di blockchain ledger.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {blockchainFlow.map((b, idx) => (
              <div key={idx} className={`border-2 p-5 rounded-2xl flex flex-col gap-3 backdrop-blur-sm shadow-lg ${b.color}`}>
                <div className="font-extrabold font-mono text-sm tracking-wider uppercase border-b border-current/20 pb-2 flex justify-between items-center">
                  <span>{b.block}</span>
                  <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded">LOCKED</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed flex-1">{b.desc}</p>
                <div className="mt-2 text-[9px] font-mono text-slate-400 flex flex-col gap-0.5">
                  <span className="truncate">Prev: 0000a{idx + 1}b34...</span>
                  <span className="truncate">Hash: 0000f{idx + 2}c78...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-600/10 text-lg">
              RC
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">RiceChain</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">UTS APTI - Kelompok Prototype</span>
            </div>
          </div>
          <div className="md:text-right text-xs">
            <p>© 2026 RiceChain Digital Supply Chain. All Rights Reserved.</p>
            <p className="text-slate-600 mt-1">Dibuat khusus untuk demonstrasi perkuliahan UTS AP Teknologi Informasi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
