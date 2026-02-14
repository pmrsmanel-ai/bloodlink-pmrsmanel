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
  Globe 
} from 'lucide-react';

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

// --- KOMPONEN POSTER INSTAGRAM (MINIMALIS & STABIL) ---
const IGPosterModal = ({ patient, onClose }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [isLibLoaded, setIsLibLoaded] = useState(false);

  useEffect(() => {
    if (window.html2canvas) {
      setIsLibLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true;
    script.onload = () => setIsLibLoaded(true);
    document.body.appendChild(script);
  }, []);

  if (!patient) return null;

  const handleDownload = async () => {
    if (!posterRef.current || !window.html2canvas) {
        alert("Fitur download sedang dimuat, silakan coba beberapa detik lagi.");
        return;
    }
    setDownloading(true);

    try {
      window.scrollTo(0, 0); 
      await new Promise((resolve) => setTimeout(resolve, 800)); // Tunggu render font

      const canvas = await window.html2canvas(posterRef.current, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: "#ffffff", // Set background putih eksplisit agar tidak transparan/hitam
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

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/90 backdrop-blur-sm p-4 pt-10 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        
        <button 
          onClick={onClose} 
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full mb-6 flex items-center gap-2 font-bold backdrop-blur-sm transition-all text-sm"
        >
          <X size={18} /> Tutup
        </button>

        {/* AREA POSTER (DESAIN MINIMALIS BARU) */}
        {/* Menggunakan background putih penuh dan layout vertikal yang stabil */}
        <div ref={posterRef} className="w-[360px] flex-shrink-0 bg-white shadow-2xl relative overflow-hidden box-border">
          
          {/* Header Merah */}
          <div className="bg-[#C0392B] px-8 py-6 text-white rounded-b-[2.5rem] relative z-10">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-bold text-2xl tracking-wide leading-tight">URGENT</h3>
                  <p className="text-xs font-medium opacity-90 uppercase tracking-[0.2em] mt-1">Butuh Donor Darah</p>
               </div>
               <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
                  <span className="text-[10px] font-bold tracking-widest text-white">PMR SMANEL</span>
               </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-8 pt-8 pb-6">
            
            {/* Golongan Darah - Centered */}
            <div className="flex flex-col items-center justify-center mb-8">
               <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full border-4 border-red-50 shadow-lg mb-4">
                  <div className="flex items-start">
                    <span className="text-7xl font-bold text-[#C0392B] tracking-tighter">{patient.bloodType}</span>
                    <span className="text-3xl font-bold text-gray-400 mt-2">{safeText(patient.rhesus)}</span>
                  </div>
               </div>
               <div className="bg-red-50 text-[#C0392B] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest">
                  Butuh {patient.amount} Kantong
               </div>
            </div>

            <div className="space-y-6">
              {/* Pasien */}
              <div className="flex items-start gap-4 border-b border-gray-50 pb-4">
                <div className="mt-1 text-[#C0392B]"><User size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pasien</p>
                  <p className="font-bold text-lg text-gray-800 leading-tight">{patient.patient}</p>
                  <p className="text-xs text-gray-500 font-medium">{patient.age ? `${patient.age} Tahun` : ''}</p>
                </div>
              </div>

              {/* RS */}
              <div className="flex items-start gap-4 border-b border-gray-50 pb-4">
                <div className="mt-1 text-[#C0392B]"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Lokasi / RS</p>
                  <p className="font-bold text-lg text-gray-800 leading-tight">{patient.hospital}</p>
                </div>
              </div>

              {/* Kontak */}
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#C0392B]"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Hubungi Keluarga</p>
                  <p className="font-bold text-xl text-gray-800 leading-tight">{patient.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Minimalis */}
          <div className="bg-gray-50 py-4 px-8 text-center border-t border-gray-100">
             <div className="flex flex-col gap-1 items-center">
                <div className="flex items-center gap-2 text-gray-500">
                   <Instagram size={14} />
                   <span className="text-xs font-bold">@pmr_smanel</span>
                </div>
                <div className="flex items-center gap-2 text-[#C0392B]">
                   <Globe size={14} />
                   <span className="text-xs font-bold tracking-wider">bloodlink.pmrsmanel.my.id</span>
                </div>
             </div>
          </div>
        </div>

        <button 
          onClick={handleDownload}
          disabled={downloading || !isLibLoaded}
          className="mt-8 w-full py-3.5 bg-white text-red-600 rounded-xl font-bold text-sm uppercase tracking-wider shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? <><Loader size={16} className="animate-spin" /> Memproses...</> : <><Download size={16} /> Simpan Gambar</>}
        </button>
      </div>
    </div>
  );
};

// --- DATA FALLBACK ---
const FALLBACK_DATA = {
  bloodStock: { A: { positive: 0, negative: 0 }, B: { positive: 0, negative: 0 }, AB: { positive: 0, negative: 0 }, O: { positive: 0, negative: 0 } },
  pmiStock: [],
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
                <div className="flex justify-between mb-2"><div><h3 className="font-bold text-xl text-[#2C3E50]">{req.patient}</h3><div className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {req.hospital}</div></div><div className="bg-red-100 text-[#C0392B] px-3 py-1 rounded-lg font-bold text-lg">{req.bloodType}{safeText(req.rhesus)}</div></div>
                <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg font-bold text-sm mb-4 flex justify-between"><span>Butuh:</span><span>{req.amount} Kantong</span></div>
                <div className="grid grid-cols-5 gap-2">
                    <a href={getWALink(req.contact, `Halo, saya ingin membantu donor untuk pasien ${req.patient}.`)} target="_blank" rel="noreferrer" className="col-span-3 bg-[#25D366] text-white py-2 rounded-lg font-bold flex justify-center gap-2 text-sm"><MessageCircle size={18} /> Chat</a>
                    <button onClick={() => handleShare(req)} className="col-span-1 bg-blue-500 text-white rounded-lg flex justify-center items-center"><Share2 size={20}/></button>
                    <button onClick={() => setPosterData(req)} className="col-span-1 bg-purple-500 text-white rounded-lg flex justify-center items-center"><Instagram size={20}/></button>
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
  const fulfilledBagsCount = requests ? requests.filter(r => r.status === 'Terpenuhi').reduce((sum, req) => sum + (parseInt(req.amount) || 0), 0) : 0;
  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-4">Misi Kemanusiaan</h2>
          <div className="text-gray-600 leading-relaxed mb-6"><p>Sistem digital untuk memetakan potensi pendonor di lingkungan SMAN 1 AIKMEL.</p></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold text-[#C0392B]">{activeVolunteerCount}</div><div className="text-xs text-gray-500">Relawan</div></div>
            <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold text-[#C0392B]">{fulfilledBagsCount}+</div><div className="text-xs text-gray-500">Kantong Tersalur</div></div>
            <div className="text-center p-4 bg-gray-50 rounded-lg"><div className="text-2xl font-bold text-[#C0392B]">24/7</div><div className="text-xs text-gray-500">Siap Siaga</div></div>
          </div>
        </div>
        <div className="md:w-1/2"><img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800" alt="Activity" className="rounded-2xl shadow-xl w-full h-96 object-cover" /></div>
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

// 9. FORMS
const RequestForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({ patient: '', age: '', hospital: '', bloodType: 'A', rhesus: '+', amount: '', contact: '', contact2: '' });
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto my-10 border-t-4 border-[#C0392B]">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-6 flex items-center gap-2"><AlertCircle className="text-[#C0392B]" /> Form Permohonan Darah</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nama Pasien</label><input required type="text" className="w-full border rounded-lg p-2" placeholder="Nama Lengkap" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Usia (Opsional)</label><input type="number" className="w-full border rounded-lg p-2" placeholder="Contoh: 45" value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></div>
        </div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Dirawat di</label><input required type="text" className="w-full border rounded-lg p-2" placeholder="Nama Rumah Sakit / Puskesmas" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Gol Darah (Rhesus)</label><div className="flex gap-2"><select className="w-full border rounded-lg p-2 bg-white" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select><select className="w-full border rounded-lg p-2 bg-white" value={form.rhesus} onChange={e => setForm({...form, rhesus: e.target.value})}><option value="+">+</option><option value="-">-</option></select></div></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah (Kantong)</label><input required type="number" className="w-full border rounded-lg p-2" placeholder="Contoh: 2" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">HP (Utama)</label><input required type="tel" className="w-full border rounded-lg p-2" placeholder="08..." value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">HP Alternatif (Opsional)</label><input type="tel" className="w-full border rounded-lg p-2" placeholder="08..." value={form.contact2} onChange={e => setForm({...form, contact2: e.target.value})} /></div>
        </div>
        <button disabled={isLoading} type="submit" className="w-full bg-[#C0392B] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400">{isLoading ? 'Mengirim Data...' : 'Kirim Permohonan'}</button>
      </form>
    </div>
  );
};

const VolunteerForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({ name: '', bloodType: 'A', rhesus: '+', phone: '', address: '', lastDonorDate: '' });
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto my-10 border-t-4 border-[#2C3E50]">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-6 flex items-center gap-2"><UserPlus className="text-[#2C3E50]" /> Form Pendaftaran Relawan</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label><input required type="text" className="w-full border rounded-lg p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Golongan Darah</label><select className="w-full border rounded-lg p-2 bg-white" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Rhesus</label><select className="w-full border rounded-lg p-2 bg-white" value={form.rhesus} onChange={e => setForm({...form, rhesus: e.target.value})}><option value="+">Positif (+)</option><option value="-">Negatif (-)</option></select></div>
        </div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Domisili</label><input required type="text" className="w-full border rounded-lg p-2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1">Waktu Donor Terakhir (Opsional)</label><input type="date" className="w-full border rounded-lg p-2" value={form.lastDonorDate} onChange={e => setForm({...form, lastDonorDate: e.target.value})} /><p className="text-xs text-gray-500 mt-1">Biarkan kosong jika belum pernah donor.</p></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-1">No. HP / WA</label><input required type="tel" className="w-full border rounded-lg p-2" placeholder="08..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
        <button disabled={isLoading} type="submit" className="w-full bg-[#2C3E50] text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400">{isLoading ? 'Menyimpan...' : 'Daftar Jadi Relawan'}</button>
      </form>
    </div>
  );
};

const AdminPanel = ({ volunteers, setVolunteers, requests, setRequests, pmiStock, setPmiStock, mobileUnit, setMobileUnit, onLogout, showToast, showConfirm }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [newReq, setNewReq] = useState({ patient: '', age: '', hospital: '', bloodType: 'A', rhesus: '+', amount: '', contact: '', contact2: '' });
  const [newVol, setNewVol] = useState({ name: '', bloodType: 'A', rhesus: '+', phone: '', address: '', lastDonorDate: '' });
  const [newSchedule, setNewSchedule] = useState({ location: '', date: '', time: '' });
  const [savePmiLoading, setSavePmiLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handlePmiChange = (idx, field, val) => {
    const newStock = [...pmiStock];
    newStock[idx][field] = parseInt(val) || 0;
    newStock[idx].total = (parseInt(newStock[idx].A) || 0) + (parseInt(newStock[idx].B) || 0) + (parseInt(newStock[idx].O) || 0) + (parseInt(newStock[idx].AB) || 0);
    setPmiStock(newStock);
  };

  const handleSavePmiStock = async () => {
    setSavePmiLoading(true);
    let successCount = 0;
    const lastUpdateStr = `${formatDateIndo(new Date())} • ${new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WITA`;
    for (const item of pmiStock) {
        const updateData = { id: item.id, product: item.product, A: item.A, B: item.B, O: item.O, AB: item.AB, total: (parseInt(item.A)||0) + (parseInt(item.B)||0) + (parseInt(item.O)||0) + (parseInt(item.AB)||0), lastUpdate: lastUpdateStr };
        const success = await sendDataToSheet('pmiStock', updateData, 'update');
        if (success) successCount++;
    }
    setSavePmiLoading(false);
    if (successCount > 0) showToast("Stok PMI berhasil diperbarui!", 'success');
    else showToast("Gagal menyimpan data stok.", 'error');
  };

  const toggleStatus = async (id) => {
    setUpdatingId(id);
    const updated = requests.map(req => req.id === id ? { ...req, status: req.status === 'Mencari' ? 'Terpenuhi' : 'Mencari' } : req);
    setRequests(updated);
    const item = updated.find(r => r.id === id);
    if(item) {
        const success = await sendDataToSheet('requests', item, 'update');
        if(!success) showToast("Gagal update status di server", 'error');
    }
    setUpdatingId(null);
  };

  const handleAddRequest = async (e) => {
    e.preventDefault();
    const item = { id: Date.now(), ...newReq, status: 'Mencari', timestamp: new Date().toLocaleDateString() };
    setRequests([...requests, item]);
    setNewReq({ patient: '', age: '', hospital: '', bloodType: 'A', rhesus: '+', amount: '', contact: '', contact2: '' });
    setShowAddForm(false);
    await sendDataToSheet('requests', item);
    showToast("Data permohonan ditambahkan", 'success');
  };

  const handleAddVolunteer = async (e) => {
    e.preventDefault();
    const item = { id: Date.now(), ...newVol, status: 'Aktif', timestamp: new Date().toLocaleDateString() };
    setVolunteers([...volunteers, item]);
    setNewVol({ name: '', bloodType: 'A', rhesus: '+', phone: '', address: '', lastDonorDate: '' });
    setShowAddForm(false);
    await sendDataToSheet('volunteers', item);
    showToast("Relawan berhasil ditambahkan", 'success');
  };

  const handleEditVolunteer = async (e) => {
    e.preventDefault();
    const updated = volunteers.map(v => v.id === editingVolunteer.id ? editingVolunteer : v);
    setVolunteers(updated);
    const success = await sendDataToSheet('volunteers', editingVolunteer, 'update');
    if (success) showToast("Data relawan diperbarui!", 'success');
    else showToast("Gagal update data relawan", 'error');
    setEditingVolunteer(null);
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    const item = { id: Date.now(), ...newSchedule };
    setMobileUnit([...mobileUnit, item]);
    setNewSchedule({ location: '', date: '', time: '' });
    await sendDataToSheet('mobileUnit', item);
    showToast("Jadwal baru tersimpan", 'success');
  };

  const confirmDelete = (id, type) => {
    showConfirm(
      "Hapus Data Permanen?",
      "Tindakan ini tidak dapat dibatalkan. Data akan dihapus dari aplikasi dan database Google Sheet.",
      async () => {
        let sheetName = type === 'volunteer' ? 'volunteers' : 'mobileUnit';
        if(type === 'volunteer') setVolunteers(volunteers.filter(v => v.id !== id));
        if(type === 'schedule') setMobileUnit(mobileUnit.filter(s => s.id !== id));
        await sendDataToSheet(sheetName, { id }, 'delete');
        showToast("Data berhasil dihapus", 'success');
      }
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#2C3E50] text-white transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center"><div><h2 className="text-xl font-bold">Admin Panel</h2><p className="text-xs text-gray-400">PMR SMANEL</p></div><button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300"><X size={20} /></button></div>
        <nav className="p-4 space-y-2">
          <button onClick={() => { setActiveTab('requests'); setShowAddForm(false); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded hover:bg-white/10 ${activeTab === 'requests' ? 'bg-[#C0392B]' : ''}`}>Permohonan</button>
          <button onClick={() => { setActiveTab('volunteers'); setShowAddForm(false); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded hover:bg-white/10 ${activeTab === 'volunteers' ? 'bg-[#C0392B]' : ''}`}>Data Relawan</button>
          <button onClick={() => { setActiveTab('stock'); setSidebarOpen(false); }} className={`w-full text-left p-3 rounded hover:bg-white/10 ${activeTab === 'stock' ? 'bg-[#C0392B]' : ''}`}>Update Stok & Jadwal</button>
          <button onClick={onLogout} className="w-full text-left p-3 rounded hover:bg-white/10 text-red-300 mt-10 flex items-center gap-2"><LogOut size={16}/> Logout</button>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="md:hidden text-[#2C3E50]"><Menu size={24}/></button><h1 className="text-xl md:text-2xl font-bold text-[#2C3E50]">{activeTab === 'requests' ? 'Verifikasi Permohonan' : activeTab === 'volunteers' ? 'Manajemen Relawan' : 'Update Stok & Jadwal'}</h1></div>
          <button onClick={onLogout} className="md:hidden text-red-500"><LogOut/></button>
        </div>

        {activeTab === 'requests' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2"><span className="text-gray-600 font-semibold">Daftar Permohonan</span><button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-[#2C3E50] text-white px-3 py-1.5 rounded text-sm hover:bg-blue-900 transition-colors"><PlusCircle size={16} /> Tambah Manual</button></div>
            {showAddForm && (
              <div className="p-6 bg-red-50 border-b animate-fadeIn"><h3 className="font-bold text-[#C0392B] mb-3">Tambah Data Pemohon</h3>
                <form onSubmit={handleAddRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Nama Pasien" className="p-2 rounded border" value={newReq.patient} onChange={e => setNewReq({...newReq, patient: e.target.value})}/>
                  <input type="number" placeholder="Usia (Opsional)" className="p-2 rounded border" value={newReq.age} onChange={e => setNewReq({...newReq, age: e.target.value})}/>
                  <input required placeholder="Rumah Sakit" className="p-2 rounded border" value={newReq.hospital} onChange={e => setNewReq({...newReq, hospital: e.target.value})}/>
                  <input required type="number" placeholder="Jumlah Kantong" className="p-2 rounded border" value={newReq.amount} onChange={e => setNewReq({...newReq, amount: e.target.value})}/>
                  <div className="flex gap-2"><select className="p-2 rounded border w-1/2" value={newReq.bloodType} onChange={e => setNewReq({...newReq, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select><select className="p-2 rounded border w-1/2" value={newReq.rhesus} onChange={e => setNewReq({...newReq, rhesus: e.target.value})}><option>+</option><option>-</option></select></div>
                  <div className="flex flex-col gap-2"><input required placeholder="Kontak Keluarga (Utama)" className="p-2 rounded border" value={newReq.contact} onChange={e => setNewReq({...newReq, contact: e.target.value})}/><input placeholder="Kontak Alternatif (Opsional)" className="p-2 rounded border" value={newReq.contact2} onChange={e => setNewReq({...newReq, contact2: e.target.value})}/></div>
                  <button type="submit" className="md:col-span-2 bg-[#C0392B] text-white py-2 rounded font-bold hover:bg-red-700">Simpan Data</button>
                </form>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b"><tr><th className="p-4">Pasien</th><th className="p-4">Gol.</th><th className="p-4">Kontak</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
                <tbody>{requests.map(req => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="p-4"><div className="font-bold">{req.patient}</div><div className="text-xs text-gray-500">{req.hospital}</div></td>
                      <td className="p-4"><span className="font-bold text-[#C0392B]">{req.bloodType}{safeText(req.rhesus)}</span></td>
                      <td className="p-4"><div>{req.contact}</div>{req.contact2 && <div className="text-xs text-gray-500">Alt: {req.contact2}</div>}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Mencari' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{req.status}</span></td>
                      <td className="p-4"><button onClick={() => toggleStatus(req.id)} disabled={updatingId === req.id} className={`text-sm px-3 py-1 rounded transition-colors ${updatingId === req.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>{updatingId === req.id ? '...' : 'Ubah'}</button></td>
                    </tr>
                  ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
             <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2"><span className="text-gray-600 font-semibold">Data Relawan</span><button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-[#2C3E50] text-white px-3 py-1.5 rounded text-sm hover:bg-blue-900 transition-colors"><PlusCircle size={16} /> Tambah</button></div>
            {showAddForm && (
              <div className="p-6 bg-blue-50 border-b animate-fadeIn"><h3 className="font-bold text-[#2C3E50] mb-3">Tambah Relawan Baru</h3>
                <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Nama Lengkap" className="p-2 rounded border" value={newVol.name} onChange={e => setNewVol({...newVol, name: e.target.value})}/>
                  <div className="flex gap-2"><select className="p-2 rounded border w-1/2" value={newVol.bloodType} onChange={e => setNewVol({...newVol, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select><select className="p-2 rounded border w-1/2" value={newVol.rhesus} onChange={e => setNewVol({...newVol, rhesus: e.target.value})}><option>+</option><option>-</option></select></div>
                  <input required placeholder="No. HP" className="p-2 rounded border" value={newVol.phone} onChange={e => setNewVol({...newVol, phone: e.target.value})}/>
                  <button type="submit" className="md:col-span-2 bg-[#2C3E50] text-white py-2 rounded font-bold hover:bg-blue-900">Simpan Relawan</button>
                </form>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b"><tr><th className="p-4">Nama</th><th className="p-4">Gol.</th><th className="p-4">Kontak</th><th className="p-4">Aksi</th></tr></thead>
                <tbody>{volunteers.map(vol => (
                    <tr key={vol.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{vol.name}</td>
                      <td className="p-4">{vol.bloodType}{safeText(vol.rhesus)}</td>
                      <td className="p-4 text-sm"><div>{vol.phone}</div></td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setEditingVolunteer(vol)} className="text-blue-500 hover:text-blue-700 p-1"><Edit3 size={18} /></button>
                        <button onClick={() => confirmDelete(vol.id, 'volunteer')} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="text-[#C0392B]"/> Stok PMI (Edit & Simpan)</h3>
              <p className="text-sm text-gray-500 mb-4">Edit angka di bawah, lalu klik Simpan.</p>
              <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap"><thead className="bg-[#2C3E50] text-white"><tr><th className="p-3">Produk</th><th className="p-3">A</th><th className="p-3">B</th><th className="p-3">O</th><th className="p-3">AB</th><th className="p-3">Total</th></tr></thead>
                  <tbody>{pmiStock.sort((a,b)=>a.id-b.id).map((row, idx) => {
                    const total = (parseInt(row.A) || 0) + (parseInt(row.B) || 0) + (parseInt(row.O) || 0) + (parseInt(row.AB) || 0);
                    return (
                      <tr key={idx} className="border-b">
                        <td className="p-3 font-medium">{row.product}</td>
                        <td className="p-3"><input type="number" className="w-12 md:w-16 border rounded p-1" value={row.A} onChange={(e) => handlePmiChange(idx, 'A', e.target.value)} /></td>
                        <td className="p-3"><input type="number" className="w-12 md:w-16 border rounded p-1" value={row.B} onChange={(e) => handlePmiChange(idx, 'B', e.target.value)} /></td>
                        <td className="p-3"><input type="number" className="w-12 md:w-16 border rounded p-1" value={row.O} onChange={(e) => handlePmiChange(idx, 'O', e.target.value)} /></td>
                        <td className="p-3"><input type="number" className="w-12 md:w-16 border rounded p-1" value={row.AB} onChange={(e) => handlePmiChange(idx, 'AB', e.target.value)} /></td>
                        <td className="p-3 font-bold text-gray-500">{total}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={handleSavePmiStock} disabled={savePmiLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400">
                  {savePmiLoading ? <Loader className="animate-spin" size={18}/> : <Save size={18}/>} 
                  {savePmiLoading ? 'Menyimpan...' : 'Simpan ke Database'}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="text-[#C0392B]"/> Jadwal Mobil Unit</h3>
               <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-600 mb-2">Tambah Jadwal Baru</h4>
                <form onSubmit={handleAddSchedule} className="flex flex-col md:flex-row gap-3">
                  <input required placeholder="Lokasi" className="flex-1 p-2 rounded border" value={newSchedule.location} onChange={e => setNewSchedule({...newSchedule, location: e.target.value})}/>
                  <input required type="date" className="p-2 rounded border" value={newSchedule.date} onChange={e => setNewSchedule({...newSchedule, date: e.target.value})}/>
                  <input required placeholder="Jam" className="p-2 rounded border" value={newSchedule.time} onChange={e => setNewSchedule({...newSchedule, time: e.target.value})}/>
                  <button type="submit" className="bg-[#2C3E50] text-white px-4 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-1"><PlusCircle size={16}/> Tambah</button>
                </form>
              </div>
               <div className="space-y-2">
                {mobileUnit.length > 0 ? mobileUnit.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3"><div className="bg-red-100 p-2 rounded text-[#C0392B]"><MapPin size={20}/></div><div><p className="font-bold text-[#2C3E50] text-sm">{item.location}</p><p className="text-xs text-gray-500">{item.date} • {item.time}</p></div></div>
                    <button onClick={() => confirmDelete(item.id, 'schedule')} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                  </div>
                )) : <p className="text-gray-400 text-sm italic text-center py-4">Tidak ada jadwal aktif.</p>}
              </div>
            </div>
          </div>
        )}
      </main>

      {editingVolunteer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black mb-6 text-[#2C3E50]">Edit Data Relawan</h3>
            <form onSubmit={handleEditVolunteer} className="space-y-5">
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Lengkap</label><input required className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={editingVolunteer.name} onChange={e => setEditingVolunteer({...editingVolunteer, name: e.target.value})}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gol Darah</label><select className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={editingVolunteer.bloodType} onChange={e => setEditingVolunteer({...editingVolunteer, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
                <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rhesus</label><select className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={editingVolunteer.rhesus} onChange={e => setEditingVolunteer({...editingVolunteer, rhesus: e.target.value})}><option>+</option><option>-</option></select></div>
              </div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Pendonor</label><input required className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={editingVolunteer.phone} onChange={e => setEditingVolunteer({...editingVolunteer, phone: e.target.value})}/></div>
              <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tgl Terakhir Donor</label><input type="date" className="w-full p-4 bg-gray-50 rounded-xl font-bold" value={editingVolunteer.lastDonorDate} onChange={e => setEditingVolunteer({...editingVolunteer, lastDonorDate: e.target.value})}/></div>
              <div className="flex gap-4 pt-4"><button type="submit" className="flex-1 bg-green-600 text-white py-4 rounded-xl font-black text-xs uppercase">Simpan Perubahan</button><button type="button" onClick={() => setEditingVolunteer(null)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-black text-xs uppercase">Batal</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Login = ({ onLogin, onBack }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const handleLogin = (e) => { e.preventDefault(); if(user === 'User' && pass === 'User') { onLogin(); } else { setErr('Username atau Password salah!'); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8"><Shield size={48} className="text-[#2C3E50] mx-auto mb-2" /><h2 className="text-2xl font-bold text-[#2C3E50]">Admin Login</h2><p className="text-gray-500 text-sm">Akses khusus pengurus PMR</p></div>
        {err && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">{err}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">Username</label><input type="text" className="w-full border rounded-lg p-3 outline-none focus:border-[#2C3E50]" value={user} onChange={(e) => setUser(e.target.value)}/></div>
          <div><label className="block text-sm font-semibold mb-1">Password</label><input type="password" className="w-full border rounded-lg p-3 outline-none focus:border-[#2C3E50]" value={pass} onChange={(e) => setPass(e.target.value)}/></div>
          <button type="submit" className="w-full bg-[#2C3E50] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors">Masuk Dashboard</button>
        </form>
        <button onClick={onBack} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-800">&larr; Kembali ke Beranda</button>
      </div>
    </div>
  );
};

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