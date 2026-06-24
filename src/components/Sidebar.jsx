import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, role, userName, onLogout }) {
  // Define menus for each role
  const farmerMenu = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'input_panen', name: 'Input Panen', icon: '🌾' },
    { id: 'produk_beras', name: 'Produk Beras', icon: '🛍️' },
    { id: 'riwayat_transaksi', name: 'Riwayat Transaksi', icon: '💸' },
    { id: 'riwayat_blockchain', name: 'Riwayat Blockchain', icon: '🔗' },
  ];

  const distributorMenu = [
    { id: 'dashboard_stok', name: 'Dashboard Stok', icon: '📈' },
    { id: 'penggilingan', name: 'Proses Giling', icon: '⚙️' },
    { id: 'kelola_produk', name: 'Kelola Produk', icon: '📦' },
    { id: 'pesanan_masuk', name: 'Pesanan Masuk', icon: '📥' },
    { id: 'pengiriman', name: 'Pengiriman', icon: '🚚' },
    { id: 'blockchain_log', name: 'Blockchain Log', icon: '⛓️' },
  ];

  const buyerMenu = [
    { id: 'beranda', name: 'Beranda', icon: '🏠' },
    { id: 'katalog', name: 'Katalog Beras', icon: '🌾' },
    { id: 'keranjang', name: 'Keranjang Belanja', icon: '🛒' },
    { id: 'pembayaran_escrow', name: 'Pembayaran Escrow', icon: '🔒' },
    { id: 'tracking', name: 'Lacak Pesanan', icon: '📍' },
    { id: 'scan_traceability', name: 'Scan QR Traceability', icon: '🔍' },
  ];

  const adminMenu = [
    { id: 'control_center', name: 'Control Center', icon: '🛡️' },
    { id: 'verifikasi_pengguna', name: 'Verifikasi Pengguna', icon: '✅' },
    { id: 'laporan', name: 'Laporan Sistem', icon: '📑' },
    { id: 'audit_blockchain', name: 'Audit Blockchain', icon: '🔗' },
    { id: 'finansial', name: 'Finansial & Escrow', icon: '💰' },
  ];

  let menuItems = [];
  let roleTitle = '';
  let roleBg = '';

  switch (role) {
    case 'petani':
      menuItems = farmerMenu;
      roleTitle = 'Petani';
      roleBg = 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      break;
    case 'distributor':
      menuItems = distributorMenu;
      roleTitle = 'Distributor & Mill';
      roleBg = 'bg-sky-500/10 text-sky-600 border border-sky-500/20';
      break;
    case 'pembeli':
      menuItems = buyerMenu;
      roleTitle = 'Pembeli / Toko';
      roleBg = 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20';
      break;
    case 'admin':
      menuItems = adminMenu;
      roleTitle = 'System Admin';
      roleBg = 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      break;
    default:
      break;
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col shadow-xl border-r border-slate-800">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-600/30 text-lg">
          RC
        </div>
        <div>
          <span className="font-extrabold text-white text-xl tracking-tight block">RiceChain</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Blockchain Ledger</span>
        </div>
      </div>

      {/* User Info card */}
      <div className="p-4 mx-4 my-4 bg-slate-800/50 rounded-xl border border-slate-700/40 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase">
            {userName ? userName.charAt(0) : 'U'}
          </div>
          <div className="overflow-hidden">
            <span className="font-semibold text-slate-200 block truncate text-sm">{userName}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block ${roleBg} mt-1`}>
              {roleTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <span>🚪</span>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
