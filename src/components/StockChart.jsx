import React from 'react';

export default function StockChart({ products }) {
  // Let's draw a nice SVG bar chart
  const maxStock = Math.max(...products.map(p => Math.max(p.stok, p.safety_stock, 1000)));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>📊</span> Grafik Kontrol Persediaan (Stok vs Safety Stock)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Safety Stock digunakan untuk memicu peringatan restock cepat</p>
        </div>
        <div className="flex gap-4 text-[10px] font-semibold text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-brand-green rounded"></span>
            <span>Stok Aman</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-500 rounded"></span>
            <span>Safety Stock</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded animate-pulse"></span>
            <span>Stok Kritis</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="space-y-6">
        {products.map((product) => {
          const isLow = product.stok <= product.safety_stock;
          
          // Width percentages for SVG
          const stockPercent = Math.min((product.stok / maxStock) * 100, 100);
          const safetyPercent = Math.min((product.safety_stock / maxStock) * 100, 100);

          return (
            <div key={product.id_beras} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700">{product.jenis_beras}</span>
                  <span className="text-[10px] text-slate-400 ml-2 font-mono">{product.id_beras}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    Stok: <strong className={isLow ? 'text-rose-600 font-bold' : 'text-slate-700'}>{product.stok} kg</strong>
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">
                    Safety: <strong>{product.safety_stock} kg</strong>
                  </span>
                  {isLow && (
                    <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
                      ⚠️ CRITICAL STOCK
                    </span>
                  )}
                </div>
              </div>

              {/* Bar Layout */}
              <div className="relative h-6 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50">
                {/* Safety Stock Line Overlay */}
                <div 
                  className="absolute top-0 bottom-0 border-l-2 border-dashed border-amber-500 z-10"
                  style={{ left: `${safetyPercent}%` }}
                  title={`Safety Stock: ${product.safety_stock}kg`}
                >
                  <span className="absolute -top-1.5 left-1 text-[8px] bg-amber-500 text-white px-1 rounded font-bold">
                    Limit
                  </span>
                </div>

                {/* Stock Bar */}
                <div 
                  className={`h-full rounded-r-md transition-all duration-500 ${
                    isLow 
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-inner' 
                      : 'bg-gradient-to-r from-emerald-500 to-brand-green'
                  }`}
                  style={{ width: `${stockPercent}%` }}
                >
                  {/* Subtle inner grid lines */}
                  <div className="w-full h-full opacity-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_100%]"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
