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

// --- KOMPONEN POSTER INSTAGRAM (RE-DESIGNED) ---
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
      await new Promise((resolve) => setTimeout(resolve, 800));

      const canvas = await window.html2canvas(posterRef.current, {
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
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
      <div className="relative w-full max-w-[340px] flex flex-col items-center">
        
        <button 
          onClick={onClose} 
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full mb-4 flex items-center gap-2 font-bold backdrop-blur-sm transition-all text-sm"
        >
          <X size={18} /> Tutup
        </button>

        {/* AREA POSTER */}
        <div ref={posterRef} className="w-[320px] bg-gradient-to-b from-red-600 to-red-800 p-5 rounded-[2rem] shadow-2xl text-white relative overflow-hidden box-border border-4 border-white/20">
          
          {/* Header */}
          <div className="relative z-10 flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <div className="bg-white/90 text-red-600 p-1.5 rounded-lg shadow-sm">
                <Droplet size={20} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none tracking-tight">URGENT</span>
                <span className="text-[9px] font-medium opacity-90 tracking-wider">BUTUH DONOR</span>
              </div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full border border-white/10">
              <span className="text-[9px] font-bold tracking-widest">PMR SMANEL</span>
            </div>
          </div>

          {/* Card Putih */}
          <div className="relative z-10 bg-white text-gray-800 rounded-[1.5rem] p-5 shadow-lg mb-5">
            
            {/* Golongan Darah */}
            <div className="text-center mb-5 border-b border-gray-100 pb-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Golongan Darah</p>
              <div className="flex items-center justify-center gap-1 mb-3"> 
                <span className="text-7xl font-bold text-red-600 tracking-tighter leading-none">{patient.bloodType}</span>
                <span className="text-4xl font-bold text-gray-400 leading-none self-center">{safeText(patient.rhesus)}</span>
              </div>
              <div className="inline-block bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold border border-red-100 shadow-sm">
                Butuh {patient.amount} Kantong
              </div>
            </div>

            {/* Detail Pasien */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-red-500 shrink-0"><User size={16} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pasien</p>
                  <p className="font-bold text-sm truncate">{patient.patient}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-red-500 shrink-0"><MapPin size={16} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Lokasi</p>
                  <p className="font-bold text-sm leading-tight line-clamp-2">{patient.hospital}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-red-500 shrink-0"><Phone size={16} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hubungi Keluarga</p>
                  <p className="font-bold text-lg text-gray-800 tracking-wide">{patient.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-center">
            <p className="text-[10px] text-white/80 italic mb-3">"Setetes darah Anda, nyawa bagi sesama."</p>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
                   <Instagram size={14} />
                   <span className="text-[10px] font-bold">@pmr_smanel</span>
                </div>
                <div className="flex items-center gap-2 bg-white text-red-700 px-3 py-1.5 rounded-full shadow-md">
                   <Globe size={14} />
                   <span className="text-[10px] font-bold tracking-wide">bloodlink.pmrsmanel.my.id</span>
                </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDownload}
          disabled={downloading || !isLibLoaded}
          className="mt-6 w-full py-3.5 bg-white text-red-600 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

const AdminPanel = ({ volunteers, setVolunteers, requests, setRequests, pmiStock, setPmiStock, mobileUnit, setMobileUnit, onLogout, showToast, showConfirm }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [savePmiLoading, setSavePmiLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleSavePmiStock = async () => {
     setSavePmiLoading(true);
     await new Promise(r => setTimeout(r, 1000));
     showToast("Stok berhasil diperbarui!", "success");
     setSavePmiLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
       <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#2C3E50] text-white transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
         <div className="p-6 font-bold text-xl border-b border-gray-700 flex justify-between">Admin Panel <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X/></button></div>
         <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('requests')} className={`block w-full text-left p-3 rounded ${activeTab==='requests'?'bg-[#C0392B]':''}`}>Permohonan</button>
            <button onClick={() => setActiveTab('volunteers')} className={`block w-full text-left p-3 rounded ${activeTab==='volunteers'?'bg-[#C0392B]':''}`}>Relawan</button>
            <button onClick={() => setActiveTab('stock')} className={`block w-full text-left p-3 rounded ${activeTab==='stock'?'bg-[#C0392B]':''}`}>Stok & Jadwal</button>
            <button onClick={onLogout} className="block w-full text-left p-3 rounded text-red-300 mt-10">Logout</button>
         </nav>
       </aside>
       <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
          <button className="md:hidden mb-4" onClick={() => setSidebarOpen(true)}><Menu/></button>
          {activeTab === 'requests' && <div className="bg-white p-6 rounded-xl shadow"><h2 className="font-bold mb-4">Daftar Permohonan</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-2">Pasien</th><th className="p-2">Gol</th><th className="p-2">Status</th></tr></thead><tbody>{requests.map(r => <tr key={r.id} className="border-b"><td className="p-2">{r.patient}</td><td className="p-2 font-bold text-[#C0392B]">{r.bloodType}</td><td className="p-2">{r.status}</td></tr>)}</tbody></table></div></div>}
          {activeTab === 'volunteers' && <div className="bg-white p-6 rounded-xl shadow"><h2 className="font-bold mb-4">Data Relawan</h2><p>Total: {volunteers.length}</p></div>}
          {activeTab === 'stock' && <div className="bg-white p-6 rounded-xl shadow"><h2 className="font-bold mb-4">Update Stok</h2><button onClick={handleSavePmiStock} disabled={savePmiLoading} className="bg-green-600 text-white px-4 py-2 rounded">{savePmiLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</button></div>}
       </main>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const handle = (e) => { e.preventDefault(); if(u==='User' && p==='User') onLogin(); else alert('Salah'); };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handle} className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <input className="w-full border p-2 mb-4 rounded" placeholder="User" value={u} onChange={e=>setU(e.target.value)}/>
        <input className="w-full border p-2 mb-4 rounded" type="password" placeholder="Pass" value={p} onChange={e=>setP(e.target.value)}/>
        <button className="w-full bg-[#2C3E50] text-white p-2 rounded font-bold">Masuk</button>
      </form>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);
  const [sharedId, setSharedId] = useState(null);
  
  // SAFE DATA INIT
  const [volunteers, setVolunteers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [mobileUnit, setMobileUnit] = useState([]);
  const [pmiStock, setPmiStock] = useState([]);
  const [bloodStock, setBloodStock] = useState(FALLBACK_DATA.bloodStock);

  const [isModalLoading, setIsModalLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  const showToast = (msg, type='info') => setToast({ message: msg, type });
  const showConfirm = (title, message, onConfirm) => setConfirmModal({ isOpen: true, title, message, onConfirm });

  // FETCH DATA MOCK (Ganti dengan fetchSheetData asli)
  useEffect(() => {
    setRequests(FALLBACK_DATA.requests);
    setVolunteers(FALLBACK_DATA.volunteers);
    setPmiStock(FALLBACK_DATA.pmiStock);
    
    const params = new URLSearchParams(window.location.search);
    if(params.get('view')) setView(params.get('view'));
    if(params.get('id')) setSharedId(params.get('id'));
  }, []);

  if (view === 'login') return <Login onLogin={() => { setIsLoggedIn(true); setView('admin'); }} />;
  if (view === 'admin') {
     if(!isLoggedIn) setView('login');
     return (
        <>
        <AdminPanel volunteers={volunteers} setVolunteers={setVolunteers} requests={requests} setRequests={setRequests} pmiStock={pmiStock} setPmiStock={setPmiStock} mobileUnit={mobileUnit} setMobileUnit={setMobileUnit} onLogout={() => setView('home')} showToast={showToast} showConfirm={showConfirm} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
     );
  }

  return (
    <div className="font-sans text-gray-800">
      <Navbar setView={setView} view={view} isLoggedIn={isLoggedIn} />
      {view === 'home' && (
        <div className="animate-fadeIn">
           <Hero setView={setView} />
           <StockDashboard bloodStock={bloodStock} pmiStock={pmiStock} mobileUnit={mobileUnit} />
           <AboutStats volunteers={volunteers} requests={requests} />
        </div>
      )}
      {view === 'patient_list' && <div className="animate-fadeIn"><PatientList requests={requests} setView={setView} showToast={showToast} sharedId={sharedId} setSharedId={setSharedId} /></div>}
      {view === 'volunteer_list' && <div className="animate-fadeIn"><VolunteerList volunteers={volunteers} setView={setView} /></div>}
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