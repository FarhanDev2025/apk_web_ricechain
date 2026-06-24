import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StockChart from '../components/StockChart';
import VisualBlockchain from '../components/VisualBlockchain';

export default function DashboardDistributor({ activeTab }) {
  const {
    harvests,
    millings,
    products,
    orders,
    shippings,
    blockchain,
    addMilling,
    updateShipping,
    cancelOrder
  } = useContext(AppContext);

  // Form states for Milling
  const [selectedHarvestId, setSelectedHarvestId] = useState('');
  const [qtyBerasOut, setQtyBerasOut] = useState('');
  const [dateMilled, setDateMilled] = useState(new Date().toISOString().split('T')[0]);
  const [qualityMilled, setQualityMilled] = useState('A');
  const [targetProductId, setTargetProductId] = useState('');

  // Form states for Shipping
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [courier, setCourier] = useState('SLogistics');
  const [statusKirim, setStatusKirim] = useState('Diperjalanan');
  const [estArrival, setEstArrival] = useState('');
  const [proofAccept, setProofAccept] = useState('');

  const [notification, setNotification] = useState(null);

  // Filter raw harvests for milling select dropdown
  const rawHarvests = harvests.filter((h) => h.status === 'Raw');

  // Low stock products alert list
  const lowStockAlerts = products.filter((p) => p.stok <= p.safety_stock);

  // Incoming orders
  const pendingOrders = orders.filter((o) => o.status === 'Menunggu' || o.status === 'Diproses');
  const activeShippingOrders = orders.filter((o) => o.status === 'Menunggu' || o.status === 'Diproses' || o.status === 'Dikirim');

  const handleMillingSubmit = (e) => {
    e.preventDefault();
    if (!selectedHarvestId || !qtyBerasOut || Number(qtyBerasOut) <= 0 || !targetProductId) {
      alert('Harap isi seluruh field formulir dengan benar.');
      return;
    }

    const gilingId = addMilling(
      selectedHarvestId,
      qtyBerasOut,
      dateMilled,
      qualityMilled,
      targetProductId
    );

    if (gilingId) {
      setNotification({
        type: 'milling',
        title: 'Penggilingan Berhasil Dicatat!',
        message: `Gabah panen ${selectedHarvestId} sukses diproses menjadi ${qtyBerasOut} kg beras (${targetProductId}). Hash transaksi ditambahkan ke Blockchain.`,
        txId: gilingId
      });
      // Reset form
      setSelectedHarvestId('');
      setQtyBerasOut('');
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrderId || !courier || !estArrival) {
      alert('Harap lengkapi detail pengiriman.');
      return;
    }

    updateShipping(selectedOrderId, courier, statusKirim, estArrival, proofAccept);

    setNotification({
      type: 'shipping',
      title: 'Status Logistik Diperbarui!',
      message: `Status logistik pesanan ${selectedOrderId} berhasil diperbarui ke '${statusKirim}' dan dikunci di blockchain.`,
      txId: selectedOrderId
    });

    // Reset form
    setSelectedOrderId('');
    setEstArrival('');
    setProofAccept('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Panel Penggilingan & Distributor Gudang</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pantau persediaan beras, catat hasil giling padi, kelola status pesanan, dan perbarui logistik pengiriman.
          </p>
        </div>
        <div className="text-sm font-semibold bg-sky-50 border border-sky-100 text-sky-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
          <span>Sistem Distribusi: Aktif</span>
        </div>
      </div>

      {/* Alert Notifications */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div className="text-xs font-semibold text-rose-900">
              <h4 className="font-extrabold">LOW STOCK ALERT (Peringatan Stok Rendah)</h4>
              <p className="text-rose-700 mt-0.5">
                Ada {lowStockAlerts.length} komoditas beras dengan volume di bawah Safety Stock: {' '}
                {lowStockAlerts.map(p => `${p.jenis_beras} (${p.stok} kg)`).join(', ')}. Segera lakukan penggilingan gabah baru.
              </p>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div className="text-xs text-emerald-900">
              <h4 className="font-bold">{notification.title}</h4>
              <p className="text-emerald-700 mt-0.5">{notification.message}</p>
              <span className="text-[9px] font-mono block mt-1 bg-white px-2 py-0.5 rounded border border-emerald-200 w-fit">
                TX ID: {notification.txId} | LEDGER OK
              </span>
            </div>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
        </div>
      )}

      {/* TAB: DASHBOARD STOK */}
      {activeTab === 'dashboard_stok' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stock charts component */}
            <StockChart products={products} />

            {/* Inventory table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">📦 Tabel Persediaan Gudang</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                      <th className="py-2.5 px-3 rounded-l-lg">ID Beras</th>
                      <th className="py-2.5 px-3">Jenis Beras</th>
                      <th className="py-2.5 px-3">Petani Mitra</th>
                      <th className="py-2.5 px-3">Stok Gudang</th>
                      <th className="py-2.5 px-3">Safety Limit</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {products.map((p) => {
                      const isLow = p.stok <= p.safety_stock;
                      return (
                        <tr key={p.id_beras} className="text-slate-700 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono text-slate-900 font-bold">{p.id_beras}</td>
                          <td className="py-3 px-3 font-bold">{p.jenis_beras}</td>
                          <td className="py-3 px-3">{p.nama_petani}</td>
                          <td className="py-3 px-3 font-semibold">{p.stok} kg</td>
                          <td className="py-3 px-3">{p.safety_stock} kg</td>
                          <td className="py-3 px-3">
                            {isLow ? (
                              <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                Restock Segera
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                Stok Aman
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column: Raw harvests pending milling */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>🌾 Antrean Gabah Masuk</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">RAW GRAIN</span>
            </h3>

            <div className="space-y-3">
              {rawHarvests.length > 0 ? (
                rawHarvests.map((h) => (
                  <div key={h.id_panen} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-2">
                    <div className="flex justify-between font-mono font-bold text-slate-800 border-b border-slate-200/50 pb-1.5">
                      <span>PANEN ID: {h.id_panen}</span>
                      <span className="text-amber-600">MENUNGGU GILING</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Petani Mitra:</span>
                      <span className="font-semibold text-slate-800">{h.nama_petani}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Berat Gabah:</span>
                      <span className="font-bold text-slate-700">{h.jumlah_gabah} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kualitas:</span>
                      <span>Grade {h.kualitas}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic py-8 text-center">Tidak ada antrean gabah mentah.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROSES GILING */}
      {activeTab === 'penggilingan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milling Logging Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>⚙️</span> Formulir Pencatatan Proses Penggilingan Gabah
            </h3>

            <form onSubmit={handleMillingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Pilih Antrean Panen Gabah *</label>
                  <select
                    value={selectedHarvestId}
                    onChange={(e) => setSelectedHarvestId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  >
                    <option value="">-- Pilih Batch Gabah --</option>
                    {rawHarvests.map((h) => (
                      <option key={h.id_panen} value={h.id_panen}>
                        {h.id_panen} - Petani {h.nama_petani} ({h.jumlah_gabah} kg Grade {h.kualitas})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Target Alokasi Beras *</label>
                  <select
                    value={targetProductId}
                    onChange={(e) => setTargetProductId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  >
                    <option value="">-- Pilih Produk Tujuan --</option>
                    {products.map((p) => (
                      <option key={p.id_beras} value={p.id_beras}>
                        {p.id_beras} - {p.jenis_beras} (Grade {p.kualitas})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Berat Beras Putih Hasil (Kg) *</label>
                  <input
                    type="number"
                    value={qtyBerasOut}
                    onChange={(e) => setQtyBerasOut(e.target.value)}
                    placeholder="Contoh: 1600"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Kualitas Hasil Akhir *</label>
                  <select
                    value={qualityMilled}
                    onChange={(e) => setQualityMilled(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                  >
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Medium)</option>
                    <option value="C">Grade C (Kualitas Rendah)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Tanggal Selesai Giling *</label>
                  <input
                    type="date"
                    value={dateMilled}
                    onChange={(e) => setDateMilled(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors"
              >
                Catat Giling & Update Stok Beras 🚀
              </button>
            </form>
          </div>

          {/* Milling Log list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">📋 Log Giling Terakhir</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {millings.map((m) => (
                <div key={m.id_giling} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-mono font-bold text-slate-800 mb-1">
                    <span>GILING ID: {m.id_giling}</span>
                    <span className="text-sky-600">{m.tanggal_giling}</span>
                  </div>
                  <div>Panen Asal: <span className="font-mono">{m.id_panen}</span></div>
                  <div>Beras Keluar: <span className="font-bold text-sky-700">{m.jumlah_beras} kg</span></div>
                  <div>Kualitas: <span className="font-semibold">Grade {m.kualitas}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: KELOLA PRODUK */}
      {activeTab === 'kelola_produk' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">📦 Kelola Data Katalog Produk & Safety Stock</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">ID Beras</th>
                  <th className="py-2.5 px-3">Jenis Beras</th>
                  <th className="py-2.5 px-3">Kualitas</th>
                  <th className="py-2.5 px-3">Stok Saat Ini</th>
                  <th className="py-2.5 px-3">Harga Mitra</th>
                  <th className="py-2.5 px-3">Safety Stock</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Lokasi Gudang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((p) => (
                  <tr key={p.id_beras} className="text-slate-700 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-900 font-bold">{p.id_beras}</td>
                    <td className="py-3 px-3 font-bold">{p.jenis_beras}</td>
                    <td className="py-3 px-3">Grade {p.kualitas}</td>
                    <td className="py-3 px-3 font-bold">{p.stok} kg</td>
                    <td className="py-3 px-3 font-bold text-slate-800">Rp {p.harga.toLocaleString('id-ID')} / kg</td>
                    <td className="py-3 px-3">{p.safety_stock} kg</td>
                    <td className="py-3 px-3">{p.lokasi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PESANAN MASUK */}
      {activeTab === 'pesanan_masuk' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">📥 Antrean Order & Pembayaran Escrow</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">ID Pesanan</th>
                  <th className="py-2.5 px-3">Pembeli</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Total Harga</th>
                  <th className="py-2.5 px-3">Status Pengiriman</th>
                  <th className="py-2.5 px-3">Escrow Status</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-center">Aksi Batal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((o) => {
                  const shipInfo = shippings.find(s => s.id_pesanan === o.id_pesanan);
                  const canCancel = o.status === 'Menunggu' && o.pembayaran_status === 'Hold/Escrow';
                  return (
                    <tr key={o.id_pesanan} className="text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-900 font-bold">{o.id_pesanan}</td>
                      <td className="py-3 px-3 font-semibold">{o.nama_pembeli}</td>
                      <td className="py-3 px-3">{o.tanggal}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">Rp {o.total_harga.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-3">
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
                      <td className="py-3 px-3 font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          o.pembayaran_status === 'Released'
                            ? 'bg-emerald-600 text-white'
                            : o.pembayaran_status === 'Hold/Escrow'
                            ? 'bg-amber-500 text-white font-extrabold'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {o.pembayaran_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {canCancel ? (
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin membatalkan pesanan ${o.id_pesanan}? Dana akan di-refund.`)) {
                                cancelOrder(o.id_pesanan);
                              }
                            }}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Batal & Refund ↩️
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PENGIRIMAN */}
      {activeTab === 'pengiriman' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>🚚</span> Perbarui Logistik & Dispatch Pengiriman
            </h3>

            <form onSubmit={handleShippingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Pilih ID Pesanan *</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  >
                    <option value="">-- Pilih Pesanan --</option>
                    {activeShippingOrders.map((o) => (
                      <option key={o.id_pesanan} value={o.id_pesanan}>
                        {o.id_pesanan} - {o.nama_pembeli} (Rp {o.total_harga.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Kurir Ekspedisi *</label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    placeholder="Contoh: SLogistics, ExpressCargo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Status Pengiriman *</label>
                  <select
                    value={statusKirim}
                    onChange={(e) => setStatusKirim(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                  >
                    <option value="Dipacking">Dipacking (Warehouse)</option>
                    <option value="Diperjalanan">Diperjalanan (Transit)</option>
                    <option value="Sampai">Sampai di Toko (Delivered)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Estimasi Tiba / Selesai *</label>
                  <input
                    type="date"
                    value={estArrival}
                    onChange={(e) => setEstArrival(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Bukti Terima (Jika Sampai)</label>
                  <input
                    type="text"
                    value={proofAccept}
                    onChange={(e) => setProofAccept(e.target.value)}
                    placeholder="Nama penerima..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-brand-green hover:bg-emerald-500 text-slate-900 font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-colors"
              >
                Kirim Status Logistik & Catat Blockchain 📦
              </button>
            </form>
          </div>

          {/* Current Logistics Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">📍 Status Transit Saat Ini</h3>
            <div className="space-y-3">
              {shippings.map((s) => (
                <div key={s.id_kirim} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-mono font-bold text-slate-800 mb-1">
                    <span>LOG ID: {s.id_kirim}</span>
                    <span className="text-amber-600">{s.status_kirim}</span>
                  </div>
                  <div>Order Reff: <span className="font-mono">{s.id_pesanan}</span></div>
                  <div>Kurir: <span className="font-semibold">{s.kurir}</span></div>
                  <div>Estimasi: <span className="font-semibold">{s.estimasi_tiba}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BLOCKCHAIN LOG */}
      {activeTab === 'blockchain_log' && (
        <div className="space-y-4">
          <VisualBlockchain logs={blockchain} />
        </div>
      )}

    </div>
  );
}
