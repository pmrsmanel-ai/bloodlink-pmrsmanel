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
  Copy,
  Target,
  Rocket
} from 'lucide-react';

// PERLU DIINSTALL: npm install html2canvas
// import html2canvas from 'html2canvas'; // DIKOMENTARI AGAR PREVIEW AMAN

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
    <div className={`fixed top-6 right-6 z-[99999] ${bgColors[type] || bgColors.info} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slideIn backdrop-blur-sm bg-opacity-95 border border-white/10`}>
      {type === 'success' && <CheckCircle size={24} className="text-emerald-100" />}
      {type === 'error' && <AlertCircle size={24} className="text-rose-100" />}
      <span className="font-semibold text-sm tracking-wide">{typeof message === 'string' ? message : 'Notifikasi'}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={16}/></button>
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 transition-all border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6 shadow-sm">
            <AlertTriangle size={36} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} disabled={isLoading} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Batal</button>
            <button onClick={onConfirm} disabled={isLoading} className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2">
              {isLoading ? <Loader size={18} className="animate-spin" /> : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN POSTER INSTAGRAM ---
const IGPosterModal = ({ patient, onClose }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadMock = () => {
    alert("Fitur download dinonaktifkan di mode pratinjau agar tidak error.");
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-slate-900/90 backdrop-blur-md p-4 pt-10 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        
        <button 
          onClick={onClose} 
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full mb-8 flex items-center gap-2 font-semibold backdrop-blur-md transition-all text-sm border border-white/10 shadow-lg"
        >
          <X size={18} /> Tutup Preview
        </button>

        {/* AREA POSTER (FIXED WIDTH) */}
        <div ref={posterRef} className="w-[360px] flex-shrink-0 bg-white shadow-2xl relative overflow-hidden box-border rounded-[24px]">
          {/* Header Minimalis */}
          <div className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-6 text-white relative z-10">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20">
                    <Droplet size={22} fill="currentColor" className="text-white" />
                  </div>
                  <div>
                      <h3 className="font-bold text-xl leading-none tracking-tight">URGENT</h3>
                      <p className="text-[10px] font-medium opacity-90 tracking-[0.2em] mt-1 text-rose-100">BUTUH DONOR DARAH</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-medium opacity-80 uppercase tracking-wide">Dibuat Oleh</p>
                  <p className="text-xs font-bold tracking-wide">PMR SMANEL</p>
               </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-7 py-8 bg-white">
            {/* Golongan Darah */}
            <div className="flex flex-col items-center justify-center mb-10">
               <div className="flex items-start justify-center gap-1 mb-3 transform scale-110">
                    <span className="text-[100px] font-bold text-slate-800 leading-[0.8] tracking-tighter">{patient.bloodType}</span>
                    <span className="text-5xl font-bold text-rose-500 mt-2">{safeText(patient.rhesus)}</span>
               </div>
               <div className="bg-rose-50 text-rose-600 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest border border-rose-100">
                  Dibutuhkan {patient.amount} Kantong
               </div>
            </div>

            {/* Detail Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors duration-300">
                    <User size={20} strokeWidth={2} />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Nama Pasien</p>
                  <p className="font-bold text-lg text-slate-800 leading-tight">{patient.patient}</p>
                  {patient.age && <p className="text-xs text-slate-500 font-medium mt-0.5">Usia: {patient.age} Tahun</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors duration-300">
                    <MapPin size={20} strokeWidth={2} />
                </div>
                <div className="flex-1 border-b border-slate-100 pb-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Lokasi Dirawat</p>
                  <p className="font-bold text-lg text-slate-800 leading-tight">{patient.hospital}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-rose-500 group-hover:bg-rose-50 transition-colors duration-300">
                    <Phone size={20} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Hubungi Keluarga</p>
                  <p className="font-bold text-xl text-slate-800 leading-tight tracking-wide">{patient.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-900 py-5 px-6 text-center">
             <div className="flex flex-col gap-3 items-center text-slate-300">
                <p className="text-[10px] italic opacity-80 font-medium font-serif">"Setetes darah Anda, nyawa bagi sesama."</p>
                <div className="flex items-center justify-center gap-6 w-full border-t border-white/10 pt-3">
                   <div className="flex items-center gap-2">
                      <Instagram size={14} className="text-rose-400"/>
                      <span className="text-[10px] font-bold tracking-wide text-white">@pmr_smanel</span>
                   </div>
                   <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                   <div className="flex items-center gap-2">
                      <Globe size={14} className="text-rose-400"/>
                      <span className="text-[10px] font-bold tracking-wide text-white">bloodlink.pmrsmanel.my.id</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Tombol Download (MOCK) */}
        <button 
          onClick={handleDownloadMock}
          disabled={downloading}
          className="mt-8 w-full py-4 bg-white text-rose-600 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-rose-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {downloading ? (
            <><Loader size={18} className="animate-spin" /> Memproses...</>
          ) : (
            <><Download size={18} /> Simpan Gambar</>
          )}
        </button>
        <p className="text-white/50 text-[11px] mt-4 text-center font-medium">
          *Fitur download dinonaktifkan di preview
        </p>
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
  if (!lastDate || String(lastDate).trim() === "") return { eligible: true, text: "BISA DONOR", color: "bg-emerald-100 text-emerald-700" };
  const last = new Date(lastDate);
  if (isNaN(last.getTime())) return { eligible: true, text: "BISA DONOR", color: "bg-emerald-100 text-emerald-700" };
  const diffDays = Math.ceil(Math.abs(new Date() - last) / (1000 * 60 * 60 * 24));
  return diffDays >= 90 ? { eligible: true, text: "BISA DONOR", color: "bg-emerald-100 text-emerald-700" } : { eligible: false, text: `Tunggu ${90 - diffDays} hari`, color: "bg-slate-100 text-slate-500" };
};

