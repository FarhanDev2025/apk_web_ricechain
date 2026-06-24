/**
 * RiceChain - Core Logic and State Management
 * Prototype Digital Supply Chain Berbasis Blockchain untuk Distribusi Beras
 */

// ==========================================
// 1. STRUKTUR DATA UTAMA & INISIALISASI
// ==========================================

// Data Awal Dummy untuk Sistem
const DEFAULT_USERS = [
  { ID_User: 'petani1', Nama: 'Pak Joko Widodo', Email: 'petani@ricechain.com', Password: 'password', Role: 'Petani', Saldo: 12000000 },
  { ID_User: 'distributor1', Nama: 'CV Rice Makmur (Giling & Gudang)', Email: 'distributor@ricechain.com', Password: 'password', Role: 'Penggilingan/Distributor', Saldo: 45000000 },
  { ID_User: 'pembeli1', Nama: 'Budi Mart', Email: 'pembeli@ricechain.com', Password: 'password', Role: 'Pembeli', Saldo: 25000000 },
  { ID_User: 'admin1', Nama: 'Sistem Admin', Email: 'admin@ricechain.com', Password: 'password', Role: 'Admin', Saldo: 5000000 }
];

const DEFAULT_PETANI = [
  { ID_Petani: 'PET001', ID_User: 'petani1', Alamat: 'Karawang, Blok C, Jawa Barat', No_HP: '081234567890' }
];

const DEFAULT_PANEN = [
  { ID_Panen: 'PAN001', ID_Petani: 'PET001', Tanggal_Panen: '2026-06-01', Jenis_Gabah: 'IR64', Jumlah_Gabah: 5000, Kualitas: 'A (Sangat Baik)', Lokasi: 'Sawah Karawang Barat' },
  { ID_Panen: 'PAN002', ID_Petani: 'PET001', Tanggal_Panen: '2026-06-10', Jenis_Gabah: 'Pandan Wangi', Jumlah_Gabah: 3000, Kualitas: 'A (Sangat Baik)', Lokasi: 'Sawah Karawang Timur' }
];

const DEFAULT_PENGGILINGAN = [
  { ID_Giling: 'GIL001', ID_Panen: 'PAN001', Jumlah_Beras: 3500, Tanggal_Giling: '2026-06-03', Kualitas: 'Premium' }
];

const DEFAULT_PRODUK_BERAS = [
  { ID_Beras: 'BRS001', ID_Petani: 'PET001', ID_Giling: 'GIL001', Jenis_Beras: 'IR64 Premium', Kualitas: 'Premium', Stok: 3500, Harga: 13000, Safety_Stock: 1000 },
  { ID_Beras: 'BRS002', ID_Petani: 'PET001', ID_Giling: null, Jenis_Beras: 'Pandan Wangi Gabah', Kualitas: 'Premium', Stok: 300, Harga: 16000, Safety_Stock: 500 }
];

const DEFAULT_PESANAN = [
  { ID_Pesanan: 'ORD001', ID_Pembeli: 'pembeli1', Tanggal: '2026-06-18', Status: 'Selesai', Total_Harga: 6500000, Status_Escrow: 'Dana Dicairkan ke Penjual' }
];

const DEFAULT_DETAIL_PESANAN = [
  { ID_Detail: 'DET001', ID_Pesanan: 'ORD001', ID_Beras: 'BRS001', Jumlah: 500, Subtotal: 6500000 }
];

const DEFAULT_PENGIRIMAN = [
  { ID_Kirim: 'SHP001', ID_Pesanan: 'ORD001', Kurir: 'Logistik RiceChain Express', Status_Kirim: 'Diterima', Estimasi_Tiba: '2026-06-21', Bukti_Terima: 'Diterima oleh Budi Mart (Pemilik Toko)' }
];

