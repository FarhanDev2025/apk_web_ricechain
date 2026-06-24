import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function LoginPage({ onLoginSuccess, onBackToLanding }) {
  const { login, register } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('pembeli');
  const [alamat, setAlamat] = useState('');
  const [noHp, setNoHp] = useState('');

  // Info message states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Quick Login Profiles
  const quickLogins = [
    { label: '👨‍🌾 Petani', email: 'budi@ricechain.com', desc: 'Budi Santoso' },
    { label: '🏭 Distributor / Gilingan', email: 'slamet@ricechain.com', desc: 'Gilingan Jaya' },
    { label: '🛒 Pembeli / Toko', email: 'toko.berkah@gmail.com', desc: 'Toko Beras Berkah' },
    { label: '🛡️ Admin', email: 'admin@ricechain.com', desc: 'Super Admin' }
  ];

  const handleQuickLogin = (emailAddr) => {
    setEmail(emailAddr);
    setPassword('password');
    setErrorMsg('');
    setSuccessMsg('');
    
    // Simulate login right away for user convenience
    const res = login(emailAddr, 'password');
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegister) {
      if (!name || !email || !password) {
        setErrorMsg('Harap isi semua kolom wajib.');
        return;
      }
      const res = register(name, email, password, role, { alamat, no_hp: noHp });
      if (res.success) {
        setSuccessMsg(res.message);
        setIsRegister(false);
        // Clear fields
        setName('');
        setEmail('');
        setPassword('');
        setAlamat('');
        setNoHp('');
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Harap isi email dan password.');
        return;
      }
      const res = login(email, password);
      if (res.success) {
        onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative font-sans">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none"></div>

      {/* Brand logo & title */}
      <div className="mb-6 flex flex-col items-center gap-2 relative z-10">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-slate-400 text-xs font-semibold hover:text-slate-200 transition-all duration-200"
        >
          ← Kembali ke Beranda
        </button>
      </div>

      {/* Main card grid */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-12">
        
        {/* Left column: Quick Logins and Intro */}
        <div className="md:col-span-5 bg-slate-950/60 p-8 border-r border-slate-800/80 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] text-brand-green font-extrabold uppercase tracking-widest block mb-1">
                Akses Demo Cepat
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">Uji Coba UTS Prototype</h2>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                Gunakan profil akses cepat di bawah untuk login langsung dan menguji alur blockchain sesuai peran masing-masing.
              </p>
            </div>

            {/* Quick login grid */}
            <div className="space-y-3">
              {quickLogins.map((profile, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickLogin(profile.email)}
                  className="w-full text-left bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl flex flex-col transition-all duration-200 hover:scale-[1.02] group"
                >
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                    {profile.label}
                    <span className="text-[9px] text-slate-500 font-mono font-normal">KLIK LOGIN</span>
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">{profile.desc}</span>
                  <span className="text-[9px] text-slate-600 font-mono mt-0.5">{profile.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono flex flex-col gap-1">
            <span>SECURE CRYPTO LEDGER ACTIVE</span>
            <span>SYSTEM VERSION 1.0.0-PROTOTYPE</span>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center bg-slate-900">
          <div className="mb-6">
            <h3 className="text-2xl font-extrabold text-white">
              {isRegister ? 'Buat Akun Baru' : 'Masuk ke RiceChain'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister 
                ? 'Bergabung dalam ekosistem supply chain terintegrasi blockchain.' 
                : 'Silakan masuk menggunakan email dan password Anda.'
              }
            </p>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 font-medium">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl mb-4 font-medium">
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                {/* Full name */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-green outline-none transition-colors"
                  />
                </div>

                {/* Role select */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Daftar Sebagai Peran *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:border-brand-green outline-none transition-colors"
                  >
                    <option value="pembeli">Pembeli / Toko Retail</option>
                    <option value="petani">Petani Beras</option>
                    <option value="distributor">Penggilingan / Distributor Gudang</option>
                  </select>
                </div>

                {role === 'petani' && (
                  <>
                    {/* Alamat */}
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Alamat Sawah/Rumah *</label>
                      <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Contoh: Subang, Jawa Barat"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-green outline-none"
                      />
                    </div>
                    {/* No HP */}
                    <div>
                      <label className="text-xs text-slate-400 font-semibold block mb-1">Nomor Telepon/HP *</label>
                      <input
                        type="text"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                        placeholder="Contoh: 0812xxxx"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-green outline-none"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Email field */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-green outline-none transition-colors"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-green outline-none transition-colors"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all duration-200 mt-2"
            >
              {isRegister ? 'Daftar Sekarang' : 'Masuk ke Sistem'}
            </button>
          </form>

          {/* Toggle login/register */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-500">
              {isRegister ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
            </span>{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-brand-green hover:underline font-bold"
            >
              {isRegister ? 'Login di sini' : 'Daftar di sini'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
