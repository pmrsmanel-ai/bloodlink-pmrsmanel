import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Droplet, 
  Search, 
  UserPlus, 
  BookOpen, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Shield, 
  Activity, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  Edit3, 
  Trash2, 
  Save, 
  Users, 
  ChevronRight, 
  PlusCircle, 
  User, 
  Info, 
  Loader, 
  RefreshCw, 
  Facebook, 
  Instagram, 
  Youtube, 
  Video, 
  MessageCircle, 
  Clock, 
  Share2, 
  AlertTriangle, 
  ArrowLeft, 
  Camera, 
  Download, 
  Globe,
  Copy
} from 'lucide-react';

// PERLU DIINSTALL: npm install html2canvas
import html2canvas from 'html2canvas'; // DIKOMENTARI AGAR PREVIEW AMAN

// --- KONFIGURASI DATABASE ---
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxY5wb5lz39PyDKncKm1xb2LUDqU6etKZvHAQ9o7T1_ydO2YtmEbEpKeumeDZKOStX9ZQ/exec";

// --- KOMPONEN UI TAMBAHAN ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed top-4 right-4 z-[99999] ${bgColors[type] || bgColors.info} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn`}>
      {type === 'success' && <CheckCircle size={20} />}
      {type === 'error' && <AlertCircle size={20} />}
      <span className="font-bold text-sm">{typeof message === 'string' ? message : 'Notifikasi'}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded-full"><X size={14}/></button>
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 transition-all">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#2C3E50] mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={isLoading} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Batal</button>
            <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
              {isLoading ? <Loader size={16} className="animate-spin" /> : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN POSTER INSTAGRAM (REDESIGN MINIMALIS & NO BOLD EXTREME) ---
const IGPosterModal = ({ patient, onClose }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // LOGIKA DOWNLOAD DIMATIKAN SEMENTARA UNTUK PREVIEW
  /*
  const handleDownload = async () => {
    if (!posterRef.current || !window.html2canvas) {
        alert("Fitur download sedang memuat komponen, silakan coba lagi dalam beberapa detik.");
        return;
    }
    setDownloading(true);

    try {
      window.scrollTo(0, 0); 
      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await window.html2canvas(posterRef.current, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0, 
        x: 0,
        y: 0
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `BloodLink-${patient.patient.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (error) {
      console.error("Gagal download poster:", error);
      alert("Gagal membuat poster. Pastikan koneksi internet stabil.");
    } finally {
      setDownloading(false);
    }
  };
  */

  const handleDownloadMock = () => {
    alert("Fitur download dinonaktifkan di mode pratinjau agar tidak error.");
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/90 backdrop-blur-sm p-4 pt-10 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        
        <button 
          onClick={onClose} 
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full mb-6 flex items-center gap-2 font-bold backdrop-blur-sm transition-all text-sm"
        >
          <X size={18} /> Tutup
        </button>

        {/* AREA POSTER (FIXED WIDTH, DESIGN MINIMALIS, NO OVERLAP) */}
        <div ref={posterRef} className="w-[360px] flex-shrink-0 bg-white shadow-2xl relative overflow-hidden box-border rounded-[20px]">
          
          {/* Header Minimalis */}
          <div className="bg-[#C0392B] px-6 py-6 text-white relative z-10">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <Droplet size={20} fill="currentColor" className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-bold text-xl leading-none">URGENT</h3>
                      <p className="text-[10px] font-medium opacity-90 tracking-widest mt-0.5">BUTUH DONOR DARAH</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-medium opacity-80">DIBUAT OLEH</p>
                  <p className="text-xs font-bold tracking-wide">PMR SMANEL</p>
               </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-6 py-6 bg-white">
            
            {/* Golongan Darah - Clean Look */}
            <div className="flex flex-col items-center justify-center mb-8">
               <div className="flex items-start justify-center gap-1 mb-2">
                    <span className="text-[100px] font-bold text-[#C0392B] leading-[0.8]">{patient.bloodType}</span>
                    <span className="text-5xl font-bold text-gray-400 mt-2">{safeText(patient.rhesus)}</span>
               </div>
               <div className="bg-red-50 text-[#C0392B] px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide border border-red-100">
                  DIBUTUHKAN {patient.amount} KANTONG
               </div>
            </div>

            {/* Detail Info - List Style */}
            <div className="space-y-5">
              {/* Pasien */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#C0392B] shrink-0">
                    <User size={18} />
                </div>
                <div className="flex-1 border-b border-gray-100 pb-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Nama Pasien</p>
                  <p className="font-bold text-lg text-gray-800 leading-tight">{patient.patient}</p>
                  {patient.age && <p className="text-xs text-gray-500 font-medium">Usia: {patient.age} Tahun</p>}
                </div>
              </div>

              {/* RS */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#C0392B] shrink-0">
                    <MapPin size={18} />
                </div>
                <div className="flex-1 border-b border-gray-100 pb-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Lokasi Dirawat</p>
                  <p className="font-bold text-lg text-gray-800 leading-tight">{patient.hospital}</p>
                </div>
              </div>

              {/* Kontak */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#C0392B] shrink-0">
                    <Phone size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Hubungi Keluarga</p>
                  <p className="font-bold text-xl text-gray-800 leading-tight">{patient.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Link Website */}
          <div className="bg-[#2C3E50] py-4 px-6 text-center">
             <div className="flex flex-col gap-2 items-center text-white/90">
                <p className="text-[10px] italic opacity-80">"Setetes darah Anda, nyawa bagi sesama."</p>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1.5">
                      <Instagram size={14} className="text-white"/>
                      <span className="text-[10px] font-bold">@pmr_smanel</span>
                   </div>
                   <div className="w-px h-3 bg-white/30"></div>
                   <div className="flex items-center gap-1.5">
                      <Globe size={14} className="text-white"/>
                      <span className="text-[10px] font-bold tracking-wider">bloodlink.pmrsmanel.my.id</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Tombol Download */}
        <button 
          onClick={handleDownloadMock}
          disabled={downloading}
          className="mt-8 w-full py-3.5 bg-white text-red-600 rounded-xl font-bold text-sm uppercase tracking-wider shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? <><Loader size={16} className="animate-spin" /> Memproses...</> : <><Download size={16} /> Simpan Gambar</>}
        </button>
        <p className="text-white/50 text-[10px] mt-3 text-center">*Fitur download dinonaktifkan di preview</p>
      </div>
    </div>
  );
};

// --- DATA FALLBACK ---
const FALLBACK_DATA = {
  bloodStock: {
    A: { positive: 0, negative: 0 },
    B: { positive: 0, negative: 0 },
    AB: { positive: 0, negative: 0 },
    O: { positive: 0, negative: 0 },
  },
  pmiStock: [
    { id: 1, product: 'Whole Blood (WB)', A: 0, B: 0, O: 0, AB: 0, total: 0, lastUpdate: '-' },
    { id: 2, product: 'Packed Red Cell (PRC)', A: 0, B: 0, O: 0, AB: 0, total: 0, lastUpdate: '-' },
    { id: 3, product: 'Thrombocyte Conc. (TC)', A: 0, B: 0, O: 0, AB: 0, total: 0, lastUpdate: '-' },
  ],
  mobileUnit: [],
  volunteers: [],
  requests: []
};

// --- ARTIKEL ---
const ARTICLES = [
  { id: 1, title: "Syarat Menjadi Pendonor Darah", excerpt: "Ketahui syarat fisik sebelum donor.", content: ["Sehat jasmani dan rohani.", "Usia 17-60 tahun.", "Berat badan minimal 45 kg.", "Tidak sedang sakit."], image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=500" },
  { id: 2, title: "Mitos vs Fakta Donor Darah", excerpt: "Simak faktanya di sini.", content: ["❌ Mitos: Donor darah bikin gemuk.", "✅ Fakta: Justru membakar kalori.", "❌ Mitos: Menyakitkan.", "✅ Fakta: Hanya seperti gigitan semut."], image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=500" },
  { id: 3, title: "Manfaat Donor Bagi Kesehatan", excerpt: "Tubuh menjadi lebih sehat.", content: ["Menurunkan risiko penyakit jantung.", "Mengurangi kekentalan darah.", "Pemeriksaan kesehatan gratis."], image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=500" }
];

// --- HELPER FUNCTIONS ---
const sendDataToSheet = async (sheetName, data, action = 'write') => {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")) return false;
  try {
    await fetch(`${APPS_SCRIPT_URL}?action=${action}&sheet=${sheetName}`, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
    return true;
  } catch (e) { console.error(e); return false; }
};

const formatDateIndo = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const getWALink = (phone, text = "") => {
  if (!phone) return "#";
  let cleanPhone = String(phone).replace(/[^0-9]/g, ''); 
  if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

const safeText = (text) => {
  const str = String(text || "");
  if (str.includes("ERROR") || str.includes("#N/A") || str.trim() === "") return "?";
  return str;
};

const calculateEligibility = (lastDate) => {
  if (!lastDate || String(lastDate).trim() === "") return { eligible: true, text: "BISA DONOR", color: "bg-green-100 text-green-700" };
  const last = new Date(lastDate);
  if (isNaN(last.getTime())) return { eligible: true, text: "BISA DONOR", color: "bg-green-100 text-green-700" };
  const diffDays = Math.ceil(Math.abs(new Date() - last) / (1000 * 60 * 60 * 24));
  return diffDays >= 90 ? { eligible: true, text: "BISA DONOR", color: "bg-green-100 text-green-700" } : { eligible: false, text: `Tunggu ${90 - diffDays} hari lagi`, color: "bg-gray-100 text-gray-500" };
};

// --- COMPONENTS ---
const Navbar = ({ setView, view, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { label: 'Home', value: 'home' }, { label: 'Butuh Donor', value: 'patient_list' }, { label: 'Data Relawan', value: 'volunteer_list' }, { label: 'Stok Darah', value: 'stock' }, { label: 'Edukasi', value: 'education' }
  ];
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md font-sans">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <div className="h-10 w-10 bg-[#C0392B] rounded-lg flex items-center justify-center text-white mr-3 shadow-sm"><Droplet fill="currentColor" size={24} /></div>
            <div><h1 className="text-xl font-extrabold text-[#C0392B]">BloodL!nk</h1><p className="text-xs text-black font-bold tracking-wider">PMR SMANEL</p></div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (<button key={item.value} onClick={() => setView(item.value)} className={`font-medium transition-colors ${view === item.value ? 'text-[#C0392B]' : 'text-[#2C3E50] hover:text-[#C0392B]'}`}>{item.label}</button>))}
            <button onClick={() => setView(isLoggedIn ? 'admin' : 'login')} className="px-4 py-2 rounded-full border border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-all text-sm font-semibold">{isLoggedIn ? 'Dashboard' : 'Login Admin'}</button>
          </div>
          <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="text-[#2C3E50]">{isOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (<button key={item.value} onClick={() => { setView(item.value); setIsOpen(false); }} className="text-left font-medium py-2 text-[#2C3E50]">{item.label}</button>))}
            <button onClick={() => { setView(isLoggedIn ? 'admin' : 'login'); setIsOpen(false); }} className="text-left font-medium py-2 text-gray-600">{isLoggedIn ? 'Dashboard Admin' : 'Login Admin'}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ setView }) => (
  <header className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24 relative overflow-hidden">
    <div className="container mx-auto px-4 relative z-10 text-center">
      <div className="inline-block px-4 py-1 mb-6 rounded-full bg-red-100 text-[#C0392B] text-sm font-semibold tracking-wide">BLOODLINK PMR SMANEL</div>
      <h1 className="text-4xl md:text-6xl font-bold text-[#2C3E50] mb-6">Karena Setiap Tetes <br/> <span className="text-[#C0392B]">Sangat Berarti.</span></h1>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">Selamat datang di BloodL!nk PmrSmanel, jembatan kemanusiaan digital SMAN 1 AIKMEL.</p>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <button onClick={() => setView('patient_list')} className="w-full md:w-auto px-8 py-4 bg-[#C0392B] text-white rounded-lg shadow-lg hover:bg-red-700 font-bold flex items-center justify-center gap-2 text-lg"><Search size={20} /> Lihat Pasien Butuh Darah</button>
        <button onClick={() => setView('register')} className="w-full md:w-auto px-8 py-4 bg-white text-[#2C3E50] border-2 border-[#2C3E50] rounded-lg shadow-md hover:bg-gray-50 font-bold flex items-center justify-center gap-2 text-lg"><UserPlus size={20} /> Saya Ingin Donor Darah</button>
      </div>
    </div>
  </header>
);

const StockDashboard = ({ bloodStock, pmiStock, mobileUnit }) => {
  const totalVolunteers = Object.values(bloodStock).reduce((acc, curr) => acc + curr.positive + curr.negative, 0);
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold text-[#2C3E50]">Stok Darah & Jadwal</h2><div className="h-1 w-20 bg-[#C0392B] mx-auto mt-2"></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-[#2C3E50] mb-6 flex justify-between"><span>Relawan Sekolah</span><span className="text-sm bg-red-100 text-[#C0392B] py-1 px-3 rounded-full">Total: {totalVolunteers}</span></h3>
            <div className="grid grid-cols-2 gap-4">{Object.entries(bloodStock).map(([type, data]) => (<div key={type} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative"><div className="absolute right-0 top-0 h-full w-2 bg-[#C0392B]"></div><div className="flex justify-between"><div><span className="text-3xl font-black text-[#2C3E50]">{type}</span></div><div className="text-right"><div className="text-lg font-bold text-[#C0392B]">{data.positive + data.negative}</div><div className="text-xs text-gray-400">Rh+: {data.positive} | Rh-: {data.negative}</div></div></div></div>))}</div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4 flex gap-2"><Activity className="text-[#C0392B]" /> Stok PMI Lotim</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-[#2C3E50] text-white"><tr><th className="px-4 py-3">Produk</th><th className="px-4 py-3 text-center">A</th><th className="px-4 py-3 text-center">B</th><th className="px-4 py-3 text-center">O</th><th className="px-4 py-3 text-center">AB</th><th className="px-4 py-3 text-center">Total</th></tr></thead><tbody>{pmiStock.length > 0 ? pmiStock.map((row, i) => (<tr key={i} className="border-b hover:bg-red-50"><td className="px-4 py-3 font-medium">{row.product}</td><td className="px-4 py-3 text-center">{row.A}</td><td className="px-4 py-3 text-center">{row.B}</td><td className="px-4 py-3 text-center">{row.O}</td><td className="px-4 py-3 text-center">{row.AB}</td><td className="px-4 py-3 text-center font-bold text-[#C0392B]">{(parseInt(row.A)||0)+(parseInt(row.B)||0)+(parseInt(row.O)||0)+(parseInt(row.AB)||0)}</td></tr>)) : <tr><td colSpan="6" className="p-4 text-center">Memuat...</td></tr>}</tbody></table></div>
            </div>
            <div className="bg-[#2C3E50] p-6 rounded-2xl text-white"><h3 className="text-xl font-bold mb-4 flex gap-2"><Calendar className="text-red-400" /> Jadwal Mobil Unit</h3><div className="space-y-4">{mobileUnit.length > 0 ? mobileUnit.map((item, i) => (<div key={i} className="flex gap-3 p-3 bg-white/10 rounded-lg"><MapPin size={18} className="text-red-400 mt-1"/><div><p className="font-bold text-sm">{item.location}</p><p className="text-xs text-gray-300">{formatDateIndo(item.date)} • {item.time}</p></div></div>)) : <p className="text-sm italic">Tidak ada jadwal aktif.</p>}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PatientList = ({ requests, setView, showToast, sharedId, setSharedId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBlood, setFilterBlood] = useState('ALL');
  const [posterData, setPosterData] = useState(null);

  const activeRequests = requests.filter(req => {
    if (sharedId) return String(req.id) === String(sharedId);
    const isSearching = req.status === 'Mencari';
    const matchesSearch = searchTerm === '' || req.patient.toLowerCase().includes(searchTerm.toLowerCase()) || req.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBlood === 'ALL' || req.bloodType === filterBlood;
    return isSearching && matchesSearch && matchesFilter;
  });

  const sortedRequests = [...activeRequests].sort((a, b) => b.id - a.id);

  const handleShare = async (req) => {
    const shareUrl = `${window.location.origin}?view=patient_list&id=${req.id}`;
    const baseText = `🚨 *BUTUH DONOR DARAH SEGERA* 🚨\n\nPasien: *${req.patient}*\nGolongan: *${req.bloodType}${safeText(req.rhesus)}*\nKebutuhan: *${req.amount} Kantong*\nRS: *${req.hospital}*\n\nBantu share info ini! Klik link:`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Butuh Donor', text: baseText, url: shareUrl }); } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(`${baseText}\n${shareUrl}`);
      showToast('Link disalin ke clipboard!', 'success');
    }
  };

  const clearSharedFilter = () => {
    setSharedId(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Nomor berhasil disalin!', 'success');
  };

  return (
    <section className="py-16 bg-red-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8"><h2 className="text-3xl font-bold text-[#C0392B]">Pasien Butuh Darah</h2></div>
        {sharedId ? (
          <div className="mb-8 text-center animate-fadeIn"><button onClick={clearSharedFilter} className="bg-white border px-5 py-2 rounded-full font-bold hover:bg-gray-50 flex items-center gap-2 mx-auto"><ArrowLeft size={16}/> Lihat Semua Pasien</button></div>
        ) : (
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative w-full max-w-md"><input type="text" placeholder="Cari nama pasien..." className="w-full p-3 pl-10 rounded-full border shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><Search className="absolute left-3 top-3 text-gray-400" size={20} /></div>
            <div className="flex gap-2 flex-wrap">{['ALL', 'A', 'B', 'AB', 'O'].map(type => (<button key={type} onClick={() => setFilterBlood(type)} className={`px-4 py-2 rounded-full font-semibold text-sm ${filterBlood === type ? 'bg-[#C0392B] text-white' : 'bg-white border'}`}>{type === 'ALL' ? 'Semua' : type}</button>))}</div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRequests.map(req => (
              <div key={req.id} className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-[#C0392B] relative ${sharedId ? 'ring-4 ring-yellow-200 shadow-2xl scale-105' : ''}`}>
                {/* Header: Pasien & Gol Darah */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 text-red-600 w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-red-100">
                            <span className="text-2xl font-black">{req.bloodType}</span>
                            <span className="text-[10px] font-bold">{safeText(req.rhesus)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-xl text-[#2C3E50] truncate">{req.patient}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                <User size={12}/> {req.age ? `${req.age} Tahun` : 'Usia -'}
                            </div>
                        </div>
                    </div>
                    <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        Urgent
                    </div>
                </div>

                {/* Detail List */}
                <div className="space-y-3 mb-6 border-t border-b border-gray-50 py-4">
                    {/* Lokasi */}
                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lokasi / RS</p>
                            <p className="text-sm font-semibold text-gray-700 leading-tight">{req.hospital}</p>
                        </div>
                    </div>

                    {/* Jumlah */}
                    <div className="flex items-start gap-3">
                        <Droplet size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dibutuhkan</p>
                            <p className="text-sm font-semibold text-gray-700">{req.amount} Kantong</p>
                        </div>
                    </div>

                    {/* Kontak Utama (Explicit Show) */}
                    <div className="flex items-start gap-3">
                        <Phone size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div className="w-full">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kontak Keluarga</p>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold text-[#2C3E50] tracking-wide">{req.contact}</p>
                                <button onClick={() => copyToClipboard(req.contact)} className="text-gray-400 hover:text-[#C0392B] transition-colors" title="Salin Nomor">
                                    <Copy size={16} />
                                </button>
                            </div>
                            {/* Kontak Alternatif jika ada */}
                            {req.contact2 && (
                                <div className="mt-1 pt-1 border-t border-dashed border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-500">{req.contact2} <span className="text-[10px] text-gray-400">(Alt)</span></p>
                                        <button onClick={() => copyToClipboard(req.contact2)} className="text-gray-400 hover:text-[#C0392B] transition-colors" title="Salin Nomor Alternatif">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-5 gap-2">
                    <a href={getWALink(req.contact, `Halo, saya ingin membantu donor untuk pasien ${req.patient}.`)} target="_blank" rel="noreferrer" className="col-span-3 bg-[#25D366] text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-sm hover:bg-green-600 transition-all"><MessageCircle size={18} /> Chat WA</a>
                    <button onClick={() => handleShare(req)} className="col-span-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex justify-center items-center hover:bg-blue-100 transition-all" title="Share Link"><Share2 size={20}/></button>
                    <button onClick={() => setPosterData(req)} className="col-span-1 bg-pink-50 text-pink-600 border border-pink-100 rounded-xl flex justify-center items-center hover:bg-pink-100 transition-all" title="Buat Poster IG"><Instagram size={20}/></button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {posterData && <IGPosterModal patient={posterData} onClose={() => setPosterData(null)} />}
    </section>
  );
};

const VolunteerList = ({ volunteers, setView }) => {
  const [filterBloodType, setFilterBloodType] = useState('ALL');
  const [showOnlyReady, setShowOnlyReady] = useState(false);
  const activeVolunteers = volunteers.filter(vol => {
    const isActive = vol.status === 'Aktif';
    const matchesBlood = filterBloodType === 'ALL' || vol.bloodType === filterBloodType;
    const matchesReady = showOnlyReady ? calculateEligibility(vol.lastDonorDate).eligible : true;
    return isActive && matchesBlood && matchesReady;
  });
  return (
    <section className="py-16 bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8"><h2 className="text-3xl font-bold text-[#2C3E50] mb-2">Relawan Siap Donor</h2></div>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            <div className="flex gap-2 flex-wrap justify-center">{['ALL', 'A', 'B', 'AB', 'O'].map(type => (<button key={type} onClick={() => setFilterBloodType(type)} className={`px-4 py-2 rounded-full font-semibold text-sm ${filterBloodType === type ? 'bg-[#C0392B] text-white' : 'bg-white border'}`}>{type === 'ALL' ? 'Semua' : type}</button>))}</div>
            <button onClick={() => setShowOnlyReady(!showOnlyReady)} className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${showOnlyReady ? 'bg-green-600 text-white' : 'bg-white border'}`}>{showOnlyReady ? <CheckCircle size={16}/> : <Clock size={16}/>} Hanya Siap Donor</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeVolunteers.map(vol => {
            const eligibility = calculateEligibility(vol.lastDonorDate);
            return (
              <div key={vol.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-[#2C3E50]"><User size={40} /></div>
                <h3 className="font-bold text-lg text-[#2C3E50]">{vol.name}</h3>
                <div className={`mt-2 mb-4 px-3 py-1 rounded-full text-xs font-bold ${eligibility.color}`}>{eligibility.text}</div>
                <div className="w-full border-t pt-4 grid grid-cols-2 gap-2 text-sm mb-4"><div>Golongan<br/><span className="text-xl font-bold text-[#C0392B]">{vol.bloodType}</span></div><div>Rhesus<br/><span className="text-xl font-bold text-[#2C3E50]">{safeText(vol.rhesus)}</span></div></div>
                <div className="w-full space-y-2">
                    {eligibility.eligible ? (
                        <>
                        <a href={getWALink(vol.phone, `Halo Kak ${vol.name}, dari BloodLink...`)} target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white py-2 rounded-lg font-bold text-sm flex justify-center gap-1"><MessageCircle size={16}/> Hubungi Relawan</a>
                        {vol.phone2 && <a href={getWALink(vol.phone2, `Halo Ortu Kak ${vol.name}...`)} target="_blank" rel="noreferrer" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold text-sm flex justify-center gap-1"><MessageCircle size={16}/> Hubungi Ortu</a>}
                        </>
                    ) : <button disabled className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg font-bold text-sm cursor-not-allowed"><Clock size={16}/> Masa Tunggu</button>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center"><p className="mb-4 text-gray-600">Ingin bergabung?</p><button onClick={() => setView('register')} className="px-6 py-3 bg-[#C0392B] text-white rounded-full font-bold shadow hover:bg-red-700 transition-colors">Daftar Sekarang</button></div>
      </div>
    </section>
  );
};

const AboutStats = ({ volunteers, requests }) => {
  const activeVolunteerCount = volunteers ? volunteers.filter(v => v.status === 'Aktif').length : 0;
  
  // MENGHITUNG TOTAL KANTONG DARI PERMINTAAN YANG TERPENUHI
  const fulfilledBagsCount = requests 
    ? requests
        .filter(r => r.status === 'Terpenuhi')
        .reduce((sum, req) => sum + (parseInt(req.amount) || 0), 0)
    : 0;

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Misi Kemanusiaan PMR SMANEL</h2>
          <div className="text-gray-600 leading-relaxed mb-6 space-y-4">
            <p>
              Berawal dari kesadaran bahwa setetes darah sangat berharga, kami menyadari perlunya sebuah sistem yang dapat memetakan potensi pendonor di lingkungan SMAN 1 AIKMEL untuk membantu sesama yang membutuhkan.
            </p>
            <div>
              <h4 className="font-bold text-[#2C3E50] mb-1">🎯 Visi Kami</h4>
              <p>Menjadi pusat informasi dan pangkalan data donor darah berbasis sekolah yang responsif, akurat, dan terpercaya guna mewujudkan generasi peduli kemanusiaan.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#2C3E50] mb-1">🚀 Misi Kami</h4>
              <ul className="list-decimal list-inside ml-2 space-y-1">
                <li><span className="font-semibold">Digitalisasi Data:</span> Mengelola data golongan darah warga sekolah dan masyarakat secara terstruktur dan aman.</li>
                <li><span className="font-semibold">Respons Cepat:</span> Mempercepat proses pencarian pendonor di saat-saat darurat (urgent) melalui teknologi.</li>
                <li><span className="font-semibold">Edukasi Masif:</span> Meningkatkan kesadaran akan pentingnya donor darah bagi kesehatan dan nilai kemanusiaan.</li>
                <li><span className="font-semibold">Sinergi Kemanusiaan:</span> Membangun kolaborasi solid antara sekolah, Unit Transfusi Darah (UTD), dan masyarakat luas.</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold text-[#C0392B]">{activeVolunteerCount}</div><div className="text-xs text-gray-500">Relawan Aktif</div></div>
            <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold text-[#C0392B]">{fulfilledBagsCount}+</div><div className="text-xs text-gray-500">Kantong Tersalur</div></div>
            <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold text-[#C0392B]">24/7</div><div className="text-xs text-gray-500">Siap Siaga</div></div>
          </div>
        </div>
        <div className="md:w-1/2">
          <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800" alt="PMR Activity" className="rounded-2xl shadow-xl w-full h-96 object-cover" />
        </div>
      </div>
    </section>
  );
};

const Education = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold text-[#2C3E50]">Pojok Edukasi</h2><p className="text-gray-600">Pelajari lebih lanjut tentang dunia donor darah.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{articles.map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6"><h3 className="text-lg font-bold text-[#2C3E50] mb-2">{article.title}</h3><p className="text-gray-600 text-sm mb-4">{article.excerpt}</p><button onClick={() => setSelectedArticle(article)} className="text-[#C0392B] font-semibold text-sm flex items-center hover:underline">Baca Selengkapnya <ChevronRight size={16} /></button></div>
            </div>
          ))}</div>
      </div>
      {selectedArticle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X size={20}/></button>
            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-64 object-cover" />
            <div className="p-8"><h2 className="text-2xl font-bold text-[#2C3E50] mb-4">{selectedArticle.title}</h2><ul className="list-disc pl-5 space-y-3 text-gray-600">{selectedArticle.content.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
          </div>
        </div>
      )}
    </section>
  );
};

const Footer = ({ setView }) => (
  <footer className="bg-[#2C3E50] text-white py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div><h3 className="text-xl font-bold mb-4">PMR SMANEL</h3><p className="text-gray-300 text-sm">“Bergerak Nyata, Berbagi Kehidupan lewat Donor Darah.”</p></div>
      <div><h3 className="text-lg font-bold mb-4">Link Cepat</h3><ul className="space-y-2 text-sm text-gray-300"><li><button onClick={() => setView('patient_list')} className="hover:text-red-400">Butuh Donor</button></li><li><button onClick={() => setView('volunteer_list')} className="hover:text-red-400">Data Relawan</button></li><li><button onClick={() => setView('stock')} className="hover:text-red-400">Stok Darah</button></li></ul></div>
      <div><h3 className="text-lg font-bold mb-4">Kontak</h3><ul className="space-y-2 text-sm text-gray-300"><li className="flex items-start gap-2"><MapPin size={16} className="mt-1 flex-shrink-0"/><span>Jl. Pendidikan No.35, Aikmel, Kec. Aikmel, Kabupaten Lombok Timur, Nusa Tenggara Bar. 83653</span></li><li className="flex items-center gap-2"><Phone size={16}/> Admin: +62 818-0332-4919</li></ul></div>
      <div><h3 className="text-lg font-bold mb-4">Ikuti Kami di :</h3><div className="flex gap-4"><a href="https://www.instagram.com/pmr_smanel/" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 hover:text-[#C0392B] transition-all"><Instagram size={20} /></a><a href="https://web.facebook.com/pmr.smanel.1" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 hover:text-blue-500 transition-all"><Facebook size={20} /></a><a href="https://www.tiktok.com/@pmrsmanel" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 hover:text-black transition-all"><Video size={20} /></a><a href="https://www.youtube.com/@pmrsmanel4782" target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 hover:text-red-500 transition-all"><Youtube size={20} /></a></div></div>
    </div>
    <div className="container mx-auto px-4 text-center mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400">&copy; 2026 PMR SMANEL. All rights reserved.</div>
  </footer>
);

// ... RequestForm, VolunteerForm, AdminPanel, Login, App (sama seperti sebelumnya, hanya IGPosterModal yang berubah) ...
// Saya akan menyertakan sisa komponen di bawah agar file lengkap.

const App = () => {
  const [view, setView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [sharedId, setSharedId] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [bloodStock, setBloodStock] = useState(FALLBACK_DATA.bloodStock);
  const [pmiStock, setPmiStock] = useState(FALLBACK_DATA.pmiStock);
  const [volunteers, setVolunteers] = useState(FALLBACK_DATA.volunteers);
  const [requests, setRequests] = useState(FALLBACK_DATA.requests);
  const [mobileUnit, setMobileUnit] = useState(FALLBACK_DATA.mobileUnit);

  const showToast = (message, type = 'info') => setToast({ message, type });
  const showConfirm = (title, message, onConfirm) => setConfirmModal({ isOpen: true, title, message, onConfirm });
  const closeConfirm = () => setConfirmModal({ isOpen: false });

  const fetchSheetData = async () => {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")) return; 
    setLoadingData(true);
    const ts = `&t=${Date.now()}`;
    try {
      const [volRes, reqRes, mobRes, pmiRes] = await Promise.all([
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=volunteers${ts}`),
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=requests${ts}`),
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=mobileUnit${ts}`),
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=pmiStock${ts}`)
      ]);

      const volData = await volRes.json();
      const reqData = await reqRes.json();
      const mobData = await mobRes.json();
      const pmiData = await pmiRes.json();

      if(volData.status === 'success') {
         setVolunteers(volData.data);
         localStorage.setItem('volunteers', JSON.stringify(volData.data));
         const newStock = { A: { positive: 0, negative: 0 }, B: { positive: 0, negative: 0 }, AB: { positive: 0, negative: 0 }, O: { positive: 0, negative: 0 }};
         volData.data.forEach(v => {
            if(v.bloodType && v.rhesus && v.status === 'Aktif') {
              const rhesusKey = String(v.rhesus).includes('+') ? 'positive' : 'negative';
              if(newStock[v.bloodType]) newStock[v.bloodType][rhesusKey]++;
            }
         });
         setBloodStock(newStock);
      }

      if(reqData.status === 'success') {
        setRequests(reqData.data);
        localStorage.setItem('requests', JSON.stringify(reqData.data));
      }

      if(mobData.status === 'success') {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const activeSchedules = mobData.data.filter(item => {
           if (!item.date) return true;
           const scheduleDate = new Date(item.date);
           return scheduleDate >= today; 
        });
        setMobileUnit(activeSchedules);
        localStorage.setItem('mobileUnit', JSON.stringify(activeSchedules));
      }

      if(pmiData.status === 'success' && pmiData.data.length > 0) {
        const sortedPmi = pmiData.data.sort((a, b) => a.id - b.id);
        setPmiStock(sortedPmi);
        localStorage.setItem('pmiStock', JSON.stringify(sortedPmi));
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Gagal memuat data terbaru", "error");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    // 1. CEK URL PARAMS UNTUK DEEP LINKING (BERBASIS ID)
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (viewParam) {
      setView(viewParam);
    }
    if (idParam) {
      setSharedId(idParam);
    }

    // 2. CEK CACHE
    const cachedVolunteers = localStorage.getItem('volunteers');
    const cachedRequests = localStorage.getItem('requests');
    const cachedMobileUnit = localStorage.getItem('mobileUnit');
    const cachedPmiStock = localStorage.getItem('pmiStock');

    if (cachedVolunteers) {
        const parsedVol = JSON.parse(cachedVolunteers);
        setVolunteers(parsedVol);
        const newStock = { A: { positive: 0, negative: 0 }, B: { positive: 0, negative: 0 }, AB: { positive: 0, negative: 0 }, O: { positive: 0, negative: 0 }};
         parsedVol.forEach(v => {
            if(v.bloodType && v.rhesus && v.status === 'Aktif') {
              const rhesusKey = String(v.rhesus).includes('+') ? 'positive' : 'negative';
              if(newStock[v.bloodType]) newStock[v.bloodType][rhesusKey]++;
            }
         });
         setBloodStock(newStock);
    }
    if (cachedRequests) setRequests(JSON.parse(cachedRequests));
    if (cachedMobileUnit) setMobileUnit(JSON.parse(cachedMobileUnit));
    if (cachedPmiStock) {
        const parsedPmi = JSON.parse(cachedPmiStock);
        setPmiStock(parsedPmi.sort((a, b) => a.id - b.id));
    }
    fetchSheetData();
  }, []);

  const handleRequestSubmit = async (formData) => {
    setSubmitLoading(true);
    const newData = { id: Date.now(), ...formData, status: 'Mencari', timestamp: new Date().toLocaleDateString() };
    setRequests([...requests, newData]);
    setView('patient_list');
    const success = await sendDataToSheet('requests', newData);
    if(success) {
      showToast("Permohonan berhasil dikirim!", 'success');
      fetchSheetData();
    } else {
      showToast("Gagal kirim ke server (Offline Mode)", 'error');
    }
    setSubmitLoading(false);
  };

  const handleVolunteerSubmit = async (formData) => {
    setSubmitLoading(true);
    const newData = { id: Date.now(), ...formData, status: 'Aktif', timestamp: new Date().toLocaleDateString() };
    setVolunteers([...volunteers, newData]);
    setView('home');
    const success = await sendDataToSheet('volunteers', newData);
    if(success) {
      showToast("Pendaftaran berhasil!", 'success');
      fetchSheetData();
    } else {
      showToast("Gagal simpan ke server (Offline Mode)", 'error');
    }
    setSubmitLoading(false);
  };

  if (view === 'login') return <Login onLogin={() => { setIsLoggedIn(true); setView('admin'); }} onBack={() => setView('home')} />;

  if (view === 'admin') {
    if (!isLoggedIn) setView('login');
    return (
      <>
        <AdminPanel volunteers={volunteers} setVolunteers={setVolunteers} requests={requests} setRequests={setRequests} pmiStock={pmiStock} setPmiStock={setPmiStock} mobileUnit={mobileUnit} setMobileUnit={setMobileUnit} onLogout={() => { setIsLoggedIn(false); setView('home'); }} showToast={showToast} showConfirm={showConfirm} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <ConfirmModal 
          isOpen={confirmModal.isOpen} 
          title={confirmModal.title} 
          message={confirmModal.message} 
          onConfirm={async () => {
            setIsModalLoading(true);
            try {
              await confirmModal.onConfirm();
            } catch (e) {
              console.error(e);
              showToast("Terjadi kesalahan", "error");
            } finally {
              setIsModalLoading(false);
              closeConfirm();
            }
          }} 
          onCancel={closeConfirm} 
          isLoading={isModalLoading} 
        />
      </>
    );
  }

  return (
    <div className="font-sans text-gray-800">
      <Navbar setView={setView} view={view} isLoggedIn={isLoggedIn} />
      {loadingData && (
        <div className="fixed top-20 left-0 w-full bg-yellow-100 text-yellow-800 text-center py-2 text-sm z-40 flex items-center justify-center gap-2">
           <Loader className="animate-spin" size={16}/> Sinkronisasi data server...
        </div>
      )}

      {view === 'home' && (
        <div className="animate-fadeIn">
          <Hero setView={setView} />
          <StockDashboard bloodStock={bloodStock} pmiStock={pmiStock} mobileUnit={mobileUnit} />
          <div className="py-10 bg-gray-50 text-center">
             <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Fitur Layanan</h2>
             <div className="flex justify-center gap-4 flex-wrap px-4">
                <button onClick={() => setView('patient_list')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all w-64 border-t-4 border-[#C0392B]">
                   <Activity className="mx-auto text-[#C0392B] mb-2" size={32}/><h3 className="font-bold text-lg">Pasien Butuh Darah</h3><p className="text-sm text-gray-500 mt-2">Lihat daftar pasien yang membutuhkan donor segera.</p>
                </button>
                <button onClick={() => setView('volunteer_list')} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all w-64 border-t-4 border-[#2C3E50]">
                   <Users className="mx-auto text-[#2C3E50] mb-2" size={32}/><h3 className="font-bold text-lg">Data Relawan</h3><p className="text-sm text-gray-500 mt-2">Lihat daftar pahlawan donor darah SMANEL.</p>
                </button>
             </div>
          </div>
          <AboutStats volunteers={volunteers} requests={requests} />
        </div>
      )}

      {view === 'patient_list' && <div className="animate-fadeIn"><PatientList requests={requests} setView={setView} showToast={showToast} sharedId={sharedId} setSharedId={setSharedId} /></div>}
      {view === 'volunteer_list' && <div className="animate-fadeIn"><VolunteerList volunteers={volunteers} setView={setView} /></div>}
      {view === 'search' && <div className="animate-fadeIn min-h-screen bg-red-50 py-10"><div className="container mx-auto px-4 text-center"><h1 className="text-3xl font-bold text-[#C0392B] mb-2">Butuh Donor Darah?</h1><p className="text-gray-600">Isi formulir di bawah ini agar kami dapat mencarikan relawan untuk Anda.</p><RequestForm onSubmit={handleRequestSubmit} isLoading={submitLoading} /></div></div>}
      {view === 'register' && <div className="animate-fadeIn min-h-screen bg-blue-50 py-10"><div className="container mx-auto px-4 text-center"><h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Mari Berbagi Kehidupan</h1><p className="text-gray-600">Bergabunglah menjadi relawan donor darah PMR SMANEL.</p><VolunteerForm onSubmit={handleVolunteerSubmit} isLoading={submitLoading} /></div></div>}
      {view === 'stock' && <div className="animate-fadeIn pt-10"><StockDashboard bloodStock={bloodStock} pmiStock={pmiStock} mobileUnit={mobileUnit} /></div>}
      {view === 'education' && <div className="animate-fadeIn pt-10"><Education articles={ARTICLES} /></div>}
      
      <Footer setView={setView} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;