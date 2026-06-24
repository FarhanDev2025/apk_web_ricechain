import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import VisualBlockchain from '../components/VisualBlockchain';

export default function DashboardPetani({ activeTab }) {
  const {
    currentUser,
    farmers,
    harvests,
    products,
    orders,
    orderDetails,
    blockchain,
    addHarvest
  } = useContext(AppContext);

  // Find farmer profile
  const farmerProfile = farmers.find((f) => f.id_user === currentUser.id_user) || {
    id_petani: 'PET_GUEST',
    alamat: '-',
    no_hp: '-',
    saldo: 0
  };

  // Harvest logging form states
  const [tanggalPanen, setTanggalPanen] = useState(new Date().toISOString().split('T')[0]);
  const [jenisGabah, setJenisGabah] = useState('Pandan Wangi Premium');
  const [jumlahGabah, setJumlahGabah] = useState('');
  const [kualitas, setKualitas] = useState('A');
  const [lokasi, setLokasi] = useState(farmerProfile.alamat.split(',')[1]?.trim() || 'Karanganyar');

  const [notification, setNotification] = useState(null);

  // Filter lists related to this farmer
  const farmerHarvests = harvests.filter((h) => h.id_petani === farmerProfile.id_petani);
  const farmerProducts = products.filter((p) => p.id_petani === farmerProfile.id_petani);

  // Determine orders that contain products of this farmer
  const farmerProductIds = farmerProducts.map((p) => p.id_beras);
  const farmerOrderDetails = orderDetails.filter((d) => farmerProductIds.includes(d.id_beras));
  const farmerOrderIds = [...new Set(farmerOrderDetails.map((d) => d.id_pesanan))];
  const farmerOrders = orders.filter((o) => farmerOrderIds.includes(o.id_pesanan));

  // Blockchain logs related to this farmer
  const farmerBlocks = blockchain.filter(
    (b) =>
      b.id_transaksi.startsWith('PAN') &&
      harvests.find((h) => h.id_panen === b.id_transaksi && h.id_petani === farmerProfile.id_petani)
  );

  // KPI Calculations
  const totalHarvestQty = farmerHarvests.reduce((acc, h) => acc + h.jumlah_gabah, 0);
  const activeProductsCount = farmerProducts.length;
  const farmerBalance = farmerProfile.saldo;
  const completedOrdersCount = farmerOrders.filter((o) => o.status === 'Selesai').length;

  const handleHarvestSubmit = (e) => {
    e.preventDefault();
    if (!jumlahGabah || Number(jumlahGabah) <= 0) {
      alert('Jumlah gabah harus lebih dari 0.');
      return;
    }

    const panenId = addHarvest(
      farmerProfile.id_petani,
      currentUser.nama,
      jumlahGabah,
      kualitas,
      lokasi,
      tanggalPanen
    );

    // Set success notification containing dummy blockchain details
    const blockCreated = blockchain[blockchain.length - 1]; // Visual hint
    setNotification({
      type: 'success',
      title: 'Panen Berhasil Dicatat!',
      message: `Data panen ${panenId} telah terenkripsi dan diverifikasi ke dalam blockchain ledger.`,
      blockIndex: blockchain.length + 1, // Visual placeholder for newly pushed block
      txId: panenId
    });

    // Clear form
    setJumlahGabah('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Panel Petani RiceChain</h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola panen, pantau komoditas beras, audit blockchain ledger, dan periksa saldo escrow.
          </p>
        </div>
        <div className="text-sm font-semibold bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Status Akun: Terverifikasi</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Total Panen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-2xl mb-1">🌾</div>
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Total Panen Padi</span>
          <span className="text-2xl font-extrabold text-slate-800 block mt-1">
            {totalHarvestQty.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-500">kg</span>
          </span>
        </div>
        {/* Produk Aktif */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-2xl mb-1">🛍️</div>
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Produk Beras Aktif</span>
          <span className="text-2xl font-extrabold text-slate-800 block mt-1">
            {activeProductsCount} <span className="text-sm font-normal text-slate-500">Komoditas</span>
          </span>
        </div>
        {/* Saldo Dompet */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-emerald-50 to-white border-emerald-200/50">
          <div className="text-2xl mb-1 text-emerald-600">💸</div>
          <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider block">Saldo Terpenuhi</span>
          <span className="text-2xl font-extrabold text-emerald-600 block mt-1">
            Rp {farmerBalance.toLocaleString('id-ID')}
          </span>
        </div>
        {/* Transaksi Selesai */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-2xl mb-1">✅</div>
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Transaksi Selesai</span>
          <span className="text-2xl font-extrabold text-slate-800 block mt-1">
            {completedOrdersCount} <span className="text-sm font-normal text-slate-500">Pesanan</span>
          </span>
        </div>
      </div>

      {/* Main Tabs Contents */}

      {/* TAB: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Harvests */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span>📋 Riwayat Panen Terakhir</span>
              <span className="text-[10px] text-slate-400 font-mono">PANEN TERJADWAL</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">ID Panen</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Hasil Gabah</th>
                    <th className="py-2.5 px-3">Kualitas</th>
                    <th className="py-2.5 px-3">Lokasi</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {farmerHarvests.length > 0 ? (
                    farmerHarvests.map((h) => (
                      <tr key={h.id_panen} className="text-slate-700 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-900 font-bold">{h.id_panen}</td>
                        <td className="py-3 px-3">{h.tanggal_panen}</td>
                        <td className="py-3 px-3">{h.jumlah_gabah} kg</td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                            Grade {h.kualitas}
                          </span>
                        </td>
                        <td className="py-3 px-3">{h.lokasi}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            h.status === 'Processed'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {h.status === 'Processed' ? 'Selesai Giling' : 'Gabah Kering'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-400">Belum ada catatan panen. Silakan tambahkan pada menu Input Panen.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Blockchain status */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold flex items-center justify-between border-b border-slate-800 pb-3">
              <span>⛓️ Status Blockchain</span>
              <span className="text-[10px] text-emerald-400 font-mono">SECURED</span>
            </h3>
            <div className="space-y-4 text-xs font-medium text-slate-300">
              <p>Setiap entri panen Anda dilindungi oleh tanda tangan kriptografi dan tersambung ke blok ledger global.</p>
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">BLOCKS:</span>
                  <span className="text-slate-200">{blockchain.length} Blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">MY HARVEST BLOCKS:</span>
                  <span className="text-emerald-400">{farmerBlocks.length} Blocks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">LAST HASH:</span>
                  <span className="text-sky-400 truncate w-32 text-right">{blockchain[blockchain.length - 1]?.hash.substring(0, 10)}...</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Ledger RiceChain menjamin tidak ada pihak ketiga yang dapat merekayasa data berat gabah Anda untuk menurunkan grade harga beras.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: INPUT PANEN */}
      {activeTab === 'input_panen' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🌾</span> Input Laporan Panen Padi Baru
            </h3>

            <form onSubmit={handleHarvestSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Tanggal Panen *</label>
                  <input
                    type="date"
                    value={tanggalPanen}
                    onChange={(e) => setTanggalPanen(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Jenis Gabah/Beras *</label>
                  <select
                    value={jenisGabah}
                    onChange={(e) => setJenisGabah(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                  >
                    <option value="Pandan Wangi Premium">Pandan Wangi (Premium)</option>
                    <option value="Cianjur Pulen">Cianjur Pulen (Medium)</option>
                    <option value="Rojolele Organik">Rojolele Organik (Premium)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Jumlah Gabah Kering (Kg) *</label>
                  <input
                    type="number"
                    value={jumlahGabah}
                    onChange={(e) => setJumlahGabah(e.target.value)}
                    placeholder="Contoh: 1500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Kualitas Grade *</label>
                  <select
                    value={kualitas}
                    onChange={(e) => setKualitas(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                  >
                    <option value="A">Grade A (Pecah &lt; 5%)</option>
                    <option value="B">Grade B (Pecah 5% - 15%)</option>
                    <option value="C">Grade C (Pecah &gt; 15%)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Lokasi Lahan Sawah *</label>
                  <input
                    type="text"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors"
              >
                Simpan & Daftarkan ke Blockchain ⛓️
              </button>
            </form>
          </div>

          {/* Verification / Blockchain status node */}
          <div className="space-y-4">
            {notification && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{notification.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notification.message}</p>
                  </div>
                </div>
                {/* Visual block mock */}
                <div className="bg-slate-900 text-white p-4 border border-slate-800 rounded-xl font-mono text-[9px] space-y-1.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-brand-green text-slate-950 font-bold px-2 py-0.5 rounded-bl">
                    VERIFIED
                  </div>
                  <div className="text-sky-400 font-bold">BLOCK #{notification.blockIndex}</div>
                  <div>REFERENCE: {notification.txId}</div>
                  <div>ACTIVITY: Input data panen...</div>
                  <div className="text-slate-500 font-bold truncate">PREV HASH: {blockchain[blockchain.length - 1]?.hash}</div>
                  <div className="text-emerald-400 font-bold truncate">CURR HASH: 0000a{String(Math.random()).substring(2,10)}...</div>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 underline font-semibold"
                >
                  Tutup Notifikasi
                </button>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-slate-800 text-xs mb-2">💡 Tips Pengisian Panen</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Isi laporan panen setelah penimbangan selesai dilakukan di tingkat penggilingan.
                Setelah data disimpan, sistem akan menciptakan log audit anti-manipulasi yang tidak bisa diedit oleh distributor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PRODUK BERAS */}
      {activeTab === 'produk_beras' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">🛍️ Daftar Komoditas Beras Aktif</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">ID Beras</th>
                  <th className="py-2.5 px-3">Jenis Beras</th>
                  <th className="py-2.5 px-3">Kualitas</th>
                  <th className="py-2.5 px-3">Stok Gudang</th>
                  <th className="py-2.5 px-3">Harga Penjual</th>
                  <th className="py-2.5 px-3">Safety Stock</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Indikator Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {farmerProducts.length > 0 ? (
                  farmerProducts.map((p) => {
                    const isLow = p.stok <= p.safety_stock;
                    return (
                      <tr key={p.id_beras} className="text-slate-700 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-900 font-bold">{p.id_beras}</td>
                        <td className="py-3 px-3 font-bold">{p.jenis_beras}</td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                            Grade {p.kualitas}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold">{p.stok} kg</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">Rp {p.harga.toLocaleString('id-ID')} / kg</td>
                        <td className="py-3 px-3">{p.safety_stock} kg</td>
                        <td className="py-3 px-3">
                          {isLow ? (
                            <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold animate-pulse">
                              ⚠️ LOW ALERT
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold">
                              STOK AMAN
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-400">Belum ada produk aktif yang terdaftar di penggilingan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: RIWAYAT TRANSAKSI */}
      {activeTab === 'riwayat_transaksi' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">💸 Transaksi dan Escrow Pembayaran</h3>
            <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">PENDAPATAN TERVERIFIKASI</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">ID Pesanan</th>
                  <th className="py-2.5 px-3">Pembeli</th>
                  <th className="py-2.5 px-3">Tanggal Pesanan</th>
                  <th className="py-2.5 px-3">Detail Beras</th>
                  <th className="py-2.5 px-3">Jumlah (kg)</th>
                  <th className="py-2.5 px-3">Subtotal</th>
                  <th className="py-2.5 px-3">Status Kirim</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Escrow State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {farmerOrders.length > 0 ? (
                  farmerOrders.map((o) => {
                    // Find details and shipping
                    const details = farmerOrderDetails.filter((d) => d.id_pesanan === o.id_pesanan);
                    
                    return details.map((detail, dIdx) => (
                      <tr key={`${o.id_pesanan}-${dIdx}`} className="text-slate-700 hover:bg-slate-50 transition-colors">
                        {dIdx === 0 ? (
                          <>
                            <td className="py-3 px-3 font-mono text-slate-900 font-bold" rowSpan={details.length}>
                              {o.id_pesanan}
                            </td>
                            <td className="py-3 px-3 font-semibold" rowSpan={details.length}>
                              {o.nama_pembeli}
                            </td>
                            <td className="py-3 px-3" rowSpan={details.length}>
                              {o.tanggal}
                            </td>
                          </>
                        ) : null}
                        
                        <td className="py-3 px-3">{detail.jenis_beras}</td>
                        <td className="py-3 px-3 font-bold">{detail.jumlah} kg</td>
                        <td className="py-3 px-3 font-bold text-slate-800">Rp {detail.subtotal.toLocaleString('id-ID')}</td>

                        {dIdx === 0 ? (
                          <>
                            <td className="py-3 px-3" rowSpan={details.length}>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                                o.status === 'Selesai'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : o.status === 'Dikirim'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : o.status === 'Dibatalkan' || o.status === 'Refunded'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono" rowSpan={details.length}>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.pembayaran_status === 'Released'
                                  ? 'bg-emerald-600 text-white shadow shadow-emerald-600/10'
                                  : o.pembayaran_status === 'Hold/Escrow'
                                  ? 'bg-amber-500 text-white font-extrabold'
                                  : 'bg-slate-200 text-slate-500'
                              }`}>
                                {o.pembayaran_status === 'Released' ? '🔒 DANA DICAIRKAN' : '⏳ DITAHAN / ESCROW'}
                              </span>
                            </td>
                          </>
                        ) : null}
                      </tr>
                    ));
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400">Belum ada transaksi pemesanan produk Anda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: RIWAYAT BLOCKCHAIN */}
      {activeTab === 'riwayat_blockchain' && (
        <div className="space-y-4">
          <VisualBlockchain logs={blockchain} />
        </div>
      )}

    </div>
  );
}
