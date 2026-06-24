import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import VisualBlockchain from '../components/VisualBlockchain';

export default function DashboardAdmin({ activeTab }) {
  const {
    users,
    farmers,
    harvests,
    millings,
    products,
    orders,
    shippings,
    blockchain,
    verifyUser,
    resetPrototypeData
  } = useContext(AppContext);

  const [notification, setNotification] = useState(null);

  // Stats Calculations
  const totalUsers = users.length;
  const farmersCount = users.filter((u) => u.role === 'petani').length;
  const distributorsCount = users.filter((u) => u.role === 'distributor').length;
  const buyersCount = users.filter((u) => u.role === 'pembeli').length;
  const totalTransactions = orders.length;
  const totalShipped = shippings.filter((s) => s.status_kirim === 'Sampai' || s.status_kirim === 'Diperjalanan').length;

  // Financial calculations
  const totalEscrowHeld = orders
    .filter((o) => o.pembayaran_status === 'Hold/Escrow')
    .reduce((acc, o) => acc + o.total_harga, 0);

  const totalSettled = orders
    .filter((o) => o.pembayaran_status === 'Released')
    .reduce((acc, o) => acc + o.total_harga, 0);

  const totalRefunded = orders
    .filter((o) => o.pembayaran_status === 'Refunded')
    .reduce((acc, o) => acc + o.total_harga, 0);

  // Platform commission (e.g. 1.5% of settled transactions)
  const platformCommission = totalSettled * 0.015;

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin me-reset seluruh data prototype RiceChain kembali ke setelan pabrik?')) {
      resetPrototypeData();
      alert('Prototype data has been reset to default state.');
      window.location.reload();
    }
  };

  const handleVerify = (userId, name) => {
    verifyUser(userId, true);
    setNotification({
      type: 'verify',
      message: `Pengguna ${name} (${userId}) berhasil diverifikasi dan sekarang dapat login.`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUnverify = (userId, name) => {
    verifyUser(userId, false);
    setNotification({
      type: 'verify',
      message: `Aktivasi akun ${name} ditangguhkan.`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Admin Control Center & Audit Ledger</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan panel ini untuk mengelola verifikasi aktor supply chain, mengaudit ledger blockchain secara utuh, dan memantau status escrow pembayaran.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-colors"
        >
          Reset Data Prototype 🗑️
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-xs font-semibold text-emerald-900 animate-fadeIn">
          ✅ {notification.message}
        </div>
      )}

      {/* TAB: CONTROL CENTER */}
      {activeTab === 'control_center' && (
        <div className="space-y-6">
          {/* KPI Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <span className="text-xl block">👥</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mt-1">Total Users</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-0.5">{totalUsers}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <span className="text-xl block">🚜</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mt-1">Petani</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-0.5">{farmersCount}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <span className="text-xl block">⚙️</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mt-1">Distributor</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-0.5">{distributorsCount}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <span className="text-xl block">🛍️</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mt-1">Pembeli</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-0.5">{buyersCount}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <span className="text-xl block">💸</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mt-1">Transaksi</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-0.5">{totalTransactions}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <span className="text-xl block">🚚</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block mt-1">Logistik</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-0.5">{totalShipped}</span>
            </div>
          </div>

          {/* Quick Blockchain Auditor summary */}
          <VisualBlockchain logs={blockchain} limit={5} />
        </div>
      )}

      {/* TAB: VERIFIKASI PENGGUNA */}
      {activeTab === 'verifikasi_pengguna' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">👤 Verifikasi Registrasi Pengguna Baru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">ID User</th>
                  <th className="py-2.5 px-3">Nama</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status Verifikasi</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-center">Aksi Aktor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id_user} className="text-slate-700 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-900 font-bold">{u.id_user}</td>
                    <td className="py-3 px-3 font-bold">{u.nama}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{u.email}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'petani'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.role === 'distributor'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.verified ? (
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="text-rose-500 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                          Menunggu Approval
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {u.role === 'admin' ? (
                        <span className="text-slate-400 font-medium text-[10px]">System bypass</span>
                      ) : u.verified ? (
                        <button
                          onClick={() => handleUnverify(u.id_user, u.nama)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 py-1 px-2.5 rounded font-bold"
                        >
                          Tangguhkan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(u.id_user, u.nama)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2.5 rounded font-bold shadow"
                        >
                          Setujui & Aktifkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: LAPORAN */}
      {activeTab === 'laporan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grain distribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">🚜 Ringkasan Produksi Padi Mentah</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">ID Panen</th>
                    <th className="py-2.5 px-3">Petani</th>
                    <th className="py-2.5 px-3">Jumlah Gabah</th>
                    <th className="py-2.5 px-3">Kualitas</th>
                    <th className="py-2.5 px-3 rounded-r-lg">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {harvests.map((h) => (
                    <tr key={h.id_panen}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{h.id_panen}</td>
                      <td className="py-2.5 px-3">{h.nama_petani}</td>
                      <td className="py-2.5 px-3 font-bold">{h.jumlah_gabah} kg</td>
                      <td className="py-2.5 px-3">Grade {h.kualitas}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${h.status === 'Processed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-800'}`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Logistics Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">🚚 Monitoring Logistik & Kurir</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">LOG ID</th>
                    <th className="py-2.5 px-3">Order Ref</th>
                    <th className="py-2.5 px-3">Ekspedisi</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Estimasi Tiba</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {shippings.map((s) => (
                    <tr key={s.id_kirim}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.id_kirim}</td>
                      <td className="py-2.5 px-3 font-mono">{s.id_pesanan}</td>
                      <td className="py-2.5 px-3 font-semibold">{s.kurir}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${s.status_kirim === 'Sampai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {s.status_kirim}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{s.estimasi_tiba}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: AUDIT BLOCKCHAIN */}
      {activeTab === 'audit_blockchain' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">⛓️ Audit Kriptografis Blockchain Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">Daftar blok log transaksi yang dicatat secara sekuensial. Previous Hash mengunci data blok sebelumnya.</p>
              </div>
              <span className="text-[10px] bg-slate-900 text-sky-400 font-mono font-bold px-2 py-1 rounded">
                LEDGER SECURE (VERIFIED)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left text-slate-600">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">Block ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Ref ID</th>
                    <th className="py-2.5 px-3">Aktivitas / Payload</th>
                    <th className="py-2.5 px-3">Block Hash</th>
                    <th className="py-2.5 px-3 rounded-r-lg">Previous Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {blockchain.map((b) => (
                    <tr key={b.id_block} className="text-slate-700 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-sky-600 text-center bg-slate-50/50">#{b.id_block}</td>
                      <td className="py-3 px-3 text-[10px] text-slate-500">{b.timestamp}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{b.id_transaksi}</td>
                      <td className="py-3 px-3 font-sans font-medium text-slate-900">{b.aktivitas}</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold" title={b.hash}>{b.hash.substring(0, 16)}...</td>
                      <td className="py-3 px-3 text-slate-400" title={b.previous_hash}>{b.previous_hash.substring(0, 16)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FINANSIAL */}
      {activeTab === 'finansial' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Escrow financial state */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>💰</span> Laporan Keuangan Escrow & Settlement
            </h3>

            {/* Financial summary blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-xl text-xs">
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Total Dana Hold Escrow</span>
                <span className="text-lg font-extrabold text-amber-600 mt-1 block">
                  Rp {totalEscrowHeld.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Mengamankan pengiriman aktif</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200/50 p-4 rounded-xl text-xs">
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Total Settlement Petani</span>
                <span className="text-lg font-extrabold text-emerald-600 mt-1 block">
                  Rp {totalSettled.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Telah cair ke rekening petani</span>
              </div>
              <div className="bg-red-50 border border-red-200/50 p-4 rounded-xl text-xs">
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Total Dana Refunded</span>
                <span className="text-lg font-extrabold text-red-600 mt-1 block">
                  Rp {totalRefunded.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Kembali akibat pembatalan</span>
              </div>
            </div>

            {/* Invoices detail */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Tabel Ledger Invoice Pembayaran</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                      <th className="py-2.5 px-3 rounded-l-lg">ID Pesanan</th>
                      <th className="py-2.5 px-3">Pembeli</th>
                      <th className="py-2.5 px-3">Subtotal</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Status Escrow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {orders.map((o) => (
                      <tr key={o.id_pesanan} className="text-slate-700 hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{o.id_pesanan}</td>
                        <td className="py-2.5 px-3">{o.nama_pembeli}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">Rp {o.total_harga.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.pembayaran_status === 'Released'
                              ? 'bg-emerald-600 text-white'
                              : o.pembayaran_status === 'Hold/Escrow'
                              ? 'bg-amber-500 text-white font-extrabold'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {o.pembayaran_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Platform commissions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">🏢 Komisi Platform RiceChain</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Biaya Layanan Platform (1.5%)</span>
              <span className="text-2xl font-extrabold text-emerald-600 block">
                Rp {platformCommission.toLocaleString('id-ID')}
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                Dihitung secara otomatis oleh jaringan blockchain dari setiap transaksi bernilai Released (Dana Sukses Dicairkan).
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
