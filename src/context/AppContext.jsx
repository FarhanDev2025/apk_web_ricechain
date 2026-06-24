import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Simple custom hashing function to generate a hex-like hash with a dummy prefix for visuals
const generateBlockchainHash = (idBlock, prevHash, timestamp, activity) => {
  const str = `${idBlock}-${prevHash}-${timestamp}-${activity}`;
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = (hash1 << 5) - hash1 + char;
    hash1 |= 0; // Convert to 32bit integer
    hash2 = (hash2 << 7) - hash2 + char * 13;
    hash2 |= 0;
  }
  const h1 = Math.abs(hash1).toString(16).padStart(8, '0');
  const h2 = Math.abs(hash2).toString(16).padStart(8, '0');
  return `0000${h1}${h2}`.substring(0, 32);
};

export const AppProvider = ({ children }) => {
  // --- DEFAULT DUMMY DATA ---
  const defaultUsers = [
    { id_user: 'USR001', nama: 'Budi Santoso', email: 'budi@ricechain.com', password: 'password', role: 'petani', verified: true },
    { id_user: 'USR002', nama: 'Gilingan Jaya (H. Slamet)', email: 'slamet@ricechain.com', password: 'password', role: 'distributor', verified: true },
    { id_user: 'USR003', nama: 'Toko Beras Berkah', email: 'toko.berkah@gmail.com', password: 'password', role: 'pembeli', verified: true },
    { id_user: 'USR004', nama: 'Super Admin RiceChain', email: 'admin@ricechain.com', password: 'password', role: 'admin', verified: true },
    { id_user: 'USR005', nama: 'Petani Sukardi', email: 'sukardi@ricechain.com', password: 'password', role: 'petani', verified: false }
  ];

  const defaultFarmers = [
    { id_petani: 'PET001', id_user: 'USR001', alamat: 'Desa Sidomulyo, Karanganyar, Jawa Tengah', no_hp: '081234567890', saldo: 15400000 },
    { id_petani: 'PET002', id_user: 'USR005', alamat: 'Desa Sukamaju, Subang, Jawa Barat', no_hp: '085678901234', saldo: 0 }
  ];

  const defaultHarvests = [
    { id_panen: 'PAN001', id_petani: 'PET001', nama_petani: 'Budi Santoso', tanggal_panen: '2026-06-01', jumlah_gabah: 2500, kualitas: 'A', lokasi: 'Karanganyar', status: 'Processed' },
    { id_panen: 'PAN002', id_petani: 'PET001', nama_petani: 'Budi Santoso', tanggal_panen: '2026-06-10', jumlah_gabah: 1800, kualitas: 'B', lokasi: 'Karanganyar', status: 'Processed' },
    { id_panen: 'PAN003', id_petani: 'PET001', nama_petani: 'Budi Santoso', tanggal_panen: '2026-06-20', jumlah_gabah: 3000, kualitas: 'A', lokasi: 'Subang', status: 'Raw' }
  ];

  const defaultMillings = [
    { id_giling: 'GIL001', id_panen: 'PAN001', jumlah_beras: 1600, tanggal_giling: '2026-06-03', kualitas: 'A' },
    { id_giling: 'GIL002', id_panen: 'PAN002', jumlah_beras: 1100, tanggal_giling: '2026-06-12', kualitas: 'B' }
  ];

  const defaultProducts = [
    { id_beras: 'BRS001', id_petani: 'PET001', nama_petani: 'Budi Santoso', jenis_beras: 'Pandan Wangi Premium', kualitas: 'A', stok: 850, harga: 16000, safety_stock: 300, lokasi: 'Karanganyar' },
    { id_beras: 'BRS002', id_petani: 'PET001', nama_petani: 'Budi Santoso', jenis_beras: 'Cianjur Pulen', kualitas: 'B', stok: 200, harga: 14000, safety_stock: 250, lokasi: 'Karanganyar' }, // Low stock alert target
    { id_beras: 'BRS003', id_petani: 'PET001', nama_petani: 'Budi Santoso', jenis_beras: 'Rojolele Organik', kualitas: 'A', stok: 600, harga: 18500, safety_stock: 150, lokasi: 'Subang' }
  ];

  const defaultOrders = [
    { id_pesanan: 'ORD001', id_pembeli: 'USR003', nama_pembeli: 'Toko Beras Berkah', tanggal: '2026-06-15', status: 'Selesai', total_harga: 8000000, pembayaran_status: 'Released' },
    { id_pesanan: 'ORD002', id_pembeli: 'USR003', nama_pembeli: 'Toko Beras Berkah', tanggal: '2026-06-21', status: 'Dikirim', total_harga: 4200000, pembayaran_status: 'Hold/Escrow' }
  ];

  const defaultOrderDetails = [
    { id_detail: 'DTL001', id_pesanan: 'ORD001', id_beras: 'BRS001', jenis_beras: 'Pandan Wangi Premium', jumlah: 500, subtotal: 8000000 },
    { id_detail: 'DTL002', id_pesanan: 'ORD002', id_beras: 'BRS002', jenis_beras: 'Cianjur Pulen', jumlah: 300, subtotal: 4200000 }
  ];

  const defaultShippings = [
    { id_kirim: 'SHP001', id_pesanan: 'ORD001', kurir: 'SLogistics', status_kirim: 'Sampai', estimasi_tiba: '2026-06-17', bukti_terima: 'Diterima oleh Bpk. Anto (Staff Toko Berkas) - TTD Terlampir' },
    { id_kirim: 'SHP002', id_pesanan: 'ORD002', kurir: 'ExpressCargo', status_kirim: 'Diperjalanan', estimasi_tiba: '2026-06-24', bukti_terima: '' }
  ];

  // Genesis blocks + logs
  const defaultBlockchain = [
    {
      id_block: 1,
      id_transaksi: 'GENESIS',
      aktivitas: 'Inisialisasi Ledger Blockchain RiceChain',
      hash: '000083a2b8e21cfb92d7a22ef45b23d9',
      previous_hash: '00000000000000000000000000000000',
      timestamp: '2026-06-01 08:00:00'
    },
    {
      id_block: 2,
      id_transaksi: 'PAN001',
      aktivitas: 'Input data Panen PAN001 (2500 kg Gabah Kualitas A) oleh Petani USR001',
      hash: '0000bf92e10dbfc31c890e72bd4e69b0',
      previous_hash: '000083a2b8e21cfb92d7a22ef45b23d9',
      timestamp: '2026-06-01 09:30:15'
    },
    {
      id_block: 3,
      id_transaksi: 'GIL001',
      aktivitas: 'Proses Penggilingan GIL001 untuk Panen PAN001. Hasil: 1600 kg Beras Kualitas A',
      hash: '0000f72a420b9c1da7e23bb4109faee0',
      previous_hash: '0000bf92e10dbfc31c890e72bd4e69b0',
      timestamp: '2026-06-03 14:15:22'
    },
    {
      id_block: 4,
      id_transaksi: 'ORD001',
      aktivitas: 'Pesanan ORD001 dibuat oleh Toko Beras Berkah. Dana Escrow ditahan: Rp8.000.000',
      hash: '0000d6c905ba7e2c91dfcb1e73e91da5',
      previous_hash: '0000f72a420b9c1da7e23bb4109faee0',
      timestamp: '2026-06-15 10:05:00'
    },
    {
      id_block: 5,
      id_transaksi: 'SHP001',
      aktivitas: 'Pengiriman ORD001 diproses via SLogistics. Status: Diperjalanan',
      hash: '0000ca89f02be8e3ad5d09f7a5d12ef4',
      previous_hash: '0000d6c905ba7e2c91dfcb1e73e91da5',
      timestamp: '2026-06-15 13:40:00'
    },
    {
      id_block: 6,
      id_transaksi: 'ORD001_RELEASE',
      aktivitas: 'Konfirmasi Penerimaan ORD001 oleh Toko Beras Berkah. Dana Rp8.000.000 dicairkan ke Petani',
      hash: '0000ff3b821a7cd90bc876de2a9341ef',
      previous_hash: '0000ca89f02be8e3ad5d09f7a5d12ef4',
      timestamp: '2026-06-17 16:22:00'
    }
  ];

  // --- LOCAL STORAGE STATE INITIALIZATION ---
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('rc_users')) || defaultUsers);
  const [farmers, setFarmers] = useState(() => JSON.parse(localStorage.getItem('rc_farmers')) || defaultFarmers);
  const [harvests, setHarvests] = useState(() => JSON.parse(localStorage.getItem('rc_harvests')) || defaultHarvests);
  const [millings, setMillings] = useState(() => JSON.parse(localStorage.getItem('rc_millings')) || defaultMillings);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('rc_products')) || defaultProducts);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('rc_orders')) || defaultOrders);
  const [orderDetails, setOrderDetails] = useState(() => JSON.parse(localStorage.getItem('rc_orderDetails')) || defaultOrderDetails);
  const [shippings, setShippings] = useState(() => JSON.parse(localStorage.getItem('rc_shippings')) || defaultShippings);
  const [blockchain, setBlockchain] = useState(() => JSON.parse(localStorage.getItem('rc_blockchain')) || defaultBlockchain);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('rc_currentUser')) || null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rc_users', JSON.stringify(users));
    localStorage.setItem('rc_farmers', JSON.stringify(farmers));
    localStorage.setItem('rc_harvests', JSON.stringify(harvests));
    localStorage.setItem('rc_millings', JSON.stringify(millings));
    localStorage.setItem('rc_products', JSON.stringify(products));
    localStorage.setItem('rc_orders', JSON.stringify(orders));
    localStorage.setItem('rc_orderDetails', JSON.stringify(orderDetails));
    localStorage.setItem('rc_shippings', JSON.stringify(shippings));
    localStorage.setItem('rc_blockchain', JSON.stringify(blockchain));
    localStorage.setItem('rc_currentUser', JSON.stringify(currentUser));
  }, [users, farmers, harvests, millings, products, orders, orderDetails, shippings, blockchain, currentUser]);

  // Format Current Date Helper
  const getFormattedDateTime = () => {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // --- BLOCKCHAIN HELPER ACTION ---
  const addBlockToChain = (idTx, activity) => {
    setBlockchain((prev) => {
      const prevBlock = prev[prev.length - 1];
      const newId = prevBlock.id_block + 1;
      const timestamp = getFormattedDateTime();
      const hash = generateBlockchainHash(newId, prevBlock.hash, timestamp, activity);

      const newBlock = {
        id_block: newId,
        id_transaksi: idTx,
        aktivitas: activity,
        hash: hash,
        previous_hash: prevBlock.hash,
        timestamp: timestamp
      };

      return [...prev, newBlock];
    });
  };

  // --- ACTIONS ---

  // User Verification
  const verifyUser = (userId, verified) => {
    setUsers((prev) =>
      prev.map((u) => (u.id_user === userId ? { ...u, verified } : u))
    );
  };

  // Add Harvest (Petani)
  const addHarvest = (farmerId, farmerName, qty, quality, location, harvestDate) => {
    const newId = `PAN${String(harvests.length + 1).padStart(3, '0')}`;
    const newHarvest = {
      id_panen: newId,
      id_petani: farmerId,
      nama_petani: farmerName,
      tanggal_panen: harvestDate,
      jumlah_gabah: Number(qty),
      kualitas: quality,
      lokasi: location,
      status: 'Raw'
    };

    setHarvests((prev) => [...prev, newHarvest]);
    addBlockToChain(newId, `Input data Panen ${newId} (${qty} kg Gabah Kualitas ${quality}) oleh Petani ${farmerName}`);
    return newId;
  };

  // Add Milling (Distributor)
  const addMilling = (idPanen, qtyBerasOut, dateMilled, qualityMilled, targetProductId) => {
    // Find the harvest
    const harvest = harvests.find((h) => h.id_panen === idPanen);
    if (!harvest) return null;

    const newMillingId = `GIL${String(millings.length + 1).padStart(3, '0')}`;
    const newMilling = {
      id_giling: newMillingId,
      id_panen: idPanen,
      jumlah_beras: Number(qtyBerasOut),
      tanggal_giling: dateMilled,
      kualitas: qualityMilled
    };

    // Update harvest status to Processed
    setHarvests((prev) =>
      prev.map((h) => (h.id_panen === idPanen ? { ...h, status: 'Processed' } : h))
    );

    // Add to millings list
    setMillings((prev) => [...prev, newMilling]);

    // Add stock to Products
    setProducts((prev) =>
      prev.map((p) =>
        p.id_beras === targetProductId ? { ...p, stok: p.stok + Number(qtyBerasOut) } : p
      )
    );

    addBlockToChain(
      newMillingId,
      `Proses Penggilingan ${newMillingId} untuk Panen ${idPanen}. Hasil: ${qtyBerasOut} kg Beras Kualitas ${qualityMilled} dimasukkan ke persediaan.`
    );

    return newMillingId;
  };

  // Place Order (Pembeli)
  const placeOrder = (buyerId, buyerName, cartItems) => {
    const newOrderId = `ORD${String(orders.length + 1).padStart(3, '0')}`;
    let total = 0;

    // Deduct stocks and build details
    const details = [];
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      cartItems.forEach((item, index) => {
        const productIndex = updatedProducts.findIndex((p) => p.id_beras === item.id_beras);
        if (productIndex !== -1) {
          const p = updatedProducts[productIndex];
          if (p.stok >= item.quantity) {
            updatedProducts[productIndex] = { ...p, stok: p.stok - item.quantity };
            const subtotal = p.harga * item.quantity;
            total += subtotal;

            details.push({
              id_detail: `DTL${String(orderDetails.length + index + 1).padStart(3, '0')}`,
              id_pesanan: newOrderId,
              id_beras: item.id_beras,
              jenis_beras: p.jenis_beras,
              jumlah: item.quantity,
              subtotal: subtotal
            });
          }
        }
      });
      return updatedProducts;
    });

    // Create Order
    const newOrder = {
      id_pesanan: newOrderId,
      id_pembeli: buyerId,
      nama_pembeli: buyerName,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Menunggu',
      total_harga: total,
      pembayaran_status: 'Hold/Escrow'
    };

    // Create Shipping Record
    const newShippingId = `SHP${String(shippings.length + 1).padStart(3, '0')}`;
    const newShipping = {
      id_kirim: newShippingId,
      id_pesanan: newOrderId,
      kurir: 'Menunggu kurir...',
      status_kirim: 'Dipacking',
      estimasi_tiba: 'Menunggu konfirmasi...',
      bukti_terima: ''
    };

    setOrders((prev) => [...prev, newOrder]);
    setOrderDetails((prev) => [...prev, ...details]);
    setShippings((prev) => [...prev, newShipping]);

    addBlockToChain(
      newOrderId,
      `Pesanan ${newOrderId} dibuat oleh ${buyerName}. Dana ditahan di Escrow: Rp${total.toLocaleString('id-ID')}`
    );

    return newOrderId;
  };

  // Update Shipping (Distributor)
  const updateShipping = (orderId, courier, statusKirim, estArrival, proof = '') => {
    setShippings((prev) =>
      prev.map((s) =>
        s.id_pesanan === orderId
          ? { ...s, kurir: courier, status_kirim: statusKirim, estimasi_tiba: estArrival, bukti_terima: proof }
          : s
      )
    );

    // Update order status if shipped or package delivered
    let nextStatus = 'Diproses';
    if (statusKirim === 'Diperjalanan') nextStatus = 'Dikirim';
    if (statusKirim === 'Sampai') nextStatus = 'Selesai'; // Will wait for Escrow release to set to finished or let receiver trigger finished

    setOrders((prev) =>
      prev.map((o) => (o.id_pesanan === orderId ? { ...o, status: nextStatus } : o))
    );

    const ship = shippings.find((s) => s.id_pesanan === orderId);
    addBlockToChain(
      ship?.id_kirim || 'SHP_UPD',
      `Pengiriman untuk Pesanan ${orderId} diperbarui. Kurir: ${courier}, Status: ${statusKirim}, Estimasi Tiba: ${estArrival}`
    );
  };

  // Confirm Receipt / Release Escrow (Pembeli)
  const confirmDelivery = (orderId) => {
    // Set order status to finished and escrow to released
    let orderAmt = 0;
    let farmerId = '';

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id_pesanan === orderId) {
          orderAmt = o.total_harga;
          return { ...o, status: 'Selesai', pembayaran_status: 'Released' };
        }
        return o;
      })
    );

    // Update delivery state to Sampai
    setShippings((prev) =>
      prev.map((s) => (s.id_pesanan === orderId ? { ...s, status_kirim: 'Sampai', bukti_terima: 'Diterima oleh Pembeli. Tanda tangan digital terekam.' } : s))
    );

    // Release funds to the Farmer (For simplicity, first farmer in product chain is credited)
    // Find the product farmer of the first detail item in the order
    const orderD = orderDetails.find((d) => d.id_pesanan === orderId);
    if (orderD) {
      const prod = products.find((p) => p.id_beras === orderD.id_beras);
      if (prod) {
        farmerId = prod.id_petani;
        setFarmers((prev) =>
          prev.map((f) => (f.id_petani === farmerId ? { ...f, saldo: f.saldo + orderAmt } : f))
        );
      }
    }

    addBlockToChain(
      `${orderId}_RELEASE`,
      `Konfirmasi Penerimaan ${orderId} oleh Pembeli. Pembayaran Escrow Rp${orderAmt.toLocaleString('id-ID')} berhasil dicairkan ke saldo Petani.`
    );
  };

  // Cancel Order (Pembeli / Distributor) - Refunds before shipping
  const cancelOrder = (orderId) => {
    let orderAmt = 0;
    const orderD = orderDetails.filter((d) => d.id_pesanan === orderId);

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id_pesanan === orderId) {
          orderAmt = o.total_harga;
          return { ...o, status: 'Dibatalkan', pembayaran_status: 'Refunded' };
        }
        return o;
      })
    );

    // Return stock back to products
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      orderD.forEach((detail) => {
        const index = updatedProducts.findIndex((p) => p.id_beras === detail.id_beras);
        if (index !== -1) {
          updatedProducts[index].stok += detail.jumlah;
        }
      });
      return updatedProducts;
    });

    addBlockToChain(
      `${orderId}_REFUND`,
      `Pesanan ${orderId} dibatalkan sebelum pengiriman. Dana Escrow Rp${orderAmt.toLocaleString('id-ID')} dikembalikan/refunded ke Pembeli.`
    );
  };

  // Dummy login function
  const login = (email, password) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      if (user.verified || user.role === 'admin' || user.role === 'pembeli') {
        setCurrentUser(user);
        return { success: true, user };
      } else {
        return { success: false, message: 'Akun Anda belum diverifikasi oleh Admin.' };
      }
    }
    return { success: false, message: 'Email atau password salah.' };
  };

  // Dummy register function
  const register = (nama, email, password, role, extra = {}) => {
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    const newUserId = `USR${String(users.length + 1).padStart(3, '0')}`;
    const newUser = {
      id_user: newUserId,
      nama,
      email,
      password,
      role,
      verified: role === 'pembeli' || role === 'admin' ? true : false // Auto-verify buyers and admins
    };

    setUsers((prev) => [...prev, newUser]);

    if (role === 'petani') {
      const newFarmerId = `PET${String(farmers.length + 1).padStart(3, '0')}`;
      const newFarmer = {
        id_petani: newFarmerId,
        id_user: newUserId,
        alamat: extra.alamat || 'Alamat Belum Diisi',
        no_hp: extra.no_hp || '-',
        saldo: 0
      };
      setFarmers((prev) => [...prev, newFarmer]);
    }

    return {
      success: true,
      message: role === 'pembeli' ? 'Registrasi sukses! Silakan login.' : 'Registrasi sukses! Menunggu verifikasi admin.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // State reset for prototype testing
  const resetPrototypeData = () => {
    setUsers(defaultUsers);
    setFarmers(defaultFarmers);
    setHarvests(defaultHarvests);
    setMillings(defaultMillings);
    setProducts(defaultProducts);
    setOrders(defaultOrders);
    setOrderDetails(defaultOrderDetails);
    setShippings(defaultShippings);
    setBlockchain(defaultBlockchain);
    setCurrentUser(null);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        users,
        farmers,
        harvests,
        millings,
        products,
        orders,
        orderDetails,
        shippings,
        blockchain,
        currentUser,
        login,
        register,
        logout,
        verifyUser,
        addHarvest,
        addMilling,
        placeOrder,
        updateShipping,
        confirmDelivery,
        cancelOrder,
        resetPrototypeData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