const DEFAULT_BLOCKCHAIN_LOG = [
  { ID_Block: 1, ID_Transaksi: 'SYS-INIT', Aktivitas: 'Inisialisasi Sistem Blockchain RiceChain', Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', Previous_Hash: '0000000000000000000000000000000000000000000000000000000000000000', Timestamp: '2026-06-01 08:00:00' },
  { ID_Block: 2, ID_Transaksi: 'PAN001', Aktivitas: 'Pencatatan Hasil Panen Baru IR64', Hash: '3a55d491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00ff2', Previous_Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', Timestamp: '2026-06-01 10:15:30' },
  { ID_Block: 3, ID_Transaksi: 'GIL001', Aktivitas: 'Proses Giling Gabah PAN001 menjadi Beras', Hash: 'c4e36d491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00bb4', Previous_Hash: '3a55d491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00ff2', Timestamp: '2026-06-03 14:22:10' },
  { ID_Block: 4, ID_Transaksi: 'ORD001-ESCROW', Aktivitas: 'Pembayaran Escrow Pesanan ORD001 Ditahan', Hash: '77ae9b91f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00ca8', Previous_Hash: 'c4e36d491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00bb4', Timestamp: '2026-06-18 11:45:00' },
  { ID_Block: 5, ID_Transaksi: 'ORD001-SHIPPED', Aktivitas: 'Pengiriman Barang ORD001 Diproses Kurir', Hash: '12dcb491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00de2', Previous_Hash: '77ae9b91f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00ca8', Timestamp: '2026-06-19 09:00:00' },
  { ID_Block: 6, ID_Transaksi: 'ORD001-DELIVERED', Aktivitas: 'Konfirmasi Diterima & Dana Escrow ORD001 Dicairkan', Hash: '8b7f7d491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00cc5', Previous_Hash: '12dcb491f8687d65452feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00de2', Timestamp: '2026-06-21 16:30:15' }
];

// Helper LocalStorage getter/setter
function getStorage(key, defaultValue) {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(val);
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Inisialisasi Database Lokal
let db = {
  users: getStorage('rc_users', DEFAULT_USERS),
  petani: getStorage('rc_petani', DEFAULT_PETANI),
  panen: getStorage('rc_panen', DEFAULT_PANEN),
  penggilingan: getStorage('rc_penggilingan', DEFAULT_PENGGILINGAN),
  produk_beras: getStorage('rc_produk_beras', DEFAULT_PRODUK_BERAS),
  pesanan: getStorage('rc_pesanan', DEFAULT_PESANAN),
  detail_pesanan: getStorage('rc_detail_pesanan', DEFAULT_DETAIL_PESANAN),
  pengiriman: getStorage('rc_pengiriman', DEFAULT_PENGIRIMAN),
  blockchain_log: getStorage('rc_blockchain_log', DEFAULT_BLOCKCHAIN_LOG)
};

// Keranjang belanja temporer (tidak disimpan permanen di localStorage per user, cukup per session/runtime)
let keranjangBelanja = [];

// Status Login Aktif
let currentUser = JSON.parse(localStorage.getItem('rc_current_user')) || null;
let currentRole = localStorage.getItem('rc_current_role') || null;

// ==========================================
// 2. FUNGSI UTILITAS & BLOCKCHAIN UTAMA
// ==========================================

// Fungsi pembuat Hash Dummy Hexadecimal 64 karakter
function generateDummyHash() {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
}

// Menambahkan Log Audit ke Rantai Blockchain
function addBlockchainLog(aktivitas, idTransaksi) {
  const currentChain = db.blockchain_log;
  const previousBlock = currentChain[currentChain.length - 1];
  const previousHash = previousBlock ? previousBlock.Hash : '0000000000000000000000000000000000000000000000000000000000000000';
  
  // Format Tanggal
  const now = new Date();
  const timestamp = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0') + ' ' + 
                    String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0') + ':' + 
                    String(now.getSeconds()).padStart(2, '0');

  const newBlock = {
    ID_Block: currentChain.length + 1,
    ID_Transaksi: idTransaksi,
    Aktivitas: aktivitas,
    Hash: generateDummyHash(),
    Previous_Hash: previousHash,
    Timestamp: timestamp
  };

  db.blockchain_log.push(newBlock);
  setStorage('rc_blockchain_log', db.blockchain_log);
  return newBlock;
}

// Memperbarui UI Tampilan Saldo & Navigasi User
function updateGlobalUserInterface() {
  if (currentUser) {
    // Cari user terbaru dari db untuk mendapatkan saldo terbaru
    const updatedUser = db.users.find(u => u.ID_User === currentUser.ID_User);
    if (updatedUser) {
      currentUser = updatedUser;
      localStorage.setItem('rc_current_user', JSON.stringify(currentUser));
    }
    
    document.querySelectorAll('.profile-user-name').forEach(el => el.textContent = currentUser.Nama);
    document.querySelectorAll('.profile-user-role').forEach(el => el.textContent = currentRole);
    document.querySelectorAll('.wallet-balance-value').forEach(el => {
      el.textContent = 'Rp ' + currentUser.Saldo.toLocaleString('id-ID');
    });

    // Menghitung dana yang tertahan di escrow untuk admin / pembeli
    let totalEscrow = 0;
    db.pesanan.forEach(p => {
      if (p.Status_Escrow === 'Ditahan / Escrow') {
        totalEscrow += p.Total_Harga;
      }
    });
    document.querySelectorAll('.escrow-locked-value').forEach(el => {
      el.textContent = 'Rp ' + totalEscrow.toLocaleString('id-ID');
    });
  }
}

// ==========================================
// 3. NAVIGASI HALAMAN (SINGLE PAGE APP)
// ==========================================

function showPage(pageId) {
  // Sembunyikan semua halaman utama
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active');
  });

  // Tampilkan halaman target
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Jika masuk ke landing page, pastikan nav-landing aktif
  if (pageId === 'landing-page') {
    // Selesai
  }
  
  // Render ulang dashboard jika masuk ke halaman dashboard
  if (pageId.includes('dashboard')) {
    renderDashboardByRole();
    updateGlobalUserInterface();
  }
}

// Navigasi sub-tab di dalam dashboard (Sidebar navigation)
function showDashboardTab(role, tabId) {
  // Sembunyikan semua tab content dari dashboard aktif
  const dashboardContainer = document.getElementById(`${role}-dashboard`);
  if (!dashboardContainer) return;

  dashboardContainer.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Tampilkan tab yang dipilih
  const targetTab = document.getElementById(`${role}-${tabId}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Aktifkan menu sidebar yang bersangkutan
  dashboardContainer.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });

  // Tutup sidebar di HP jika terbuka
  const sidebar = dashboardContainer.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  }
}

// Toggle Sidebar untuk Layout Mobile
function toggleMobileSidebar(role) {
  const dashboardContainer = document.getElementById(`${role}-dashboard`);
  if (!dashboardContainer) return;

  const sidebar = dashboardContainer.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  
  if (sidebar) {
    sidebar.classList.toggle('open');
    if (overlay) {
      overlay.classList.toggle('active');
    }
  }
}

// ==========================================
// 4. OTENTIKASI & REGISTRASI
// ==========================================

function loginUser() {
  const emailInput = document.getElementById('login-email').value;
  const passwordInput = document.getElementById('login-password').value;
  
  // Mendapatkan role terpilih dari form radio button
  const selectedRoleEl = document.querySelector('input[name="login-role"]:checked');
  if (!selectedRoleEl) {
    alert('Silakan pilih Role terlebih dahulu!');
    return;
  }
  const selectedRole = selectedRoleEl.value;

  // Autentikasi Dummy
  const user = db.users.find(u => u.Email.toLowerCase() === emailInput.toLowerCase() && u.Password === passwordInput && u.Role === selectedRole);

  if (user) {
    currentUser = user;
    currentRole = selectedRole;
    
    // Simpan status login di LocalStorage
    localStorage.setItem('rc_current_user', JSON.stringify(currentUser));
    localStorage.setItem('rc_current_role', currentRole);

    alert(`Selamat Datang, ${user.Nama}! Anda masuk sebagai ${selectedRole}.`);
    
    // Arahkan ke dashboard yang sesuai
    if (selectedRole === 'Petani') {
      showPage('petani-dashboard');
      showDashboardTab('petani', 'home');
    } else if (selectedRole === 'Penggilingan/Distributor') {
      showPage('distributor-dashboard');
      showDashboardTab('distributor', 'stok');
    } else if (selectedRole === 'Pembeli') {
      showPage('pembeli-dashboard');
      showDashboardTab('pembeli', 'katalog');
    } else if (selectedRole === 'Admin') {
      showPage('admin-dashboard');
      showDashboardTab('admin', 'control');
    }
  } else {
    alert('Email, Password, atau Role salah. Silakan coba kembali.');
  }
}

function logoutUser() {
  currentUser = null;
  currentRole = null;
  localStorage.removeItem('rc_current_user');
  localStorage.removeItem('rc_current_role');
  keranjangBelanja = [];
  alert('Anda telah keluar dari sistem.');
  showPage('landing-page');
}

// ==========================================
// 5. RENDER DASHBOARD & LOGIKA BISNIS
// ==========================================

function renderDashboardByRole() {
  if (!currentRole) return;

  switch (currentRole) {
    case 'Petani':
      renderPetaniDashboard();
      break;
    case 'Penggilingan/Distributor':
      renderDistributorDashboard();
      break;
    case 'Pembeli':
      renderPembeliDashboard();
      break;
    case 'Admin':
      renderAdminDashboard();
      break;
  }
}

// ------------------------------------------
// A. LOGIKA & RENDER DASHBOARD PETANI
// ------------------------------------------
function renderPetaniDashboard() {
  // Card Statistik
  const totalPanenKg = db.panen.reduce((sum, p) => sum + parseInt(p.Jumlah_Gabah), 0);
  const totalProdukActive = db.produk_beras.filter(p => p.ID_Petani === 'PET001').length;
  
  // Mencari saldo petani
  const farmerUser = db.users.find(u => u.ID_User === 'petani1');
  const saldoPetani = farmerUser ? farmerUser.Saldo : 0;
  
  // Transaksi selesai petani
  const totalTransaksiSelesai = db.pesanan.filter(p => p.Status === 'Selesai').length;

  document.getElementById('petani-stat-total-panen').textContent = `${totalPanenKg.toLocaleString('id-ID')} Kg`;
  document.getElementById('petani-stat-produk-aktif').textContent = totalProdukActive;
  document.getElementById('petani-stat-transaksi-selesai').textContent = totalTransaksiSelesai;
  
  // Render Tabel Panen
  renderPanenTable();
  
  // Render Riwayat Produk Beras Petani
  renderPetaniProdukTable();

  // Render Riwayat Transaksi Penjualan Petani
  renderPetaniTransaksiTable();

  // Render Riwayat Blockchain khusus Petani (hanya menampilkan blok yang relevan)
  renderBlockchainLogTable('petani-blockchain-table');
}

function renderPanenTable() {
  const tableBody = document.getElementById('petani-panen-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  db.panen.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Panen}</strong></td>
      <td>${p.Tanggal_Panen}</td>
      <td>${p.Jenis_Gabah}</td>
      <td>${parseInt(p.Jumlah_Gabah).toLocaleString('id-ID')} Kg</td>
      <td><span class="badge-status selesai">${p.Kualitas}</span></td>
      <td>${p.Lokasi}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderPetaniProdukTable() {
  const tableBody = document.getElementById('petani-produk-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  const produkPetani = db.produk_beras.filter(p => p.ID_Petani === 'PET001');
  produkPetani.forEach(p => {
    const isLow = p.Stok <= p.Safety_Stock;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Beras}</strong></td>
      <td>${p.Jenis_Beras}</td>
      <td>Rp ${p.Harga.toLocaleString('id-ID')}/Kg</td>
      <td>${p.Stok.toLocaleString('id-ID')} Kg</td>
      <td>${p.Safety_Stock.toLocaleString('id-ID')} Kg</td>
      <td>
        ${isLow ? '<span class="badge-status low-stock">Low Stock</span>' : '<span class="badge-status selesai">Aman</span>'}
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderPetaniTransaksiTable() {
  const tableBody = document.getElementById('petani-transaksi-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  // Untuk demo, semua pesanan/transaksi ditampilkan di sini karena supply chain berpusat pada satu produsen/distributor utama
  db.pesanan.forEach(p => {
    const buyer = db.users.find(u => u.ID_User === p.ID_Pembeli);
    const buyerName = buyer ? buyer.Nama : 'Pembeli Umum';
    
    // Status Badge Escrow
    let escrowBadge = '';
    if (p.Status_Escrow === 'Ditahan / Escrow') {
      escrowBadge = '<span class="badge-status escrow">Escrow</span>';
    } else if (p.Status_Escrow === 'Dana Dicairkan ke Penjual') {
      escrowBadge = '<span class="badge-status selesai">Dana Cair</span>';
    } else if (p.Status_Escrow === 'Refund') {
      escrowBadge = '<span class="badge-status refund">Refunded</span>';
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Pesanan}</strong></td>
      <td>${buyerName}</td>
      <td>${p.Tanggal}</td>
      <td>Rp ${p.Total_Harga.toLocaleString('id-ID')}</td>
      <td><span class="badge-status ${p.Status.toLowerCase()}">${p.Status}</span></td>
      <td>${escrowBadge}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function tambahPanen() {
  const tanggal = document.getElementById('panen-tanggal').value;
  const jenis = document.getElementById('panen-jenis').value;
  const jumlah = parseInt(document.getElementById('panen-jumlah').value);
  const kualitas = document.getElementById('panen-kualitas').value;
  const lokasi = document.getElementById('panen-lokasi').value;

  if (!tanggal || !jenis || isNaN(jumlah) || jumlah <= 0 || !lokasi) {
    alert('Silakan lengkapi semua isian formulir panen!');
    return;
  }

  const newId = 'PAN' + String(db.panen.length + 1).padStart(3, '0');
  const newPanen = {
    ID_Panen: newId,
    ID_Petani: 'PET001',
    Tanggal_Panen: tanggal,
    Jenis_Gabah: jenis,
    Jumlah_Gabah: jumlah,
    Kualitas: kualitas,
    Lokasi: lokasi
  };

  db.panen.push(newPanen);
  setStorage('rc_panen', db.panen);

  // Otomatis masukkan ke Blockchain Log
  addBlockchainLog(`Petani meregistrasikan panen baru ${newId} (${jenis}, ${jumlah} Kg)`, newId);

  alert(`Pencatatan Panen Berhasil! ID Panen: ${newId} dan telah terekam di Blockchain Log.`);
  
  // Reset Form
  document.getElementById('panen-tanggal').value = '';
  document.getElementById('panen-jumlah').value = '';
  document.getElementById('panen-lokasi').value = '';

  // Render ulang
  renderPetaniDashboard();
}

// ------------------------------------------
// B. LOGIKA & RENDER DASHBOARD PENGGILINGAN & DISTRIBUTOR
// ------------------------------------------
function renderDistributorDashboard() {
  // Cek safety stock alert
  renderLowStockAlert();

  // Card Statistik
  const totalStokKg = db.produk_beras.reduce((sum, p) => sum + p.Stok, 0);
  const totalPesananMasuk = db.pesanan.filter(p => p.Status === 'Menunggu' || p.Status === 'Diproses').length;
  const totalPengirimanAktif = db.pengiriman.filter(p => p.Status_Kirim !== 'Diterima').length;
  const totalLowStockAlert = db.produk_beras.filter(p => p.Stok <= p.Safety_Stock).length;

  document.getElementById('dist-stat-stok').textContent = `${totalStokKg.toLocaleString('id-ID')} Kg`;
  document.getElementById('dist-stat-pesanan').textContent = totalPesananMasuk;
  document.getElementById('dist-stat-pengiriman').textContent = totalPengirimanAktif;
  document.getElementById('dist-stat-low-stock').textContent = totalLowStockAlert;

  // Render grafik chart sederhana stok produk beras
  renderStokChart();

  // Render dropdown list panen untuk penggilingan
  populatePanenDropdown();

  // Render tabel stok beras di distributor
  renderDistributorStokTable();

  // Render tabel pesanan masuk
  renderDistributorPesananTable();

  // Render tabel pengiriman
  renderDistributorPengirimanTable();

  // Render Blockchain audit log
  renderBlockchainLogTable('distributor-blockchain-table');
}

function renderLowStockAlert() {
  const alertContainer = document.getElementById('dist-low-stock-alert-container');
  if (!alertContainer) return;
  alertContainer.innerHTML = '';

  const lowStockItems = db.produk_beras.filter(p => p.Stok <= p.Safety_Stock);
  if (lowStockItems.length > 0) {
    let alertHtml = `
      <div class="custom-alert">
        <span class="custom-alert-icon">⚠️</span>
        <div>
          <strong>Notifikasi Safety Stock:</strong> Beberapa stok beras berada di bawah batas minimum!<br>
          <ul style="margin-left: 20px; font-size: 0.9rem;">
    `;
    
    lowStockItems.forEach(item => {
      alertHtml += `<li>Beras <strong>${item.Jenis_Beras}</strong> (Stok: ${item.Stok} Kg / Batas Aman: ${item.Safety_Stock} Kg)</li>`;
    });

    alertHtml += `
          </ul>
        </div>
      </div>
    `;
    alertContainer.innerHTML = alertHtml;
  }
}

function renderStokChart() {
  const chartWrapper = document.getElementById('stok-bar-chart');
  if (!chartWrapper) return;
  chartWrapper.innerHTML = '';

  // Ambil data produk beras
  db.produk_beras.forEach((p, idx) => {
    // Hitung tinggi grafis berdasarkan proporsi stok (maksimum tinggi 180px)
    const maxStokVal = Math.max(...db.produk_beras.map(prod => prod.Stok), 2000);
    const heightPercentage = Math.min((p.Stok / maxStokVal) * 100, 100);
    
    const isSecondary = idx % 2 !== 0;

    const column = document.createElement('div');
    column.className = `bar-column ${isSecondary ? 'secondary' : ''}`;
    column.innerHTML = `
      <div class="bar-fill" style="height: ${heightPercentage}%;" data-value="${p.Stok} Kg"></div>
      <div class="chart-label" title="${p.Jenis_Beras}">${p.Jenis_Beras}</div>
    `;
    chartWrapper.appendChild(column);
  });
}

function populatePanenDropdown() {
  const select = document.getElementById('giling-panen-id');
  if (!select) return;
  select.innerHTML = '<option value="">-- Pilih ID Panen Gabah --</option>';

  db.panen.forEach(p => {
    // Tampilkan data gabah yang belum digiling sepenuhnya (sebagai mock)
    // kita biarkan semua pilihan panen dapat dipilih
    const opt = document.createElement('option');
    opt.value = p.ID_Panen;
    opt.textContent = `${p.ID_Panen} - ${p.Jenis_Gabah} (${p.Jumlah_Gabah} Kg)`;
    select.appendChild(opt);
  });
}

function renderDistributorStokTable() {
  const tableBody = document.getElementById('distributor-stok-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  db.produk_beras.forEach(p => {
    const isLow = p.Stok <= p.Safety_Stock;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Beras}</strong></td>
      <td>${p.Jenis_Beras}</td>
      <td>Rp ${p.Harga.toLocaleString('id-ID')}/Kg</td>
      <td><strong>${p.Stok.toLocaleString('id-ID')} Kg</strong></td>
      <td>
        ${isLow ? '<span class="badge-status low-stock">Low Stock</span>' : '<span class="badge-status selesai">Aman</span>'}
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderDistributorPesananTable() {
  const tableBody = document.getElementById('distributor-pesanan-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  db.pesanan.forEach(p => {
    const buyer = db.users.find(u => u.ID_User === p.ID_Pembeli);
    const buyerName = buyer ? buyer.Nama : 'Pembeli';

    // Ambil detail pesanan
    const details = db.detail_pesanan.filter(d => d.ID_Pesanan === p.ID_Pesanan);
    let detailText = '';
    details.forEach(d => {
      const b = db.produk_beras.find(prod => prod.ID_Beras === d.ID_Beras);
      detailText += `${b ? b.Jenis_Beras : 'Beras'} (${d.Jumlah} Kg)<br>`;
    });

    // Pilihan aksi berdasarkan status
    let actionBtn = '-';
    if (p.Status === 'Menunggu') {
      actionBtn = `<button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="prosesPesananDistributor('${p.ID_Pesanan}')">Proses Pesanan</button>`;
    } else if (p.Status === 'Diproses') {
      actionBtn = `<button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="bukaFormPengiriman('${p.ID_Pesanan}')">Kirim Barang</button>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Pesanan}</strong></td>
      <td>${buyerName}</td>
      <td>${detailText}</td>
      <td>Rp ${p.Total_Harga.toLocaleString('id-ID')}</td>
      <td><span class="badge-status ${p.Status.toLowerCase()}">${p.Status}</span></td>
      <td>${p.Status_Escrow}</td>
      <td>${actionBtn}</td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderDistributorPengirimanTable() {
  const tableBody = document.getElementById('distributor-pengiriman-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  db.pengiriman.forEach(p => {
    let actionBtn = '-';
    if (p.Status_Kirim === 'Diproses') {
      actionBtn = `<button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="updateStatusPengiriman('${p.ID_Kirim}', 'Perjalanan')">Set Perjalanan</button>`;
    } else if (p.Status_Kirim === 'Perjalanan') {
      actionBtn = `<span style="font-size: 0.85rem; color: var(--text-muted);">Menunggu Konfirmasi Terima Pembeli</span>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Kirim}</strong></td>
      <td>${p.ID_Pesanan}</td>
      <td>${p.Kurir}</td>
      <td><span class="badge-status ${p.Status_Kirim === 'Diterima' ? 'selesai' : (p.Status_Kirim === 'Perjalanan' ? 'diproses' : 'menunggu')}">${p.Status_Kirim}</span></td>
      <td>${p.Estimasi_Tiba}</td>
      <td>${p.Bukti_Terima ? p.Bukti_Terima : '-'}</td>
      <td>${actionBtn}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Giling Gabah: Mengambil hasil panen lalu memproduksinya jadi produk beras distributor
function tambahGiling() {
  const idPanen = document.getElementById('giling-panen-id').value;
  const jumlahBeras = parseInt(document.getElementById('giling-jumlah').value);
  const tanggalGiling = document.getElementById('giling-tanggal').value;
  const kualitas = document.getElementById('giling-kualitas').value;

  if (!idPanen || isNaN(jumlahBeras) || jumlahBeras <= 0 || !tanggalGiling) {
    alert('Silakan isi seluruh formulir penggilingan!');
    return;
  }

  // Ambil data panen bersangkutan
  const panenData = db.panen.find(p => p.ID_Panen === idPanen);
  if (!panenData) {
    alert('Data Panen tidak ditemukan!');
    return;
  }

  // Buat ID Giling baru
  const newId = 'GIL' + String(db.penggilingan.length + 1).padStart(3, '0');
  const newGiling = {
    ID_Giling: newId,
    ID_Panen: idPanen,
    Jumlah_Beras: jumlahBeras,
    Tanggal_Giling: tanggalGiling,
    Kualitas: kualitas
  };

  db.penggilingan.push(newGiling);
  setStorage('rc_penggilingan', db.penggilingan);

  // Tambahkan Stok produk beras (Contoh: Menambahkan stok Pandan Wangi atau IR64 sesuai jenis gabah)
  let produkBerasTarget = db.produk_beras.find(p => p.Jenis_Beras.toLowerCase().includes(panenData.Jenis_Gabah.toLowerCase()));
  
  if (produkBerasTarget) {
    produkBerasTarget.Stok += jumlahBeras;
  } else {
    // Jika tidak ada tipe yang persis, buat produk beras baru
    const newIdBeras = 'BRS' + String(db.produk_beras.length + 1).padStart(3, '0');
    const newProduk = {
      ID_Beras: newIdBeras,
      ID_Petani: panenData.ID_Petani,
      ID_Giling: newId,
      Jenis_Beras: 'Beras ' + panenData.Jenis_Gabah,
      Kualitas: kualitas,
      Stok: jumlahBeras,
      Harga: 12000,
      Safety_Stock: 500
    };
    db.produk_beras.push(newProduk);
    produkBerasTarget = newProduk;
  }

  setStorage('rc_produk_beras', db.produk_beras);

  // Tambahkan ke Blockchain
  addBlockchainLog(`Gudang/Penggilingan memproses Gabah ${idPanen} menjadi Beras Giling ${newId} (${jumlahBeras} Kg)`, newId);

  alert(`Penggilingan Padi Berhasil! ID Giling: ${newId}. Beras telah masuk ke gudang logistik dan tercatat di Blockchain.`);
  
  // Reset Form
  document.getElementById('giling-jumlah').value = '';
  document.getElementById('giling-tanggal').value = '';

  renderDistributorDashboard();
}

function prosesPesananDistributor(idPesanan) {
  const pesanan = db.pesanan.find(p => p.ID_Pesanan === idPesanan);
  if (pesanan) {
    pesanan.Status = 'Diproses';
    setStorage('rc_pesanan', db.pesanan);

    // Blockchain
    addBlockchainLog(`Distributor menyetujui dan memproses pesanan ${idPesanan}`, idPesanan);

    alert(`Pesanan ${idPesanan} diubah status menjadi Diproses.`);
    renderDistributorDashboard();
  }
}

// Buka dialog/prompt untuk detail pengiriman
function bukaFormPengiriman(idPesanan) {
  const kurir = prompt('Masukkan nama kurir/ekspedisi:', 'Logistik RiceChain Express');
  if (kurir === null) return; // cancel

  const estimasi = prompt('Masukkan tanggal estimasi tiba (YYYY-MM-DD):', '2026-06-25');
  if (!estimasi) return;

  // Lakukan pengiriman
  const pesanan = db.pesanan.find(p => p.ID_Pesanan === idPesanan);
  if (pesanan) {
    pesanan.Status = 'Dikirim';
    setStorage('rc_pesanan', db.pesanan);

    const newIdKirim = 'SHP' + String(db.pengiriman.length + 1).padStart(3, '0');
    const newKirim = {
      ID_Kirim: newIdKirim,
      ID_Pesanan: idPesanan,
      Kurir: kurir,
      Status_Kirim: 'Diproses',
      Estimasi_Tiba: estimasi,
      Bukti_Terima: ''
    };

    db.pengiriman.push(newKirim);
    setStorage('rc_pengiriman', db.pengiriman);

    // Blockchain
    addBlockchainLog(`Distributor mengirim pesanan ${idPesanan} menggunakan ${kurir} (ID Kirim: ${newIdKirim})`, newIdKirim);

    alert(`Pengiriman dibuat! ID Kirim: ${newIdKirim}. Status pesanan diupdate ke DIKIRIM.`);
    renderDistributorDashboard();
  }
}

function updateStatusPengiriman(idKirim, statusKirim) {
  const kirim = db.pengiriman.find(k => k.ID_Kirim === idKirim);
  if (kirim) {
    kirim.Status_Kirim = statusKirim;
    setStorage('rc_pengiriman', db.pengiriman);

    // Blockchain
    addBlockchainLog(`Kurir memperbarui status pengiriman ${idKirim} ke: ${statusKirim}`, idKirim);

    alert(`Status pengiriman ${idKirim} diubah menjadi ${statusKirim}.`);
    renderDistributorDashboard();
  }
}

// ------------------------------------------
// C. LOGIKA & RENDER DASHBOARD PEMBELI
// ------------------------------------------
function renderPembeliDashboard() {
  // Render katalog beras
  renderKatalogBeras();

  // Render keranjang belanja pembeli
  renderKeranjang();

  // Render tabel riwayat transaksi (Escrow status)
  renderPembeliTransaksiTable();

  // Render tracking pesanan aktif
  renderTrackingTab();

  // Render QR Traceability scan
  renderQRTraceabilityTab();
}

function renderKatalogBeras() {
  const container = document.getElementById('buyer-catalog-grid');
  if (!container) return;
  container.innerHTML = '';

  const filterJenis = document.getElementById('filter-jenis').value;
  const filterKualitas = document.getElementById('filter-kualitas').value;

  db.produk_beras.forEach(p => {
    // Filter logic
    if (filterJenis && !p.Jenis_Beras.toLowerCase().includes(filterJenis.toLowerCase())) return;
    if (filterKualitas && p.Kualitas !== filterKualitas) return;

    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Icon beras / emoji panen
    card.innerHTML = `
      <div class="product-image-placeholder">
        🌾
        <span class="product-quality-badge">${p.Kualitas}</span>
      </div>
      <div class="product-details">
        <h4 class="product-name">${p.Jenis_Beras}</h4>
        <div class="product-meta-row">
          <span>Stok: <strong>${p.Stok} Kg</strong></span>
          <span>Lokasi: <strong>Karawang</strong></span>
        </div>
        <div class="product-price-row">
          <span class="product-price">Rp ${p.Harga.toLocaleString('id-ID')}/Kg</span>
          <button class="btn btn-primary" onclick="tambahKeKeranjang('${p.ID_Beras}')" ${p.Stok <= 0 ? 'disabled' : ''}>
            🛒 ${p.Stok <= 0 ? 'Stok Habis' : 'Beli'}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function tambahKeKeranjang(idBeras) {
  const produk = db.produk_beras.find(p => p.ID_Beras === idBeras);
  if (!produk) return;

  if (produk.Stok <= 0) {
    alert('Maaf, stok beras ini sedang habis!');
    return;
  }

  // Cek apakah produk sudah ada di keranjang
  const existing = keranjangBelanja.find(item => item.ID_Beras === idBeras);
  if (existing) {
    if (existing.Jumlah + 50 > produk.Stok) {
      alert('Jumlah pembelian melebihi kapasitas stok tersedia!');
      return;
    }
    existing.Jumlah += 50; // default beli per 50 kg
    existing.Subtotal = existing.Jumlah * produk.Harga;
  } else {
    keranjangBelanja.push({
      ID_Beras: idBeras,
      Jenis_Beras: produk.Jenis_Beras,
      Harga: produk.Harga,
      Jumlah: 50,
      Subtotal: 50 * produk.Harga
    });
  }

  alert(`${produk.Jenis_Beras} berhasil ditambahkan ke keranjang belanja (50 Kg).`);
  renderKeranjang();
  showDashboardTab('pembeli', 'keranjang');
}

function renderKeranjang() {
  const tableBody = document.getElementById('cart-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  let totalBeras = 0;
  let totalHarga = 0;

  keranjangBelanja.forEach((item, index) => {
    totalBeras += item.Jumlah;
    totalHarga += item.Subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.Jenis_Beras}</strong></td>
      <td>Rp ${item.Harga.toLocaleString('id-ID')}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn" style="padding: 2px 8px; background-color: var(--border-color);" onclick="updateJumlahKeranjang(${index}, -50)">-</button>
          <span>${item.Jumlah} Kg</span>
          <button class="btn" style="padding: 2px 8px; background-color: var(--border-color);" onclick="updateJumlahKeranjang(${index}, 50)">+</button>
        </div>
      </td>
      <td>Rp ${item.Subtotal.toLocaleString('id-ID')}</td>
      <td>
        <button class="btn btn-danger" style="padding: 4px 8px;" onclick="hapusDariKeranjang(${index})">❌</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  if (keranjangBelanja.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Keranjang belanja kosong. Silakan belanja di katalog.</td></tr>`;
  }

  // Update summary card
  document.getElementById('cart-total-qty').textContent = `${totalBeras} Kg`;
  document.getElementById('cart-total-price').textContent = `Rp ${totalHarga.toLocaleString('id-ID')}`;
}

function updateJumlahKeranjang(index, delta) {
  const item = keranjangBelanja[index];
  const prod = db.produk_beras.find(p => p.ID_Beras === item.ID_Beras);
  
  if (item.Jumlah + delta <= 0) {
    hapusDariKeranjang(index);
    return;
  }

  if (item.Jumlah + delta > prod.Stok) {
    alert('Pembelian melebihi batas stok tersedia!');
    return;
  }

  item.Jumlah += delta;
  item.Subtotal = item.Jumlah * item.Harga;
  renderKeranjang();
}

function hapusDariKeranjang(index) {
  keranjangBelanja.splice(index, 1);
  renderKeranjang();
}

function bayarEscrow() {
  if (keranjangBelanja.length === 0) {
    alert('Keranjang belanja kosong!');
    return;
  }

  // Hitung total bayar
  const totalBayar = keranjangBelanja.reduce((sum, item) => sum + item.Subtotal, 0);

  // Verifikasi saldo pembeli
  const pembeli = db.users.find(u => u.ID_User === currentUser.ID_User);
  if (pembeli.Saldo < totalBayar) {
    alert('Saldo Wallet Anda tidak mencukupi untuk melakukan transaksi escrow ini!');
    return;
  }

  // Proses Transaksi
  // Potong Saldo Pembeli
  pembeli.Saldo -= totalBayar;
  setStorage('rc_users', db.users);

  // Buat ID Pesanan baru
  const idPesanan = 'ORD' + String(db.pesanan.length + 1).padStart(3, '0');
  
  const newPesanan = {
    ID_Pesanan: idPesanan,
    ID_Pembeli: currentUser.ID_User,
    Tanggal: new Date().toISOString().split('T')[0],
    Status: 'Menunggu',
    Total_Harga: totalBayar,
    Status_Escrow: 'Ditahan / Escrow'
  };

  db.pesanan.push(newPesanan);
  setStorage('rc_pesanan', db.pesanan);

  // Masukkan Detail & Kurangi Stok Beras
  keranjangBelanja.forEach(item => {
    const detailId = 'DET' + String(db.detail_pesanan.length + 1).padStart(3, '0');
    db.detail_pesanan.push({
      ID_Detail: detailId,
      ID_Pesanan: idPesanan,
      ID_Beras: item.ID_Beras,
      Jumlah: item.Jumlah,
      Subtotal: item.Subtotal
    });

    // Kurangi Stok database
    const beras = db.produk_beras.find(b => b.ID_Beras === item.ID_Beras);
    if (beras) {
      beras.Stok -= item.Jumlah;
    }
  });

  setStorage('rc_detail_pesanan', db.detail_pesanan);
  setStorage('rc_produk_beras', db.produk_beras);

  // Blockchain Ledger
  addBlockchainLog(`Pembeli ${currentUser.Nama} memesan beras ${idPesanan} & mengunci dana Escrow Rp ${totalBayar.toLocaleString('id-ID')}`, idPesanan + '-ESCROW');

  // Reset keranjang
  keranjangBelanja = [];
  alert(`Pembayaran Escrow Berhasil! Dana Anda senilai Rp ${totalBayar.toLocaleString('id-ID')} saat ini aman dikunci di sistem Escrow Smart Contract. Status pesanan: Menunggu persetujuan Distributor.`);
  
  updateGlobalUserInterface();
  renderPembeliDashboard();
  showDashboardTab('pembeli', 'transaksi');
}

function renderPembeliTransaksiTable() {
  const tableBody = document.getElementById('pembeli-transaksi-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  const myOrders = db.pesanan.filter(p => p.ID_Pembeli === currentUser.ID_User);

  myOrders.forEach(p => {
    let actionBtn = '-';
    if (p.Status === 'Dikirim') {
      actionBtn = `<button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="konfirmasiBarangDiterima('${p.ID_Pesanan}')">Konfirmasi Diterima</button>`;
    } else if (p.Status === 'Menunggu') {
      actionBtn = `<button class="btn btn-danger" style="padding: 6px 12px; font-size: 0.8rem;" onclick="batalkanPesananPembeli('${p.ID_Pesanan}')">Batalkan</button>`;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ID_Pesanan}</strong></td>
      <td>${p.Tanggal}</td>
      <td>Rp ${p.Total_Harga.toLocaleString('id-ID')}</td>
      <td><span class="badge-status ${p.Status.toLowerCase()}">${p.Status}</span></td>
      <td><span class="badge-status ${p.Status_Escrow === 'Ditahan / Escrow' ? 'escrow' : (p.Status_Escrow === 'Refund' ? 'refund' : 'selesai')}">${p.Status_Escrow}</span></td>
      <td>${actionBtn}</td>
    `;
    tableBody.appendChild(tr);
  });

  if (myOrders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Belum ada riwayat pemesanan.</td></tr>`;
  }
}

function batalkanPesananPembeli(idPesanan) {
  if (!confirm(`Apakah Anda yakin ingin membatalkan pesanan ${idPesanan}? Dana Escrow akan di-refund otomatis.`)) return;

  const pesanan = db.pesanan.find(p => p.ID_Pesanan === idPesanan);
  if (pesanan && pesanan.Status === 'Menunggu') {
    pesanan.Status = 'Refund';
    pesanan.Status_Escrow = 'Refund';

    // Kembalikan Stok Beras
    const details = db.detail_pesanan.filter(d => d.ID_Pesanan === idPesanan);
    details.forEach(d => {
      const beras = db.produk_beras.find(b => b.ID_Beras === d.ID_Beras);
      if (beras) {
        beras.Stok += d.Jumlah;
      }
    });

    // Kembalikan Saldo ke Pembeli
    const pembeli = db.users.find(u => u.ID_User === pesanan.ID_Pembeli);
    if (pembeli) {
      pembeli.Saldo += pesanan.Total_Harga;
    }

    setStorage('rc_pesanan', db.pesanan);
    setStorage('rc_produk_beras', db.produk_beras);
    setStorage('rc_users', db.users);

    // Blockchain
    addBlockchainLog(`Pesanan ${idPesanan} dibatalkan oleh Pembeli. Dana Escrow di-refund ke Pembeli`, idPesanan + '-REFUND');

    alert(`Pesanan ${idPesanan} berhasil dibatalkan. Dana senilai Rp ${pesanan.Total_Harga.toLocaleString('id-ID')} telah di-refund ke dompet Anda.`);
    updateGlobalUserInterface();
    renderPembeliDashboard();
  }
}

function konfirmasiBarangDiterima(idPesanan) {
  const pesanan = db.pesanan.find(p => p.ID_Pesanan === idPesanan);
  if (pesanan && pesanan.Status === 'Dikirim') {
    // Ubah status transaksi
    pesanan.Status = 'Selesai';
    pesanan.Status_Escrow = 'Dana Dicairkan ke Penjual';

    // Update status pengiriman kurir
    const kirim = db.pengiriman.find(k => k.ID_Pesanan === idPesanan);
    if (kirim) {
      kirim.Status_Kirim = 'Diterima';
      kirim.Bukti_Terima = `Diterima langsung oleh pembeli pada ${new Date().toISOString().split('T')[0]}`;
    }

    // Cairkan dana ke rekening Distributor (Penjual)
    const distributor = db.users.find(u => u.ID_User === 'distributor1');
    if (distributor) {
      distributor.Saldo += pesanan.Total_Harga;
    }

    setStorage('rc_pesanan', db.pesanan);
    setStorage('rc_pengiriman', db.pengiriman);
    setStorage('rc_users', db.users);

    // Blockchain
    addBlockchainLog(`Pembeli mengonfirmasi penerimaan barang ${idPesanan}. Smart Contract mencairkan dana Escrow Rp ${pesanan.Total_Harga.toLocaleString('id-ID')} ke Distributor`, idPesanan + '-SETTLED');

    alert(`Terima kasih! Pesanan ${idPesanan} telah selesai. Dana escrow telah berhasil dicairkan kepada penjual secara otomatis melalui Blockchain Ledger.`);
    
    updateGlobalUserInterface();
    renderPembeliDashboard();
  }
}

function renderTrackingTab() {
  const select = document.getElementById('tracking-pesanan-select');
  const trackingArea = document.getElementById('tracking-timeline-area');
  if (!select || !trackingArea) return;

  // Isi dropdown dengan pesanan pembeli
  const myOrders = db.pesanan.filter(p => p.ID_Pembeli === currentUser.ID_User);
  
  // Simpan nilai lama agar tidak reset saat re-render
  const valSebelumnya = select.value;
  select.innerHTML = '<option value="">-- Pilih ID Pesanan untuk Melacak --</option>';
  
  myOrders.forEach(o => {
    const opt = document.createElement('option');
    opt.value = o.ID_Pesanan;
    opt.textContent = `${o.ID_Pesanan} - ${o.Tanggal} (Status: ${o.Status})`;
    select.appendChild(opt);
  });

  if (valSebelumnya && myOrders.some(o => o.ID_Pesanan === valSebelumnya)) {
    select.value = valSebelumnya;
    renderTrackingTimeline(valSebelumnya);
  } else {
    trackingArea.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px 0;">Pilih pesanan Anda di atas untuk melacak secara langsung di timeline digital.</div>`;
  }
}

function renderTrackingTimeline(idPesanan) {
  const trackingArea = document.getElementById('tracking-timeline-area');
  if (!trackingArea) return;

  const order = db.pesanan.find(o => o.ID_Pesanan === idPesanan);
  if (!order) {
    trackingArea.innerHTML = '';
    return;
  }

  const kirim = db.pengiriman.find(k => k.ID_Pesanan === idPesanan);
  const detail = db.detail_pesanan.filter(d => d.ID_Pesanan === idPesanan);

  // States:
  // Step 1: Pesanan Dibuat (Selalu Done)
  // Step 2: Diproses (Menunggu / Diproses / Dikirim / Selesai)
  // Step 3: Dikirim (Dikirim / Selesai)
  // Step 4: Diterima (Selesai)

  const s1Class = 'completed';
  let s2Class = '';
  let s3Class = '';
  let s4Class = '';

  if (order.Status === 'Diproses') {
    s2Class = 'completed';
  } else if (order.Status === 'Dikirim') {
    s2Class = 'completed';
    s3Class = 'completed';
  } else if (order.Status === 'Selesai') {
    s2Class = 'completed';
    s3Class = 'completed';
    s4Class = 'completed';
  } else if (order.Status === 'Refund') {
    s2Class = 'refund';
  }

  trackingArea.innerHTML = `
    <div style="background-color: var(--primary-green-light); padding: 15px; border-radius: var(--border-radius-sm); margin-bottom: 25px; border: 1.5px solid var(--primary-green);">
      <h4 style="color: var(--primary-green-hover);">🎫 Ringkasan Transaksi Escrow</h4>
      <p style="font-size: 0.9rem; margin-top: 5px;">
        ID Pesanan: <strong>${order.ID_Pesanan}</strong><br>
        Tanggal Pesanan: <strong>${order.Tanggal}</strong><br>
        Status Escrow Smart Contract: <span class="badge-status ${order.Status_Escrow === 'Ditahan / Escrow' ? 'escrow' : (order.Status_Escrow === 'Refund' ? 'refund' : 'selesai')}">${order.Status_Escrow}</span><br>
        Total Dana Terkunci: <strong>Rp ${order.Total_Harga.toLocaleString('id-ID')}</strong>
      </p>
    </div>

    <div class="tracking-timeline">
      <div class="timeline-item ${s1Class}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-title">Pesanan Berhasil Dibuat</div>
          <div class="timeline-desc">Pembayaran escrow dikunci di ledger RiceChain. Menunggu verifikasi distributor.</div>
          <div class="timeline-time">${order.Tanggal} 10:00:00</div>
        </div>
      </div>
      
      <div class="timeline-item ${s2Class ? s2Class : ''}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-title">Diproses oleh Penggilingan/Distributor</div>
          <div class="timeline-desc">Distributor menyiapkan beras premium terbaik dari panen petani lokal.</div>
          <div class="timeline-time">${order.Status !== 'Menunggu' ? order.Tanggal + ' 14:00:00' : 'Menunggu antrean...'}</div>
        </div>
      </div>

      <div class="timeline-item ${s3Class ? s3Class : ''}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-title">Dalam Pengiriman Kurir</div>
          <div class="timeline-desc">${kirim ? `Pesanan sedang diantar oleh: <strong>${kirim.Kurir}</strong> (Estimasi tiba: ${kirim.Estimasi_Tiba})` : 'Pesanan belum diserahkan ke ekspedisi.'}</div>
          <div class="timeline-time">${kirim ? 'Status: ' + kirim.Status_Kirim : '-'}</div>
        </div>
      </div>

      <div class="timeline-item ${s4Class ? s4Class : ''}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-title">Konfirmasi Diterima Pembeli</div>
          <div class="timeline-desc">${order.Status === 'Selesai' ? 'Barang telah diterima pembeli. Dana dicairkan otomatis ke penjual.' : 'Menunggu pembeli melakukan konfirmasi penerimaan barang.'}</div>
          <div class="timeline-time">${order.Status === 'Selesai' ? 'Selesai' : '-'}</div>
        </div>
      </div>
    </div>
  `;
}

function handleTrackingSelectChange() {
  const select = document.getElementById('tracking-pesanan-select');
  if (select) {
    renderTrackingTimeline(select.value);
  }
}

function renderQRTraceabilityTab() {
  const select = document.getElementById('traceability-beras-select');
  const detailsArea = document.getElementById('traceability-details-area');
  if (!select || !detailsArea) return;

  // Populate dropdown katalog beras
  const valSebelumnya = select.value;
  select.innerHTML = '<option value="">-- Pilih Beras yang Dibeli --</option>';
  
  db.produk_beras.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.ID_Beras;
    opt.textContent = `${b.ID_Beras} - ${b.Jenis_Beras}`;
    select.appendChild(opt);
  });

  if (valSebelumnya && db.produk_beras.some(b => b.ID_Beras === valSebelumnya)) {
    select.value = valSebelumnya;
    renderQRTraceabilityDetails(valSebelumnya);
  } else {
    detailsArea.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px 0;">Silakan pilih jenis beras di sebelah kiri untuk melacak rantai pasok blockchain secara lengkap.</div>`;
  }
}

function renderQRTraceabilityDetails(idBeras) {
  const detailsArea = document.getElementById('traceability-details-area');
  if (!detailsArea) return;

  const beras = db.produk_beras.find(b => b.ID_Beras === idBeras);
  if (!beras) {
    detailsArea.innerHTML = '';
    return;
  }

  // Trace back data
  // 1. Petani & Panen
  const panen = db.panen.find(p => p.ID_Petani === beras.ID_Petani); // Ambil contoh panen
  const giling = db.penggilingan.find(g => g.ID_Giling === beras.ID_Giling);

  const blockchainRelevan = db.blockchain_log.filter(log => 
    log.ID_Transaksi.includes(idBeras) || 
    (panen && log.ID_Transaksi.includes(panen.ID_Panen)) || 
    (giling && log.ID_Transaksi.includes(giling.ID_Giling))
  );

  let blockchainHtml = '';
  if (blockchainRelevan.length > 0) {
    blockchainRelevan.forEach(block => {
      blockchainHtml += `
        <div class="audit-block-node">
          <div class="audit-block-title">
            <span>Blok #${block.ID_Block}</span>
            <span style="color: var(--primary-green-hover); font-size: 0.8rem;">🔒 Terverifikasi</span>
          </div>
          <div class="audit-block-meta">
            <div><span class="audit-label">Aktivitas:</span></div>
            <div><span class="audit-value">${block.Aktivitas}</span></div>
            <div><span class="audit-label">Hash:</span></div>
            <div><span class="audit-value" style="font-size:0.7rem; color:var(--primary-green-hover);">${block.Hash.substring(0, 24)}...</span></div>
            <div><span class="audit-label">Prev Hash:</span></div>
            <div><span class="audit-value" style="font-size:0.7rem;">${block.Previous_Hash.substring(0, 24)}...</span></div>
            <div><span class="audit-label">Waktu:</span></div>
            <div><span class="audit-value">${block.Timestamp}</span></div>
          </div>
        </div>
      `;
    });
  } else {
    // Fallback ambil 3 data blockchain awal
    db.blockchain_log.slice(0, 3).forEach(block => {
      blockchainHtml += `
        <div class="audit-block-node">
          <div class="audit-block-title">
            <span>Blok #${block.ID_Block}</span>
            <span style="color: var(--primary-green-hover); font-size: 0.8rem;">🔒 Ledger</span>
          </div>
          <div class="audit-block-meta">
            <div><span class="audit-label">Aktivitas:</span></div>
            <div><span class="audit-value">${block.Aktivitas}</span></div>
            <div><span class="audit-label">Hash:</span></div>
            <div><span class="audit-value" style="font-size:0.7rem; color:var(--primary-green-hover);">${block.Hash.substring(0, 24)}...</span></div>
            <div><span class="audit-label">Waktu:</span></div>
            <div><span class="audit-value">${block.Timestamp}</span></div>
          </div>
        </div>
      `;
    });
  }

  detailsArea.innerHTML = `
    <h3 style="margin-bottom: 20px; font-size:1.3rem;">🌾 Data Traceability Komoditas [${beras.ID_Beras}]</h3>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
      <div style="background-color: var(--bg-light); padding: 15px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
        <strong style="color: var(--primary-green-hover);">🧑‍🌾 Profil Produsen Hulu</strong>
        <p style="font-size: 0.85rem; margin-top: 5px; line-height: 1.5;">
          Petani Mitra: <strong>Pak Joko Widodo</strong><br>
          Kelompok Tani: <strong>Tani Makmur Sejahtera</strong><br>
          Asal Wilayah: <strong>Karawang, Jawa Barat</strong><br>
          ID Registrasi Petani: <strong>PET001</strong>
        </p>
      </div>

      <div style="background-color: var(--bg-light); padding: 15px; border-radius: var(--border-radius-sm); border: 1px solid var(--border-color);">
        <strong style="color: var(--tech-blue-hover);">⚙️ Penggilingan & Logistik</strong>
        <p style="font-size: 0.85rem; margin-top: 5px; line-height: 1.5;">
          Gudang/Penggiling: <strong>CV Rice Makmur</strong><br>
          Tanggal Giling Padi: <strong>${giling ? giling.Tanggal_Giling : '2026-06-03'}</strong><br>
          Kandungan Air Beras: <strong>14% (Standard Nasional)</strong><br>
          Kualitas Produksi: <strong>${beras.Kualitas} Grade</strong>
        </p>
      </div>
    </div>

    <div style="background: white; border: 1.5px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 15px; margin-bottom: 25px;">
      <h4 style="margin-bottom: 10px;">📋 Log Riwayat Panen Asal-Usul</h4>
      <p style="font-size: 0.85rem;">
        ID Panen Gabah: <strong>${panen ? panen.ID_Panen : 'PAN001'}</strong> | Tanggal Panen: <strong>${panen ? panen.Tanggal_Panen : '2026-06-01'}</strong><br>
        Lokasi Ladang: <strong>${panen ? panen.Lokasi : 'Sawah Karawang Barat'}</strong><br>
        Kondisi Lahan: <strong>Bebas Pestisida Kimia Berlebih / Organik Terkontrol</strong>
      </p>
    </div>

    <h4 style="margin-bottom: 15px; border-top: 1.5px solid var(--border-color); padding-top: 15px;">🔗 Rantai Ledger Audit Blockchain Relevan</h4>
    <div class="blockchain-audit-timeline">
      ${blockchainHtml}
    </div>
  `;
}

function handleTraceabilitySelectChange() {
  const select = document.getElementById('traceability-beras-select');
  if (select) {
    renderQRTraceabilityDetails(select.value);
  }
}

// ------------------------------------------
// D. LOGIKA & RENDER DASHBOARD ADMIN
// ------------------------------------------
function renderAdminDashboard() {
  // Card Statistik
  const userCount = db.users.length;
  const petaniCount = db.petani.length;
  const distributorCount = 1; // CV Rice Makmur
  const pembeliCount = db.users.filter(u => u.Role === 'Pembeli').length;
  const transaksiCount = db.pesanan.length;
  const pengirimanCount = db.pengiriman.length;

  document.getElementById('admin-stat-users').textContent = userCount;
  document.getElementById('admin-stat-petani').textContent = petaniCount;
  document.getElementById('admin-stat-dist').textContent = distributorCount;
  document.getElementById('admin-stat-pembeli').textContent = pembeliCount;
  document.getElementById('admin-stat-transaksi').textContent = transaksiCount;
  document.getElementById('admin-stat-pengiriman').textContent = pengirimanCount;

  // Render Tabel Verifikasi Pengguna
  renderAdminUsersTable();

  // Render Grafik Keuangan Finansial Sederhana
  renderAdminFinansialChart();

  // Render Riwayat Finansial Escrow
  renderAdminFinansialDetails();

  // Render Audit Blockchain Lengkap
  renderBlockchainLogTable('admin-blockchain-table');
}

function renderAdminUsersTable() {
  const tableBody = document.getElementById('admin-users-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = '';

  db.users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${u.ID_User}</strong></td>
      <td>${u.Nama}</td>
      <td>${u.Email}</td>
      <td><span class="badge-status diproses">${u.Role}</span></td>
      <td><span class="badge-status selesai">Terverifikasi</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="alert('User ${u.Nama} sudah dalam status terverifikasi di Smart Contract.')" disabled>Verified</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderAdminFinansialChart() {
  const chartWrapper = document.getElementById('finansial-bar-chart');
  if (!chartWrapper) return;
  chartWrapper.innerHTML = '';

  // Hitung jumlah dana escrow, cair, refund, komisi
  let totalEscrow = 0;
  let totalCair = 0;
  let totalRefund = 0;

  db.pesanan.forEach(p => {
    if (p.Status_Escrow === 'Ditahan / Escrow') {
      totalEscrow += p.Total_Harga;
    } else if (p.Status_Escrow === 'Dana Dicairkan ke Penjual') {
      totalCair += p.Total_Harga;
    } else if (p.Status_Escrow === 'Refund') {
      totalRefund += p.Total_Harga;
    }
  });

  const komisiPlatform = Math.floor(totalCair * 0.02); // 2% komisi

  const finData = [
    { label: 'Escrow Lock', val: totalEscrow },
    { label: 'Settlement', val: totalCair },
    { label: 'Refund', val: totalRefund },
    { label: 'Komisi (2%)', val: komisiPlatform }
  ];

  const maxVal = Math.max(...finData.map(d => d.val), 1000000);

  finData.forEach((item, idx) => {
    const heightPercentage = Math.min((item.val / maxVal) * 100, 100);
    const isSecondary = idx % 2 !== 0;

    const column = document.createElement('div');
    column.className = `bar-column ${isSecondary ? 'secondary' : ''}`;
    column.innerHTML = `
      <div class="bar-fill" style="height: ${heightPercentage}%;" data-value="Rp ${item.val.toLocaleString('id-ID')}"></div>
      <div class="chart-label">${item.label}</div>
    `;
    chartWrapper.appendChild(column);
  });
}

function renderAdminFinansialDetails() {
  // Hitung Nilai Finansial
  let totalEscrow = 0;
  let totalCair = 0;
  let totalRefund = 0;

  db.pesanan.forEach(p => {
    if (p.Status_Escrow === 'Ditahan / Escrow') {
      totalEscrow += p.Total_Harga;
    } else if (p.Status_Escrow === 'Dana Dicairkan ke Penjual') {
      totalCair += p.Total_Harga;
    } else if (p.Status_Escrow === 'Refund') {
      totalRefund += p.Total_Harga;
    }
  });

  const komisiPlatform = Math.floor(totalCair * 0.02);

  document.getElementById('admin-fin-escrow').textContent = `Rp ${totalEscrow.toLocaleString('id-ID')}`;
  document.getElementById('admin-fin-settlement').textContent = `Rp ${totalCair.toLocaleString('id-ID')}`;
  document.getElementById('admin-fin-refund').textContent = `Rp ${totalRefund.toLocaleString('id-ID')}`;
  document.getElementById('admin-fin-commission').textContent = `Rp ${komisiPlatform.toLocaleString('id-ID')}`;
}

// ------------------------------------------
// GENERAL: RENDER BLOCKCHAIN LOG LEDGER
// ------------------------------------------
function renderBlockchainLogTable(tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);
  if (!tableBody) return;
  tableBody.innerHTML = '';

  // Copy blockchain array dan reverse untuk menempatkan blok terbaru di paling atas
  const reversedChain = [...db.blockchain_log].reverse();

  reversedChain.forEach(block => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${block.ID_Block}</strong></td>
      <td><span style="font-family: monospace; font-size: 0.8rem; background-color: var(--bg-light); padding: 2px 6px; border-radius: 4px;">${block.ID_Transaksi}</span></td>
      <td>${block.Aktivitas}</td>
      <td style="font-family: monospace; font-size: 0.8rem; color: var(--primary-green-hover);" title="${block.Hash}">
        ${block.Hash.substring(0, 16)}...
      </td>
      <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);" title="${block.Previous_Hash}">
        ${block.Previous_Hash.substring(0, 16)}...
      </td>
      <td style="font-size: 0.8rem;">${block.Timestamp}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// ==========================================
// 6. EVENT BINDINGS DAN ON-LOAD INITIALIZATION
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
  // Cek apakah user sudah masuk sebelumnya dari session lama
  if (currentUser && currentRole) {
    if (currentRole === 'Petani') {
      showPage('petani-dashboard');
      showDashboardTab('petani', 'home');
    } else if (currentRole === 'Penggilingan/Distributor') {
      showPage('distributor-dashboard');
      showDashboardTab('distributor', 'stok');
    } else if (currentRole === 'Pembeli') {
      showPage('pembeli-dashboard');
      showDashboardTab('pembeli', 'katalog');
    } else if (currentRole === 'Admin') {
      showPage('admin-dashboard');
      showDashboardTab('admin', 'control');
    }
  } else {
    // Default show landing page
    showPage('landing-page');
  }

  // Event handler untuk form login
  const loginForm = document.getElementById('login-form-el');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginUser();
    });
  }

  // Update visual data blockchain di landing page alur
  const landingBlockchainContainer = document.getElementById('landing-blockchain-blocks');
  if (landingBlockchainContainer) {
    landingBlockchainContainer.innerHTML = '';
    // Tampilkan 5 blok dummy awal di landing page
    db.blockchain_log.slice(0, 5).forEach((block, idx) => {
      const card = document.createElement('div');
      card.className = 'block-card';
      card.innerHTML = `
        <div class="block-header">
          <span class="block-num">BLOCK #${block.ID_Block}</span>
          <span class="block-tag">${block.ID_Transaksi.split('-')[0]}</span>
        </div>
        <div class="block-details">
          <p><strong>Aktivitas:</strong></p>
          <p style="color: var(--text-dark); font-size:0.85rem; margin-bottom: 5px;">${block.Aktivitas.substring(0, 45)}...</p>
          <p><strong>Hash:</strong></p>
          <p class="block-hash">${block.Hash.substring(0, 16)}...</p>
          <p><strong>Prev Hash:</strong></p>
          <p class="block-prev-hash">${block.Previous_Hash.substring(0, 16)}...</p>
        </div>
      `;
      landingBlockchainContainer.appendChild(card);

      if (idx < 4) {
        const link = document.createElement('div');
        link.className = 'block-link';
        link.innerHTML = '⛓️';
        landingBlockchainContainer.appendChild(link);
      }
    });
  }
});