// --- COMPONENTS ---
const Navbar = ({ setView, view, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { label: 'Home', value: 'home' }, { label: 'Butuh Donor', value: 'patient_list' }, { label: 'Data Relawan', value: 'volunteer_list' }, { label: 'Stok Darah', value: 'stock' }, { label: 'Edukasi', value: 'education' }
  ];
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-rose-600 to-red-600 shadow-lg font-sans">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-rose-600 mr-3 shadow-lg group-hover:scale-110 transition-transform"><Droplet fill="currentColor" size={20} /></div>
            <div><h1 className="text-xl font-bold text-white tracking-tight">BloodL!nk</h1><p className="text-[10px] text-rose-100 font-bold tracking-widest uppercase">PMR SMANEL</p></div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (<button key={item.value} onClick={() => setView(item.value)} className={`font-semibold text-sm transition-all hover:-translate-y-0.5 ${view === item.value ? 'text-white underline decoration-2 underline-offset-4' : 'text-rose-100 hover:text-white'}`}>{item.label}</button>))}
            <button onClick={() => setView(isLoggedIn ? 'admin' : 'login')} className="px-6 py-2.5 rounded-full bg-white text-rose-600 border border-white hover:bg-rose-50 transition-all text-xs font-bold uppercase tracking-wider">{isLoggedIn ? 'Dashboard' : 'Login Admin'}</button>
          </div>
          <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-rose-100 transition-colors">{isOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fadeIn">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (<button key={item.value} onClick={() => { setView(item.value); setIsOpen(false); }} className={`text-left font-semibold py-3 px-4 rounded-xl ${view === item.value ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}>{item.label}</button>))}
            <button onClick={() => { setView(isLoggedIn ? 'admin' : 'login'); setIsOpen(false); }} className="text-left font-semibold py-3 px-4 text-slate-500 border-t border-slate-100 mt-2">{isLoggedIn ? 'Dashboard Admin' : 'Login Admin'}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ setView }) => (
  <header className="bg-gradient-to-b from-rose-50 via-white to-white pt-24 pb-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2"></div>
    
    <div className="container mx-auto px-4 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white border border-rose-100 text-rose-600 text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm animate-fadeIn">
        <Activity size={12} /> BLOODLINK PMR SMANEL
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
        Karena Setiap Tetes <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-500">Sangat Berarti.</span>
      </h1>
      <p className="text-lg text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed">
        Selamat datang di <strong>BloodL!nk PmrSmanel</strong> ini adalah inisiatif digital karya “PMR SMANEL” dalam mengamalkan Tri Bakti PMR, aplikasi ini bertujuan untuk menjembatani pasien yang membutuhkan darah dengan relawan pendonor.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button onClick={() => setView('patient_list')} className="w-full sm:w-auto px-8 py-4 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-200 hover:bg-rose-700 hover:-translate-y-1 transition-all font-bold flex items-center justify-center gap-3 text-sm uppercase tracking-wide">
            <Search size={18} /> Lihat Pasien Butuh Darah
        </button>
        <button onClick={() => setView('register')} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-rose-200 transition-all font-bold flex items-center justify-center gap-3 text-sm uppercase tracking-wide group">
            <UserPlus size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors"/> Saya Ingin Donor Darah
        </button>
      </div>
    </div>
  </header>
);

const StockDashboard = ({ bloodStock, pmiStock, mobileUnit }) => {
  const lastUpdateRaw = pmiStock.length > 0 ? pmiStock[0].lastUpdate : null;
  const displayLastUpdate = lastUpdateRaw && lastUpdateRaw !== '-' ? lastUpdateRaw : new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const totalVolunteers = Object.values(bloodStock).reduce((acc, curr) => acc + curr.positive + curr.negative, 0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Stok Darah & Jadwal</h2>
            <div className="h-1.5 w-20 bg-rose-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center justify-between">
                <span className="flex items-center gap-3"><Droplet className="text-rose-500" fill="currentColor" /> Relawan Siap Donor</span>
                <span className="text-xs bg-rose-100 text-rose-700 py-1.5 px-4 rounded-full font-bold">Total: {totalVolunteers}</span>
            </h3>
            <div className="grid grid-cols-2 gap-5">
                {Object.entries(bloodStock).map(([type, data]) => (
                    <div key={type} className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all hover:border-rose-300">
                        <div className="absolute right-0 top-0 h-full w-2 bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-5xl font-black text-slate-800">{type}</span>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Golongan</div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-rose-500 mb-1">{data.positive + data.negative}</div>
                                <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg inline-block">
                                    Rh+: {data.positive} <span className="text-slate-300 mx-0.5">|</span> Rh-: {data.negative}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-[10px] text-slate-400 text-center font-medium uppercase tracking-wide">*Data real-time dari sistem relawan</div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl shadow-slate-100/50">
              <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3"><Activity className="text-rose-500" /> Stok Darah PMI Kabupaten Lombok Timur</h3>
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Update: {displayLastUpdate}</p>
                  </div>
              </div>
              <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr>
                            <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider border-b-2 border-slate-200">Produk</th>
                            <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200">A</th>
                            <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200">B</th>
                            <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200">O</th>
                            <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200">AB</th>
                            <th className="px-4 py-3 text-center font-bold text-rose-600 border-b-2 border-l border-slate-200">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {pmiStock.length > 0 ? pmiStock.map((row, i) => {
                            const total = (parseInt(row.A) || 0) + (parseInt(row.B) || 0) + (parseInt(row.O) || 0) + (parseInt(row.AB) || 0);
                            return (
                                <tr key={i} className="hover:bg-rose-50/50 transition-colors">
                                    <td className="px-5 py-3.5 font-bold text-slate-700">{row.product}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-medium border-l border-slate-100">{row.A}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-medium border-l border-slate-100">{row.B}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-medium border-l border-slate-100">{row.O}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-medium border-l border-slate-100">{row.AB}</td>
                                    <td className="px-4 py-3 text-center font-black text-rose-600 border-l border-slate-100 bg-rose-50/30">{total}</td>
                                </tr>
                            );
                        }) : <tr><td colSpan="6" className="p-6 text-center text-slate-400 text-xs italic">Memuat data...</td></tr>}
                    </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-slate-800 p-8 rounded-3xl text-white shadow-lg shadow-slate-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3 relative z-10"><Calendar className="text-rose-400" /> Jadwal Mobil Unit</h3>
              <div className="space-y-4 relative z-10">
                {mobileUnit.length > 0 ? mobileUnit.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="bg-rose-500/20 p-2 rounded-lg text-rose-400"><MapPin size={18}/></div>
                    <div><p className="font-bold text-sm">{item.location}</p><p className="text-xs text-slate-400 mt-1 font-medium">{formatDateIndo(item.date)} • {item.time}</p></div>
                  </div>
                )) : <div className="text-center py-4 border border-dashed border-white/10 rounded-xl"><p className="text-slate-400 text-sm italic">Belum ada jadwal aktif.</p></div>}
              </div>
            </div>
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
    const baseText = `🚨 *BUTUH DONOR DARAH SEGERA* 🚨\n\nPasien: *${req.patient}*\nGolongan: *${req.bloodType}${safeText(req.rhesus)}*\nKebutuhan: *${req.amount} Kantong*\nRS: *${req.hospital}*\n\nBantu share info ini! Klik link di bawah untuk detail & kontak:`;
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
    <section className="py-20 bg-rose-50/50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Pasien Butuh Darah</h2>
            <p className="text-slate-500">Daftar pasien yang mendesak membutuhkan bantuan donor.</p>
        </div>

        {sharedId ? (
          <div className="mb-12 text-center animate-fadeIn">
              <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-md border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-slate-600">Menampilkan hasil dari tautan</span>
              </div>
              <br/><br/>
              <button onClick={clearSharedFilter} className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-700 transition-all text-sm shadow-lg shadow-slate-300/50">
                  <ArrowLeft size={16}/> Lihat Semua Pasien
              </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="relative w-full max-w-lg shadow-sm">
                <input type="text" placeholder="Cari nama pasien atau rumah sakit..." className="w-full p-4 pl-12 rounded-2xl border-none shadow-lg shadow-slate-200/50 focus:ring-4 focus:ring-rose-100 text-slate-700 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
                {['ALL', 'A', 'B', 'AB', 'O'].map(type => (
                    <button key={type} onClick={() => setFilterBlood(type)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${filterBlood === type ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>{type === 'ALL' ? 'Semua' : type}</button>
                ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRequests.map(req => (
              <div key={req.id} className={`bg-white p-7 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300 ${sharedId ? 'ring-4 ring-rose-100 scale-105' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-rose-50 to-red-100 text-rose-600 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-rose-100 shadow-inner">
                            <span className="text-2xl font-bold leading-none">{req.bloodType}</span>
                            <span className="text-[10px] font-bold mt-0.5 opacity-70">{safeText(req.rhesus)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-xl text-slate-800 truncate">{req.patient}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                                <User size={14} className="text-slate-400"/> {req.age ? `${req.age} Tahun` : 'Usia -'}
                            </div>
                        </div>
                    </div>
                    <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-rose-100 animate-pulse">Urgent</div>
                </div>

                <div className="space-y-4 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-rose-400 mt-0.5 shrink-0" />
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokasi / RS</p><p className="text-sm font-semibold text-slate-700 leading-snug">{req.hospital}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Droplet size={18} className="text-rose-400 mt-0.5 shrink-0" />
                        <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dibutuhkan</p><p className="text-sm font-semibold text-slate-700">{req.amount} Kantong</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone size={18} className="text-rose-400 mt-0.5 shrink-0" />
                        <div className="w-full">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kontak Keluarga</p>
                            <div className="flex items-center justify-between">
                                <p className="text-base font-bold text-slate-800 tracking-wide">{req.contact}</p>
                                <button onClick={() => copyToClipboard(req.contact)} className="text-slate-300 hover:text-rose-500 transition-colors"><Copy size={16} /></button>
                            </div>
                            {req.contact2 && (
                                <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-500">{req.contact2} <span className="text-[10px] bg-slate-100 px-1.5 rounded text-slate-400">Alt</span></p>
                                        <button onClick={() => copyToClipboard(req.contact2)} className="text-slate-300 hover:text-rose-500 transition-colors"><Copy size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-3">
                    <a href={getWALink(req.contact, `Halo, saya ingin membantu donor untuk pasien ${req.patient}.`)} target="_blank" rel="noreferrer" className="col-span-3 bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wide shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all hover:-translate-y-0.5"><MessageCircle size={18} /> Chat WA</a>
                    <button onClick={() => handleShare(req)} className="col-span-1 bg-white text-blue-500 border border-blue-100 rounded-xl flex justify-center items-center hover:bg-blue-50 transition-all shadow-sm"><Share2 size={20}/></button>
                    <button onClick={() => setPosterData(req)} className="col-span-1 bg-white text-rose-500 border border-rose-100 rounded-xl flex justify-center items-center hover:bg-rose-50 transition-all shadow-sm"><Instagram size={20}/></button>
                </div>
              </div>
            ))}
        </div>
        {/* ADDED CTA BUTTON HERE */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-slate-500 font-medium">Anda atau kerabat butuh darah segera?</p>
          <button onClick={() => setView('search')} className="px-8 py-3.5 bg-[#C0392B] text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all hover:-translate-y-1">Ajukan Permohonan Darah</button>
        </div>
      </div>
      {posterData && <IGPosterModal patient={posterData} onClose={() => setPosterData(null)} />}
    </section>
  );
};

const VolunteerForm = ({ onSubmit, isLoading }) => {
    const [form, setForm] = useState({ name: '', bloodType: 'A', rhesus: '+', phone: '', address: '', lastDonorDate: '' });
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto my-10 border-t-4 border-[#C0392B]">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-6 flex items-center gap-2"><UserPlus className="text-[#2C3E50]" /> Form Pendaftaran Relawan</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label><input required type="text" className="w-full border rounded-lg p-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Golongan Darah</label><select className="w-full border rounded-lg p-2 bg-white" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Rhesus</label><select className="w-full border rounded-lg p-2 bg-white" value={form.rhesus} onChange={e => setForm({...form, rhesus: e.target.value})}><option value="+">Positif (+)</option><option value="-">Negatif (-)</option></select></div>
          </div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Domisili</label><input required type="text" className="w-full border rounded-lg p-2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Waktu Donor Terakhir (Opsional)</label><input type="date" className="w-full border rounded-lg p-2" value={form.lastDonorDate} onChange={e => setForm({...form, lastDonorDate: e.target.value})} /><p className="text-xs text-gray-500 mt-1">Biarkan kosong jika belum pernah donor.</p></div>
          
          {/* INPUT KONTAK */}
          <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">No. HP / WA</label>
              <input required type="tel" className="w-full border rounded-lg p-2" placeholder="08..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>

          {/* DISCLAIMER TAMBAHAN */}
          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
             <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
             <p className="text-sm text-blue-800 leading-snug">Dengan mendaftar, saya menyatakan <strong>bersedia dihubungi sewaktu-waktu</strong> jika ada pasien yang membutuhkan golongan darah saya.</p>
          </div>
  
          <button disabled={isLoading} type="submit" className="w-full bg-[#2C3E50] text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400">
             {isLoading ? 'Menyimpan...' : 'Daftar Jadi Relawan'}
          </button>
        </form>
      </div>
    );
  };

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
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Gol Darah (Rhesus)</label>
              <div className="flex gap-2">
                <select className="w-full border rounded-lg p-2 bg-white" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select>
                <select className="w-full border rounded-lg p-2 bg-white" value={form.rhesus} onChange={e => setForm({...form, rhesus: e.target.value})}><option value="+">+</option><option value="-">-</option></select>
              </div>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah (Kantong)</label><input required type="number" className="w-full border rounded-lg p-2" placeholder="Contoh: 2" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">HP (Utama)</label><input required type="tel" className="w-full border rounded-lg p-2" placeholder="08..." value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">HP Alternatif / Keluarga Lain (Opsional)</label><input type="tel" className="w-full border rounded-lg p-2" placeholder="08..." value={form.contact2} onChange={e => setForm({...form, contact2: e.target.value})} /></div>
          </div>
  
          <button disabled={isLoading} type="submit" className="w-full bg-[#C0392B] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400">
            {isLoading ? 'Mengirim Data...' : 'Kirim Permohonan'}
          </button>
        </form>
      </div>
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
    <section className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10"><h2 className="text-3xl font-bold text-slate-800 mb-2">Relawan Siap Donor</h2><p className="text-slate-500">Pahlawan kemanusiaan yang siap berbagi kehidupan.</p></div>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            <div className="flex gap-2 flex-wrap justify-center">{['ALL', 'A', 'B', 'AB', 'O'].map(type => (<button key={type} onClick={() => setFilterBloodType(type)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${filterBloodType === type ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{type === 'ALL' ? 'Semua' : type}</button>))}</div>
            <button onClick={() => setShowOnlyReady(!showOnlyReady)} className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all ${showOnlyReady ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-500'}`}>{showOnlyReady ? <CheckCircle size={16}/> : <Clock size={16}/>} Hanya Siap Donor</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeVolunteers.map(vol => {
            const eligibility = calculateEligibility(vol.lastDonorDate);
            return (
              <div key={vol.id} className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-inner"><User size={36} /></div>
                <h3 className="font-bold text-lg text-slate-800">{vol.name}</h3>
                
                {/* STATUS MASA TUNGGU YANG LEBIH RAPI */}
                <div className={`mt-3 mb-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${eligibility.eligible ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {eligibility.text}
                </div>

                <div className="w-full border-t border-slate-100 pt-5 grid grid-cols-2 gap-4 text-sm mb-6">
                    <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Golongan</p>
                        <p className="text-xl font-bold text-rose-500">{vol.bloodType}</p>
                    </div>
                    <div className="text-center border-l border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Rhesus</p>
                        <p className="text-xl font-bold text-slate-700">{safeText(vol.rhesus)}</p>
                    </div>
                </div>
                
                <div className="w-full space-y-2.5">
                    {eligibility.eligible ? (
                        <>
                        <a href={getWALink(vol.phone, `Halo Kak ${vol.name}, dari BloodLink...`)} target="_blank" rel="noreferrer" className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide flex justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"><MessageCircle size={16}/> Hubungi Relawan</a>
                        </>
                    ) : (
                        <button disabled className="w-full bg-slate-100 text-slate-400 py-3 rounded-xl font-bold text-xs uppercase tracking-wide cursor-not-allowed flex items-center justify-center gap-2">
                           <Clock size={16}/> {eligibility.text}
                        </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center bg-slate-900 rounded-[2.5rem] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">Mari Berbagi Kehidupan</h3>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">Bergabunglah menjadi bagian dari keluarga besar relawan donor darah PMR SMAN 1 Aikmel.</p>
                <button onClick={() => setView('register')} className="px-8 py-3.5 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-900/50 hover:bg-rose-500 transition-all hover:-translate-y-1">Daftar Sekarang</button>
            </div>
        </div>
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
    <section className="py-24 bg-slate-50 relative overflow-hidden"> 
      <div className="container mx-auto px-4 flex flex-col gap-12 relative z-10"> {/* Changed to flex-col and centered */}
        
        {/* TOP SECTION: TITLE & TEXT */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight">
            Misi Kemanusiaan <br/>
            <span className="text-[#C0392B] text-5xl md:text-6xl">PMR SMANEL</span>
          </h2>
          <div className="text-slate-600 leading-relaxed mb-8 space-y-6 text-base">
            <p>
              Berawal dari kesadaran bahwa setetes darah sangat berharga, kami menyadari perlunya sebuah sistem yang dapat memetakan potensi pendonor di lingkungan SMAN 1 AIKMEL untuk membantu sesama yang membutuhkan.
            </p>
            
            {/* VISI MISI GRID */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-base"><Target className="text-rose-500" size={18}/> Visi Kami</h4>
                  <p className="text-sm text-slate-500">Menjadi pusat informasi dan pangkalan data donor darah berbasis sekolah yang responsif, akurat, dan terpercaya guna mewujudkan generasi peduli kemanusiaan.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-base"><Rocket className="text-blue-500" size={18}/> Misi Kami</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 shrink-0"></div><span><strong>Digitalisasi Data:</strong> Mengelola data golongan darah warga sekolah dan masyarakat secara terstruktur dan aman.</span></li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 shrink-0"></div><span><strong>Respons Cepat:</strong> Mempercepat proses pencarian pendonor di saat-saat darurat (urgent) melalui teknologi.</span></li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 shrink-0"></div><span><strong>Edukasi Masif:</strong> Meningkatkan kesadaran akan pentingnya donor darah bagi kesehatan dan nilai kemanusiaan.</span></li>
                    <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 shrink-0"></div><span><strong>Sinergi Kemanusiaan:</strong> Membangun kolaborasi solid antara sekolah, Unit Transfusi Darah (UTD), dan masyarakat luas.</span></li>
                  </ul>
                </div>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: IMAGE (LARGE & CENTERED) */}
        <div className="w-full max-w-5xl mx-auto relative">
             <div className="absolute inset-0 bg-rose-200 rounded-[3rem] rotate-1 opacity-50 blur-sm"></div>
             <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200" alt="PMR Activity" className="relative rounded-[3rem] shadow-2xl w-full h-[400px] md:h-[500px] object-cover border-8 border-white" />
        </div>

        {/* BOTTOM SECTION: STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform"><div className="text-4xl font-bold text-rose-500 mb-1">{activeVolunteerCount}</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Relawan Aktif</div></div>
            <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform"><div className="text-4xl font-bold text-rose-500 mb-1">{fulfilledBagsCount}</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kantong Tersalur</div></div>
            <div className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform"><div className="text-4xl font-bold text-rose-500 mb-1">24/7</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layanan Siap Siaga</div></div>
        </div>
      </div>
    </section>
  );
};

const Education = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Pojok Edukasi</h2>
            <p className="text-slate-500">Pelajari lebih lanjut tentang dunia donor darah.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{articles.map((article) => (
            <div key={article.id} className="bg-slate-50 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group border border-slate-100 cursor-pointer" onClick={() => setSelectedArticle(article)}>
              <div className="h-56 overflow-hidden"><img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
              <div className="p-8"><h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-rose-600 transition-colors">{article.title}</h3><p className="text-slate-500 text-sm mb-6 line-clamp-2">{article.excerpt}</p><button className="text-rose-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Baca Selengkapnya <ChevronRight size={14} /></button></div>
            </div>
          ))}</div>
      </div>
      {selectedArticle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setSelectedArticle(null)} className="absolute top-6 right-6 z-10 bg-white/50 p-2.5 rounded-full hover:bg-white transition-all backdrop-blur-sm"><X size={20} className="text-slate-800"/></button>
            <div className="h-72 w-full overflow-hidden"><img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" /></div>
            <div className="p-10">
                <div className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4">Artikel Kesehatan</div>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">{selectedArticle.title}</h2>
                <ul className="space-y-4 text-slate-600 leading-relaxed text-lg">
                    {selectedArticle.content.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start">
                            <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xs mt-0.5 shrink-0">{i+1}</div>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Footer = ({ setView }) => (
  <footer className="bg-slate-900 text-white py-16 border-t border-white/5">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="flex items-center gap-3 mb-6"><div className="h-10 w-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-900/20"><Droplet fill="currentColor" size={20} /></div><h3 className="text-2xl font-bold tracking-tight">BloodL!nk</h3></div>
        <p className="text-slate-400 text-sm leading-relaxed">“Bergerak Nyata, Berbagi Kehidupan.” Platform inovasi PMR SMAN 1 Aikmel.</p>
      </div>
      <div><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Navigasi</h3><ul className="space-y-4 text-sm font-medium text-slate-300"><li><button onClick={() => setView('patient_list')} className="hover:text-rose-400 transition-colors">Butuh Donor</button></li><li><button onClick={() => setView('volunteer_list')} className="hover:text-rose-400 transition-colors">Data Relawan</button></li><li><button onClick={() => setView('stock')} className="hover:text-rose-400 transition-colors">Stok Darah</button></li></ul></div>
      <div><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Markas</h3><ul className="space-y-4 text-sm text-slate-300"><li className="flex items-start gap-3"><MapPin size={18} className="text-rose-500 mt-0.5 shrink-0"/><span>Jl. Pendidikan No.35, Aikmel, Kec. Aikmel, Kabupaten Lombok Timur, Nusa Tenggara Bar. 83653</span></li><li className="flex items-center gap-3"><Phone size={18} className="text-rose-500"/> +62 818-0332-4919</li></ul></div>
      <div><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Sosial Media</h3><div className="flex gap-4">
        {[
            { icon: <Instagram size={20} />, href: "https://www.instagram.com/pmr_smanel/" },
            { icon: <Facebook size={20} />, href: "https://web.facebook.com/pmr.smanel.1" },
            { icon: <Video size={20} />, href: "https://www.tiktok.com/@pmrsmanel" },
            { icon: <Youtube size={20} />, href: "https://www.youtube.com/@pmrsmanel4782" }
        ].map((social, i) => (
            <a key={i} href={social.href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">{social.icon}</a>
        ))}
      </div></div>
    </div>
    <div className="pt-8 border-t border-white/5 text-center text-xs font-medium text-slate-500 uppercase tracking-widest">&copy; 2026 PMR SMANEL. All rights reserved.</div>
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