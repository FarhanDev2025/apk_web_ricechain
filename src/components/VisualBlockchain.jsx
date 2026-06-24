import React, { useState } from 'react';

export default function VisualBlockchain({ logs, limit = null }) {
  const [selectedBlock, setSelectedBlock] = useState(null);
  
  // Optionally slice logs
  const displayLogs = limit ? logs.slice(-limit) : logs;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-sky-400">⛓️</span> Visualisasi Ledger Blockchain
            </h3>
            <p className="text-slate-400 text-xs mt-1">Setiap transaksi terenkripsi & terhubung ke blok sebelumnya secara real-time</p>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono">NODE ACTIVE - LEDGER SECURED</span>
          </div>
        </div>

        {/* Blockchain Flow container */}
        <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-4 scrollbar-thin scrollbar-thumb-slate-700">
          {displayLogs.map((block, idx) => {
            const isFirst = idx === 0;
            return (
              <div key={block.id_block} className="flex items-center flex-shrink-0">
                {/* Connector Line */}
                {!isFirst && (
                  <div className="flex flex-col items-center mx-1">
                    <svg className="w-16 h-8 text-sky-500" viewBox="0 0 64 32">
                      <path
                        d="M0,16 H64"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="blockchain-flow-line text-sky-500"
                      />
                      <polygon points="58,12 64,16 58,20" fill="currentColor" className="text-sky-400" />
                    </svg>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-tight">Prev Hash</span>
                  </div>
                )}

                {/* Block Card */}
                <button
                  onClick={() => setSelectedBlock(block)}
                  className={`w-60 bg-slate-800/80 border text-left p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 ${
                    selectedBlock?.id_block === block.id_block
                      ? 'border-sky-400 shadow-lg shadow-sky-500/10'
                      : 'border-slate-700 hover:border-slate-600 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                    <span className="text-[11px] font-bold text-sky-400 tracking-wider font-mono">
                      BLOCK #{block.id_block}
                    </span>
                    <span className="text-[9px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded-full font-mono font-semibold">
                      VERIFIED
                    </span>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-[10px] text-slate-400 font-mono mb-2">
                    📅 {block.timestamp}
                  </div>

                  {/* Activity Summary */}
                  <p className="text-xs text-slate-200 line-clamp-2 min-h-[2rem]">
                    {block.aktivitas}
                  </p>

                  {/* Hash Visuals */}
                  <div className="mt-3 bg-slate-900/90 rounded p-1.5 border border-slate-800 font-mono text-[9px] text-slate-400 flex flex-col gap-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-600">HASH:</span>
                      <span className="text-emerald-400 truncate w-32 text-right">{block.hash.substring(0, 12)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">PREV:</span>
                      <span className="text-sky-500 truncate w-32 text-right">{block.previous_hash.substring(0, 12)}...</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Block Detail Modal / Panel */}
        {selectedBlock && (
          <div className="mt-4 p-4 bg-slate-800/60 border border-slate-700 rounded-xl animate-fadeIn">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold text-white font-mono text-sky-400">
                🔍 Detail Block #{selectedBlock.id_block}
              </h4>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-xs text-slate-500 hover:text-slate-300 font-bold"
              >
                Tutup ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">ID Transaksi / Reference:</span>
                <span className="font-semibold text-slate-200 font-mono">{selectedBlock.id_transaksi}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Timestamp:</span>
                <span className="font-semibold text-slate-200">{selectedBlock.timestamp}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 block">Aktivitas / Payload:</span>
                <span className="font-medium text-slate-200">{selectedBlock.aktivitas}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 block font-mono">Current Hash (SHA-256 dummy):</span>
                <span className="font-semibold text-emerald-400 break-all select-all font-mono bg-slate-950 px-2 py-1 rounded block mt-1 border border-slate-800">
                  {selectedBlock.hash}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 block font-mono">Previous Block Hash:</span>
                <span className="font-semibold text-sky-500 break-all select-all font-mono bg-slate-950 px-2 py-1 rounded block mt-1 border border-slate-800">
                  {selectedBlock.previous_hash}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
