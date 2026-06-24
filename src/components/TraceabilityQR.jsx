import React, { useState } from 'react';

export default function TraceabilityQR({ products, harvests, millings, shippings, orders, blockchain }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [isScanned, setIsScanned] = useState(false);

  // Trace back history of the product
  const getProductHistory = (product) => {
    if (!product) return null;

    // Find milling records
    // In our dummy model, let's trace:
    // If Pandan Wangi Premium (BRS001) -> originates from Gilingan GIL001 -> originates from Harvest PAN001 -> by Farmer USR001
    // If Cianjur Pulen (BRS002) -> originates from Gilingan GIL002 -> originates from Harvest PAN002
    // If Rojolele Organik (BRS003) -> custom fallback
    let milling = null;
    let harvest = null;
    let shipping = null;
    let order = null;

    if (product.id_beras === 'BRS001') {
      milling = millings.find(m => m.id_giling === 'GIL001');
      harvest = harvests.find(h => h.id_panen === 'PAN001');
      order = orders.find(o => o.id_pesanan === 'ORD001');
      shipping = shippings.find(s => s.id_pesanan === 'ORD001');
    } else if (product.id_beras === 'BRS002') {
      milling = millings.find(m => m.id_giling === 'GIL002');
      harvest = harvests.find(h => h.id_panen === 'PAN002');
      order = orders.find(o => o.id_pesanan === 'ORD002');
      shipping = shippings.find(s => s.id_pesanan === 'ORD002');
    } else {
      // Find any milling that quality-wise or location-wise could match or fallback
      milling = millings[0];
      harvest = harvests.find(h => h.id_panen === milling?.id_panen);
    }

    // Find blockchain hashes
    const harvestBlock = blockchain.find(b => b.id_transaksi === harvest?.id_panen);
    const millingBlock = blockchain.find(b => b.id_transaksi === milling?.id_giling);
    const orderBlock = order ? blockchain.find(b => b.id_transaksi === order.id_pesanan) : null;
    const shippingBlock = shipping ? blockchain.find(b => b.id_transaksi === shipping.id_pesanan + '_SHP' || b.id_transaksi === 'SHP001' || b.id_transaksi === 'SHP002') : null;

    return {
      product,
      milling,
      harvest,
      order,
      shipping,
      blocks: {
        harvest: harvestBlock,
        milling: millingBlock,
        order: orderBlock,
        shipping: shippingBlock
      }
    };
  };

  const history = getProductHistory(selectedProduct);

  const handleProductChange = (prodId) => {
    const prod = products.find(p => p.id_beras === prodId);
    setSelectedProduct(prod);
    setIsScanned(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>🔍</span> QR Traceability Beras
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          Lacak asal-usul beras secara transparan dari sawah petani hingga ke toko Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Select Product & QR Code View */}
        <div className="lg:col-span-4 flex flex-col items-center border-r border-slate-100 lg:pr-8">
          <label className="text-xs font-semibold text-slate-600 self-start mb-2">Pilih Batch Produk Beras:</label>
          <select
            value={selectedProduct?.id_beras || ''}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-green mb-6"
          >
            {products.map((p) => (
              <option key={p.id_beras} value={p.id_beras}>
                {p.jenis_beras} ({p.kualitas === 'A' ? 'Premium' : 'Medium'} - Batch {p.id_beras})
              </option>
            ))}
          </select>

          {/* QR Code Container */}
          <div className="relative p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center">
            {/* Visual QR Code using SVG */}
            <div className="w-44 h-44 bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex items-center justify-center relative group">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                {/* QR Code Outer Borders */}
                <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="11" y="11" width="13" height="13" fill="currentColor" />
                <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="76" y="11" width="13" height="13" fill="currentColor" />
                <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="11" y="76" width="13" height="13" fill="currentColor" />
                
                {/* QR Code Dummy Patterns */}
                <rect x="35" y="10" width="6" height="6" fill="currentColor" />
                <rect x="45" y="5" width="12" height="6" fill="currentColor" />
                <rect x="60" y="15" width="6" height="12" fill="currentColor" />
                <rect x="35" y="25" width="18" height="6" fill="currentColor" />
                
                <rect x="5" y="35" width="6" height="18" fill="currentColor" />
                <rect x="15" y="45" width="12" height="6" fill="currentColor" />
                <rect x="35" y="35" width="6" height="6" fill="currentColor" />
                <rect x="45" y="45" width="25" height="6" fill="currentColor" />
                <rect x="65" y="35" width="6" height="18" fill="currentColor" />
                <rect x="80" y="35" width="15" height="6" fill="currentColor" />
                <rect x="85" y="45" width="6" height="12" fill="currentColor" />

                <rect x="35" y="60" width="12" height="6" fill="currentColor" />
                <rect x="55" y="55" width="6" height="12" fill="currentColor" />
                <rect x="45" y="70" width="6" height="25" fill="currentColor" />
                <rect x="60" y="75" width="18" height="6" fill="currentColor" />
                <rect x="80" y="70" width="6" height="6" fill="currentColor" />
                <rect x="90" y="80" width="6" height="15" fill="currentColor" />
                <rect x="65" y="85" width="18" height="6" fill="currentColor" />

                {/* Center Core Logo Spot */}
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <rect x="44" y="44" width="12" height="12" fill="#10b981" rx="2" />
                <path d="M48 50 L50 53 L54 47" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Scanning Animation */}
              {!isScanned && (
                <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-lg opacity-100 group-hover:opacity-90 transition-opacity">
                  <div className="w-full h-0.5 bg-emerald-500 absolute top-0 animate-[bounce_2s_infinite]"></div>
                  <button
                    onClick={() => setIsScanned(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-md border border-emerald-500/30 transition-all duration-200 z-10"
                  >
                    Scan QR Trace
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 mt-4 text-center">
              Arahkan kamera atau klik tombol "Scan QR Trace" untuk membaca digital ledger blockchain.
            </p>
          </div>
        </div>

        {/* Right Side: Timeline / Traceability Tree */}
        <div className="lg:col-span-8">
          {isScanned && history ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div>
                  <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider font-mono">Trace Scan Success</span>
                  <h4 className="text-sm font-bold text-slate-800">{history.product.jenis_beras}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Batch ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{history.product.id_beras}</span>
                </div>
              </div>

              {/* Traceability Tree Timeline */}
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                
                {/* 1. Farmer Node */}
                <div className="relative">
                  {/* Bullet */}
                  <span className="absolute -left-[31px] top-1 bg-emerald-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border-4 border-white shadow">
                    1
                  </span>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        🚜 Panen Gabah di Sawah Petani
                      </h5>
                      <span className="text-[9px] text-slate-400 font-mono">PANEN</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1.5 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Petani Asal:</span>
                        <span className="font-semibold text-slate-800">{history.harvest?.nama_petani || 'Budi Santoso'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lokasi Sawah:</span>
                        <span className="font-medium text-slate-800">{history.harvest?.lokasi || 'Karanganyar'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal Panen:</span>
                        <span className="font-medium text-slate-700">{history.harvest?.tanggal_panen}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hasil Gabah:</span>
                        <span className="font-semibold text-emerald-600">{history.harvest?.jumlah_gabah} Kg (Grade {history.harvest?.kualitas})</span>
                      </div>
                      
                      {/* Block hash */}
                      {history.blocks.harvest && (
                        <div className="pt-2 border-t border-slate-200 mt-2 font-mono text-[9px] text-slate-400 flex flex-col gap-0.5">
                          <div className="flex justify-between">
                            <span>Block ID:</span>
                            <span className="text-slate-700">Block #{history.blocks.harvest.id_block}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tx Hash:</span>
                            <span className="text-emerald-500 font-bold truncate w-40 text-right" title={history.blocks.harvest.hash}>
                              {history.blocks.harvest.hash}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Mill Node */}
                <div className="relative">
                  {/* Bullet */}
                  <span className="absolute -left-[31px] top-1 bg-sky-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border-4 border-white shadow">
                    2
                  </span>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        ⚙️ Proses Penggilingan & Penyaringan Kualitas
                      </h5>
                      <span className="text-[9px] text-slate-400 font-mono">PENGGILINGAN</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1.5 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Penggiling:</span>
                        <span className="font-semibold text-slate-800">Gilingan Jaya (H. Slamet)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal Giling:</span>
                        <span className="font-medium text-slate-700">{history.milling?.tanggal_giling || '2026-06-03'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hasil Beras Out:</span>
                        <span className="font-semibold text-sky-600">{history.milling?.jumlah_beras || '1600'} Kg Beras</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kualitas Hasil:</span>
                        <span className="font-semibold text-slate-700">Grade {history.milling?.kualitas || 'A'} (Pecah &lt; 5%)</span>
                      </div>

                      {/* Block hash */}
                      {history.blocks.milling && (
                        <div className="pt-2 border-t border-slate-200 mt-2 font-mono text-[9px] text-slate-400 flex flex-col gap-0.5">
                          <div className="flex justify-between">
                            <span>Block ID:</span>
                            <span className="text-slate-700">Block #{history.blocks.milling.id_block}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tx Hash:</span>
                            <span className="text-sky-500 font-bold truncate w-40 text-right" title={history.blocks.milling.hash}>
                              {history.blocks.milling.hash}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Shipping / Logistics Node */}
                <div className="relative">
                  {/* Bullet */}
                  <span className="absolute -left-[31px] top-1 bg-amber-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border-4 border-white shadow">
                    3
                  </span>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        🚚 Distribusi & Pengiriman Kurir
                      </h5>
                      <span className="text-[9px] text-slate-400 font-mono">DISTRIBUSI</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1.5 text-xs text-slate-600 space-y-1">
                      {history.shipping ? (
                        <>
                          <div className="flex justify-between">
                            <span>Kurir Logistik:</span>
                            <span className="font-semibold text-slate-800">{history.shipping.kurir}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status Kirim:</span>
                            <span className="font-semibold text-amber-600">{history.shipping.status_kirim}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimasi Tiba / Tgl Sampai:</span>
                            <span className="font-medium text-slate-700">{history.shipping.estimasi_tiba}</span>
                          </div>
                          {history.shipping.bukti_terima && (
                            <div className="flex flex-col mt-1">
                              <span className="text-[10px] text-slate-400">Bukti Penerimaan:</span>
                              <span className="font-medium text-slate-700 italic bg-white p-1.5 border border-slate-100 rounded mt-0.5">{history.shipping.bukti_terima}</span>
                            </div>
                          )}

                          {/* Block hash */}
                          {history.blocks.shipping && (
                            <div className="pt-2 border-t border-slate-200 mt-2 font-mono text-[9px] text-slate-400 flex flex-col gap-0.5">
                              <div className="flex justify-between">
                                <span>Block ID:</span>
                                <span className="text-slate-700">Block #{history.blocks.shipping.id_block}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tx Hash:</span>
                                <span className="text-amber-500 font-bold truncate w-40 text-right" title={history.blocks.shipping.hash}>
                                  {history.blocks.shipping.hash}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-slate-400 italic text-[11px]">
                          Menunggu data pemesanan & pengiriman logistik untuk batch ini.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsScanned(false)}
                  className="text-xs text-brand-green hover:underline font-semibold"
                >
                  ✕ Tutup Trace & Scan Baru
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <span className="text-3xl mb-2">📸</span>
              <h4 className="text-sm font-bold text-slate-700">Menunggu Pemindaian QR</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Silakan klik tombol "Scan QR Trace" di sebelah kiri untuk melihat peta perjalanan beras dan hash blockchain-nya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
