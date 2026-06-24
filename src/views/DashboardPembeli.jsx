import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import TraceabilityQR from '../components/TraceabilityQR';

export default function DashboardPembeli({ activeTab, setActiveTab }) {
  const {
    currentUser,
    products,
    orders,
    orderDetails,
    shippings,
    blockchain,
    placeOrder,
    confirmDelivery,
    cancelOrder
  } = useContext(AppContext);

  // Cart state
  const [cart, setCart] = useState([]);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Notifications
  const [notification, setNotification] = useState(null);

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.jenis_beras.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuality = selectedQuality ? p.kualitas === selectedQuality : true;
    const matchesPrice = maxPrice ? p.harga <= Number(maxPrice) : true;
    const matchesLocation = selectedLocation ? p.lokasi.toLowerCase() === selectedLocation.toLowerCase() : true;
    return matchesSearch && matchesQuality && matchesPrice && matchesLocation;
  });

  // Unique locations for filter dropdown
  const locations = [...new Set(products.map((p) => p.lokasi))];

  // Buyer orders
  const buyerOrders = orders.filter((o) => o.id_pembeli === currentUser.id_user);

  // Helper calculations
  const totalCartPrice = cart.reduce((acc, item) => acc + item.harga * item.quantity, 0);
  const activeEscrows = buyerOrders.filter((o) => o.pembayaran_status === 'Hold/Escrow');
  const escrowTotalValue = activeEscrows.reduce((acc, o) => acc + o.total_harga, 0);

  // Add to Cart
  const handleAddToCart = (product) => {
    if (product.stok <= 0) {
      alert('Stok beras tidak mencukupi.');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id_beras === product.id_beras);
      if (existing) {
        if (existing.quantity >= product.stok) {
          alert('Anda tidak bisa menambahkan melebihi stok yang tersedia.');
          return prev;
        }
        return prev.map((item) =>
          item.id_beras === product.id_beras ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setNotification({
      type: 'cart',
      message: `${product.jenis_beras} ditambahkan ke keranjang.`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (prodId, change) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id_beras === prodId) {
            const nextQty = item.quantity + change;
            if (nextQty <= 0) return null;
            // Check stock limit
            const productRef = products.find(p => p.id_beras === prodId);
            if (productRef && nextQty > productRef.stok) {
              alert('Batas stok terlampaui.');
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Place Order
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const orderId = placeOrder(currentUser.id_user, currentUser.nama, cart);

    setNotification({
      type: 'checkout',
      title: 'Pemesanan Berhasil & Escrow Aktif!',
      message: `Pesanan ${orderId} telah dibuat. Dana sejumlah Rp ${totalCartPrice.toLocaleString('id-ID')} ditahan aman di escrow blockchain ledger.`,
      txId: orderId
    });

    // Clear cart and navigate
    setCart([]);
    setActiveTab('pembayaran_escrow');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Panel Pembeli / Toko Retail</h2>
          <p className="text-xs text-slate-500 mt-1">
            Telusuri katalog beras terverifikasi, beli beras via pembayaran escrow aman, dan telusuri traceability panen.
          </p>
        </div>
        <div className="text-sm font-semibold bg-indigo-50 border border-indigo-100 text-indigo-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Sistem Escrow Terkunci</span>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && notification.type !== 'cart' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div className="text-xs text-emerald-900">
              <h4 className="font-bold">{notification.title}</h4>
              <p className="text-emerald-700 mt-0.5">{notification.message}</p>
              {notification.txId && (
                <span className="text-[9px] font-mono block mt-1 bg-white px-2 py-0.5 rounded border border-emerald-200 w-fit">
                  TX HASH REFERENCE: {notification.txId}
                </span>
              )}
            </div>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
        </div>
      )}

      {notification && notification.type === 'cart' && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white border border-slate-800 text-xs px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <span>🛒</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* TAB: BERANDA */}
      {activeTab === 'beranda' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Escrow Explanation Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-9xl opacity-10">🔒</div>
              <div className="relative z-10 space-y-4">
                <span className="text-[9px] bg-emerald-800 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Escrow Payment Security
                </span>
                <h3 className="text-xl font-bold">Bagaimana Pembayaran Escrow Menjaga Anda?</h3>
                <p className="text-xs text-emerald-100 leading-relaxed font-light">
                  Di RiceChain, uang Anda tidak langsung dikirim ke penjual/petani. Saat Anda checkout, dana ditahan oleh smart contract/sistem escrow.
                  Setelah beras dikirim kurir dan Anda klik <strong>"Konfirmasi Barang Diterima"</strong>, dana baru dicairkan. Ini menjamin Anda terhindar dari penipuan.
                </p>
                <div className="flex gap-4 pt-1 text-[11px] font-semibold text-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <span>1. Checkout</span>
                    <span>➔</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>2. Dana Hold</span>
                    <span>➔</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>3. Barang Sampai</span>
                    <span>➔</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>4. Dana Cair</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-500 text-xs font-semibold block uppercase">Dana Escrow Ditahan</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                  Rp {escrowTotalValue.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block font-medium">Dari {activeEscrows.length} pesanan aktif</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-500 text-xs font-semibold block uppercase">Total Transaksi</span>
                <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                  {buyerOrders.length} <span className="text-sm font-normal text-slate-500">Invoice</span>
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block font-medium">Riwayat belanja terdaftar di ledger</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">💡 Tips Keamanan Beras</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Sebelum melakukan checkout, pastikan Anda memeriksa Batch ID produk di katalog. Pindai QR Traceability untuk menjamin beras yang Anda beli berasal dari daerah bebas hama dan diproses secara higienis di mitra penggilingan terdaftar.
            </p>
          </div>
        </div>
      )}

      {/* TAB: KATALOG */}
      {activeTab === 'katalog' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {/* Search query */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari jenis beras..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-brand-green"
              />
              {/* Quality */}
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none"
              >
                <option value="">Semua Kualitas (Grade)</option>
                <option value="A">Grade A (Premium)</option>
                <option value="B">Grade B (Medium)</option>
              </select>
              {/* Price range */}
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Harga Maksimal / kg"
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none"
              />
              {/* Location */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none"
              >
                <option value="">Semua Lokasi Petani</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {(searchQuery || selectedQuality || maxPrice || selectedLocation) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedQuality('');
                  setMaxPrice('');
                  setSelectedLocation('');
                }}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Reset Filter ✕
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const isOutOfStock = p.stok <= 0;
                return (
                  <div key={p.id_beras} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                    <div className="p-5 space-y-4">
                      {/* Badge / Quality */}
                      <div className="flex justify-between items-start">
                        <span className="bg-slate-100 text-slate-600 font-mono font-bold text-[9px] px-2 py-0.5 rounded">
                          BATCH: {p.id_beras}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                          Grade {p.kualitas === 'A' ? 'A (Premium)' : 'B (Medium)'}
                        </span>
                      </div>

                      {/* Info Rice */}
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-base">{p.jenis_beras}</h4>
                        <span className="text-[10px] text-slate-400 mt-1 block">Petani Mitra: {p.nama_petani}</span>
                      </div>

                      {/* Location & Stok */}
                      <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-100 py-3">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Asal Sawah</span>
                          <span className="font-semibold text-slate-700">{p.lokasi}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Stok Tersedia</span>
                          <span className={`font-bold ${p.stok <= p.safety_stock ? 'text-amber-600' : 'text-slate-700'}`}>
                            {p.stok} kg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Price and Buy action */}
                    <div className="p-5 pt-0 flex items-center justify-between bg-slate-50 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Harga</span>
                        <span className="font-extrabold text-brand-green-dark text-base">
                          Rp {p.harga.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">/ kg</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(p)}
                        disabled={isOutOfStock}
                        className={`text-xs font-bold px-4 py-2 rounded-xl shadow transition-all duration-200 ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isOutOfStock ? 'Stok Habis' : 'Beli Beras 🛒'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 py-16 text-center text-slate-400">
                <span className="text-3xl block mb-2">🔍</span>
                <p className="text-sm font-bold">Produk beras tidak ditemukan.</p>
                <p className="text-xs">Cobalah mengganti kata kunci pencarian atau mengubah filter kualitas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: KERANJANG */}
      {activeTab === 'keranjang' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items list */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>🛒 Keranjang Belanja</span>
              <span className="text-xs bg-emerald-50 text-brand-green-dark px-2.5 py-0.5 rounded-full font-bold">
                {cart.length} Jenis Produk
              </span>
            </h3>

            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id_beras} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800">{item.jenis_beras}</h4>
                      <div className="text-[10px] text-slate-400">
                        Batch: <span className="font-mono">{item.id_beras}</span> | Asal: {item.lokasi} | Kualitas: Grade {item.kualitas}
                      </div>
                      <span className="font-bold text-brand-green-dark block mt-1">
                        Rp {item.harga.toLocaleString('id-ID')} / kg
                      </span>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => handleUpdateCartQty(item.id_beras, -1)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 font-bold text-slate-800 text-xs">{item.quantity} kg</span>
                        <button
                          onClick={() => handleUpdateCartQty(item.id_beras, 1)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right min-w-[5rem]">
                        <span className="text-[10px] text-slate-400 block">Subtotal</span>
                        <span className="font-bold text-slate-800 text-sm">
                          Rp {(item.harga * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                <span className="text-3xl block mb-2">🛒</span>
                <p className="font-bold">Keranjang Anda masih kosong.</p>
                <p className="mt-1">Silakan tambahkan produk beras dari menu Katalog Beras.</p>
              </div>
            )}
          </div>

          {/* Summary / Checkout Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit space-y-4">
            <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">📦 Ringkasan Pembayaran</h4>
            
            <div className="text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Barang:</span>
                <span className="font-semibold text-slate-700">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Biaya Platform (Blockchain Audit Fee):</span>
                <span className="font-semibold text-emerald-600">Rp 0 (FREE UTS)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-sm border-t border-slate-100 pt-3">
                <span>Total Harga:</span>
                <span className="text-brand-green-dark">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full text-xs font-bold py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2 ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>🔒</span>
              <span>Checkout via Escrow Payment</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Setelah checkout, dana Anda ditahan di escrow ledger. Kami menjamin transaksi 100% aman hingga barang diterima.
            </p>
          </div>
        </div>
      )}

      {/* TAB: PEMBAYARAN ESCROW */}
      {activeTab === 'pembayaran_escrow' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">🔒 Simulasi Pembayaran Escrow</h3>
            <p className="text-slate-500 text-xs mt-0.5">Tinjau dana escrow dan lepas ke penjual setelah produk sampai dengan baik.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-2.5 px-3 rounded-l-lg">ID Pesanan</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Total Nilai</th>
                  <th className="py-2.5 px-3">Status Kirim</th>
                  <th className="py-2.5 px-3">Dana Status</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-center">Konfirmasi Penerimaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {buyerOrders.length > 0 ? (
                  buyerOrders.map((o) => {
                    const isEscrow = o.pembayaran_status === 'Hold/Escrow';
                    const ship = shippings.find(s => s.id_pesanan === o.id_pesanan);
                    const canConfirm = o.status === 'Dikirim' || o.status === 'Selesai' || ship?.status_kirim === 'Sampai';
                    
                    return (
                      <tr key={o.id_pesanan} className="text-slate-700 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-900 font-bold">{o.id_pesanan}</td>
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
                        <td className="py-3 px-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.pembayaran_status === 'Released'
                              ? 'bg-emerald-600 text-white'
                              : o.pembayaran_status === 'Hold/Escrow'
                              ? 'bg-amber-500 text-white font-extrabold'
                              : 'bg-slate-200 text-slate-500'
                          }`}>
                            {o.pembayaran_status === 'Released' ? 'Released' : 'Hold/Escrow'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isEscrow ? (
                            <button
                              onClick={() => {
                                if (confirm(`Konfirmasi penerimaan barang untuk order ${o.id_pesanan}? Aksi ini akan mencairkan dana escrow Rp ${o.total_harga.toLocaleString('id-ID')} ke saldo petani.`)) {
                                  confirmDelivery(o.id_pesanan);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] shadow"
                            >
                              Konfirmasi & Cairkan 🔓
                            </button>
                          ) : (
                            <span className="text-slate-400 font-semibold text-[10px]">Selesai / Dana Dicairkan</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">Belum ada transaksi pembelian.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: TRACKING */}
      {activeTab === 'tracking' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">📍 Lacak Perjalanan Logistik Beras</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Timeline detail status pengiriman kurir logistik.</p>
          </div>

          <div className="space-y-8">
            {buyerOrders.map((o) => {
              const ship = shippings.find(s => s.id_pesanan === o.id_pesanan);
              if (!ship) return null;

              // Timeline states
              const isWaiting = o.status === 'Menunggu';
              const isProcessed = o.status === 'Diproses';
              const isShipped = o.status === 'Dikirim';
              const isFinished = o.status === 'Selesai';

              return (
                <div key={o.id_pesanan} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-800 border-b border-slate-200/50 pb-2">
                    <span>INVOICE REFERENCE: {o.id_pesanan}</span>
                    <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      KURIR: {ship.kurir}
                    </span>
                  </div>

                  {/* Horizontal Timeline Layout */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {/* Stage 1 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow ${
                        isWaiting || isProcessed || isShipped || isFinished ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}>
                        ✓
                      </div>
                      <div>
                        <span className="font-bold block text-[10px] text-slate-800">Pesanan Dibuat</span>
                        <span className="text-[9px] text-slate-400">{o.tanggal}</span>
                      </div>
                    </div>
                    
                    {/* Stage 2 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow ${
                        isProcessed || isShipped || isFinished ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}>
                        {isProcessed || isShipped || isFinished ? '✓' : '2'}
                      </div>
                      <div>
                        <span className="font-bold block text-[10px] text-slate-800">Diproses Giling</span>
                        <span className="text-[9px] text-slate-400">Warehouse</span>
                      </div>
                    </div>

                    {/* Stage 3 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow ${
                        isShipped || isFinished ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}>
                        {isShipped || isFinished ? '✓' : '3'}
                      </div>
                      <div>
                        <span className="font-bold block text-[10px] text-slate-800">Dikirim Kurir</span>
                        <span className="text-[9px] text-slate-400">{ship.kurir}</span>
                      </div>
                    </div>

                    {/* Stage 4 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow ${
                        isFinished ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}>
                        {isFinished ? '✓' : '4'}
                      </div>
                      <div>
                        <span className="font-bold block text-[10px] text-slate-800">Diterima Toko</span>
                        <span className="text-[9px] text-slate-400">Escrow Released</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white border border-slate-100 p-3 rounded-lg font-medium space-y-1">
                    <div>Estimasi Tiba: <span className="font-bold text-slate-700">{ship.estimasi_tiba}</span></div>
                    <div>Status Logistik: <span className="font-bold text-amber-600">{ship.status_kirim}</span></div>
                    {ship.bukti_terima && (
                      <div className="mt-2 text-[10px] italic text-slate-400 bg-slate-50 p-1.5 rounded border border-slate-100">
                        {ship.bukti_terima}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: SCAN QR TRACEABILITY */}
      {activeTab === 'scan_traceability' && (
        <div className="space-y-4">
          <TraceabilityQR
            products={products}
            harvests={harvests}
            millings={millings}
            shippings={shippings}
            orders={orders}
            blockchain={blockchain}
          />
        </div>
      )}

    </div>
  );
}
