import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Droplet, Search, UserPlus, BookOpen, Menu, X, Phone, MapPin, 
  Shield, Activity, Calendar, CheckCircle, AlertCircle, LogOut, Edit3, 
  Trash2, Save, Users, ChevronRight, PlusCircle, User, Info, Loader, 
  RefreshCw, Facebook, Instagram, Youtube, Video, MessageCircle, Clock, 
  Share2, AlertTriangle, ArrowLeft, Camera, Download, Globe, Copy, Target, Rocket
} from 'lucide-react';

// --- KONFIGURASI DATABASE ---
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxY5wb5lz39PyDKncKm1xb2LUDqU6etKZvHAQ9o7T1_ydO2YtmEbEpKeumeDZKOStX9ZQ/exec";

// ============================================================================
// 1. DATA INITIAL & ARTIKEL
// ============================================================================
const FALLBACK_DATA = {
  bloodStock: {
    A: { positive: 0, negative: 0 },
    B: { positive: 0, negative: 0 },
    AB: { positive: 0, negative: 0 },
    O: { positive: 0, negative: 0 },
  },
  pmiStock: [],
  mobileUnit: [],
  volunteers: [],
  requests: []
};

const ARTICLES = [
  { id: 1, title: "Syarat Menjadi Pendonor Darah", excerpt: "Ketahui syarat fisik sebelum donor.", content: ["Sehat jasmani dan rohani.", "Usia 17-60 tahun.", "Berat badan minimal 45 kg.", "Tidak sedang sakit."], image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=500" },
  { id: 2, title: "Mitos vs Fakta Donor Darah", excerpt: "Simak faktanya di sini.", content: ["❌ Mitos: Donor darah bikin gemuk.", "✅ Fakta: Justru membakar kalori.", "❌ Mitos: Menyakitkan.", "✅ Fakta: Hanya seperti gigitan semut."], image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=500" },
  { id: 3, title: "Manfaat Donor Bagi Kesehatan", excerpt: "Tubuh menjadi lebih sehat.", content: ["Menurunkan risiko penyakit jantung.", "Mengurangi kekentalan darah.", "Pemeriksaan kesehatan gratis."], image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=500" }
];

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

const cleanPhoneNumber = (phone) => {
  if (!phone) return "";
  let cleaned = String(phone).replace(/\D/g, ''); 
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

const formatDateIndo = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const getWALink = (phone, text = "") => {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return "#";
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
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

const sendDataToSheet = async (sheetName, data, action = 'write') => {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")) return false;
  
  const sanitizedData = { ...data };
  // Prefix ' agar tidak error di Spreadsheet
  if (sanitizedData.rhesus && !String(sanitizedData.rhesus).startsWith("'")) sanitizedData.rhesus = `'${sanitizedData.rhesus}`;
  if (sanitizedData.contact && !String(sanitizedData.contact).startsWith("'")) sanitizedData.contact = `'${sanitizedData.contact}`;
  if (sanitizedData.contact2 && !String(sanitizedData.contact2).startsWith("'")) sanitizedData.contact2 = `'${sanitizedData.contact2}`;
  if (sanitizedData.phone && !String(sanitizedData.phone).startsWith("'")) sanitizedData.phone = `'${sanitizedData.phone}`;

  try {
    await fetch(`${APPS_SCRIPT_URL}?action=${action}&sheet=${sheetName}`, { 
      method: 'POST', 
      mode: 'no-cors', 
      body: JSON.stringify(sanitizedData) 
    });
    return true;
  } catch (e) { console.error(e); return false; }
};

// ============================================================================
// 3. UI COMPONENTS
// ============================================================================

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  const bgColors = { success: 'bg-green-600', error: 'bg-[#800000]', info: 'bg-blue-600' };
  return (
    <div className={`fixed top-6 right-6 z-[99999] ${bgColors[type] || bgColors.info} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slideIn backdrop-blur-sm bg-opacity-95 border border-white/10 max-w-[90vw]`}>
      {type === 'success' && <CheckCircle size={24} className="text-emerald-100 shrink-0" />}
      {type === 'error' && <AlertCircle size={24} className="text-red-100 shrink-0" />}
      <span className="font-semibold text-sm tracking-wide">{typeof message === 'string' ? message : 'Notifikasi'}</span>
      <button onClick={onClose} className="ml-auto hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={16}/></button>
    </div>
  );
};

const IGPosterModal = ({ patient, onClose }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [libLoaded, setLibLoaded] = useState(false);

  useEffect(() => {
    if (window.html2canvas) { setLibLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.async = true;
    script.onload = () => setLibLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleDownload = async () => {
    if (!posterRef.current || !window.html2canvas) return;
    setDownloading(true);
    try {
      await document.fonts.ready;
      window.scrollTo(0, 0); 
      await new Promise(r => setTimeout(r, 1000));
      const canvas = await window.html2canvas(posterRef.current, { scale: 3, useCORS: true, backgroundColor: null, scrollX: 0, scrollY: 0 });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `BloodLink-${patient.patient.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch(e) { console.error(e); } finally { setDownloading(false); }
  };

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-slate-900/90 backdrop-blur-md p-4 pt-10 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-[400px] flex flex-col items-center">
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full mb-8 flex items-center gap-2 font-semibold backdrop-blur-md transition-all text-sm border border-white/10 shadow-lg"><X size={18} /> Tutup Preview</button>
        <div ref={posterRef} className="w-[360px] flex-shrink-0 bg-white shadow-2xl relative overflow-hidden box-border rounded-[24px] border border-gray-100">
          <div className="bg-gradient-to-r from-[#800000] to-red-900 px-6 py-6 text-white relative z-10 text-left">
            <div className="flex justify-between items-center text-left">
               <div className="flex items-center gap-3"><div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20"><Droplet size={22} fill="currentColor" className="text-white" /></div><div className="text-left"><h3 className="font-bold text-xl leading-none uppercase">Urgent</h3><p className="text-[10px] font-medium opacity-90 tracking-[0.2em] mt-1 text-red-100 uppercase">Butuh Donor</p></div></div>
               <div className="text-right"><p className="text-[9px] font-medium opacity-80 uppercase tracking-wide">Dibuat Oleh</p><p className="text-xs font-bold tracking-wide">PMR SMANEL</p></div>
            </div>
          </div>
          <div className="px-7 py-8 bg-white text-left">
            <div className="flex flex-col items-center justify-center mb-10 pb-6 border-b border-dashed border-gray-200">
               <div className="flex items-end justify-center mb-4 text-[#800000]">
                    <span className="text-[100px] font-black leading-none">{patient.bloodType}</span>
                    <span className="text-5xl font-bold ml-3 mb-2">{safeText(patient.rhesus)}</span>
               </div>
               <div className="bg-red-50 text-[#800000] px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest border border-red-100 shadow-sm">Butuh {patient.amount} Kantong</div>
            </div>
            <div className="w-full text-left">
                <div className="flex items-start mb-5 text-left">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#800000] shrink-0 mr-4"><User size={20} strokeWidth={2}/></div>
                    <div className="flex-1 border-b border-gray-100 pb-2 text-left"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Nama Pasien</p><p className="font-bold text-xl text-gray-800 leading-tight">{patient.patient}</p>{patient.age && <p className="text-xs text-gray-500 font-medium mt-1">Usia: {patient.age} Tahun</p>}</div>
                </div>
                <div className="flex items-start mb-5 text-left">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#800000] shrink-0 mr-4"><MapPin size={20} strokeWidth={2}/></div>
                    <div className="flex-1 border-b border-gray-100 pb-2 text-left"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Lokasi Dirawat</p><p className="font-bold text-lg text-gray-800 leading-tight">{patient.hospital}</p></div>
                </div>
                <div className="flex items-start text-left">
                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#800000] shrink-0 mr-4"><Phone size={20} strokeWidth={2}/></div>
                    <div className="flex-1 text-left"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Hubungi Keluarga</p><p className="font-bold text-2xl text-[#800000] leading-tight font-mono">{patient.contact}</p></div>
                </div>
            </div>
          </div>
          <div className="bg-slate-900 py-6 px-6 text-center rounded-b-[24px]">
             <p className="text-[10px] italic text-slate-300 mb-3 font-medium font-serif">"Setetes darah Anda, nyawa bagi sesama."</p>
             <div className="border-t border-white/10 pt-4 flex justify-center items-center gap-4 text-white">
                 <div className="flex items-center"><Instagram size={14} className="text-red-400 mr-2"/><span className="text-[10px] font-bold tracking-wide">@pmr_smanel</span></div>
                 <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                 <div className="flex items-center"><Globe size={14} className="text-red-400 mr-2"/><span className="text-[10px] font-bold tracking-wide">bloodlink.pmrsmanel.my.id</span></div>
             </div>
          </div>
        </div>
        <button onClick={handleDownload} disabled={downloading || !libLoaded} className="mt-8 w-full py-4 bg-white text-[#800000] rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-red-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70">{downloading ? <Loader size={18} className="animate-spin" /> : <Download size={18} />} {downloading ? 'Memproses...' : 'Simpan Gambar'}</button>
      </div>
    </div>
  );
};

// ============================================================================
// 4. NAV & CONTENT COMPONENTS
// ============================================================================

const Navbar = ({ setView, view, isLoggedIn }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
      { label: 'Home', value: 'home' }, { label: 'Butuh Donor', value: 'patient_list' }, { label: 'Data Relawan', value: 'volunteer_list' }, { label: 'Stok Darah', value: 'stock' }, { label: 'Edukasi', value: 'education' }
    ];
    return (
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#800000] to-red-900 shadow-lg font-sans">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer group" onClick={() => setView('home')}>
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#800000] mr-3 shadow-lg group-hover:scale-110 transition-transform"><Droplet fill="currentColor" size={20} /></div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">BloodL!nk</h1>
                <p className="text-[10px] text-red-100 font-bold tracking-widest uppercase mt-1">PMR SMANEL</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-left">
              {navItems.map((item) => (<button key={item.value} onClick={() => setView(item.value)} className={`font-semibold text-sm transition-all hover:-translate-y-0.5 ${view === item.value ? 'text-white underline decoration-2 underline-offset-4' : 'text-red-100 hover:text-white'}`}>{item.label}</button>))}
              <button onClick={() => setView(isLoggedIn ? 'admin' : 'login')} className="px-6 py-2.5 rounded-full bg-white text-[#800000] border border-white hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider">{isLoggedIn ? 'Dashboard' : 'Login Admin'}</button>
            </div>
            <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-red-100 transition-colors">{isOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl animate-fadeIn">
            <div className="flex flex-col p-4 space-y-2 text-left">
              {navItems.map((item) => (<button key={item.value} onClick={() => { setView(item.value); setIsOpen(false); }} className={`text-left font-semibold py-3 px-4 rounded-xl ${view === item.value ? 'bg-red-50 text-[#800000]' : 'text-slate-600 hover:bg-slate-50'}`}>{item.label}</button>))}
              <button onClick={() => { setView(isLoggedIn ? 'admin' : 'login'); setIsOpen(false); }} className="text-left font-semibold py-3 px-4 text-slate-500 border-t border-slate-100 mt-2">{isLoggedIn ? 'Dashboard Admin' : 'Login Admin'}</button>
            </div>
          </div>
        )}
      </nav>
    );
};

const Hero = ({ setView }) => (
    <header className="bg-gradient-to-b from-red-50 via-white to-white pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Abstract Blood Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <pattern id="blood-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="3" fill="#800000" />
                <circle cx="70" cy="60" r="4" fill="#800000" />
                <circle cx="40" cy="80" r="2" fill="#800000" />
             </pattern>
             <rect x="0" y="0" width="100%" height="100%" fill="url(#blood-pattern)" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white border border-red-100 text-[#800000] text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
          <Activity size={12} /> BLOODLINK PMR SMANEL
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight text-center">
          Karena Setiap Tetes <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-red-700">Sangat Berarti.</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed text-center">
          Selamat datang di <strong>BloodL!nk PMR SMANEL</strong> - BLOODL!NK adalah inisiatif digital karya “PMR SMANEL” dalam mengamalkan Tri Bakti PMR, aplikasi ini bertujuan untuk menjembatani pasien yang membutuhkan darah dengan relawan pendonor.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={() => setView('patient_list')} className="w-full sm:w-auto px-8 py-4 bg-[#800000] text-white rounded-2xl shadow-xl shadow-red-200 hover:bg-red-900 hover:-translate-y-1 transition-all font-bold flex items-center justify-center gap-3 text-sm uppercase tracking-wide">
              <Search size={18} /> Lihat Pasien Butuh Darah
          </button>
          <button onClick={() => setView('register')} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-red-200 transition-all font-bold flex items-center justify-center gap-3 text-sm uppercase tracking-wide group">
              <UserPlus size={18} className="text-slate-400 group-hover:text-[#800000] transition-colors"/> Saya Ingin Donor Darah
          </button>
        </div>
      </div>
    </header>
);

const StockDashboard = ({ bloodStock, pmiStock, mobileUnit }) => {
    const totalVolunteers = Object.values(bloodStock).reduce((acc, curr) => acc + curr.positive + curr.negative, 0);
    const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-3 uppercase tracking-tight text-center">Stok Darah & Jadwal</h2>
              <div className="h-1.5 w-20 bg-[#800000] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm text-left">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center justify-between">
                  <span className="flex items-center gap-3"><Droplet className="text-[#800000]" fill="currentColor" /> Relawan Siap Donor</span>
                  <span className="text-xs bg-red-100 text-[#800000] py-1.5 px-4 rounded-full font-bold">Total: {totalVolunteers}</span>
              </h3>
              <div className="grid grid-cols-2 gap-5">
                  {Object.entries(bloodStock).map(([type, data]) => (
                      <div key={type} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-red-300 transition-all">
                          <div className="absolute top-0 left-0 w-full h-1 bg-[#800000]"></div>
                          <div className="mb-3 mt-1">
                              <span className="text-5xl font-black text-slate-800">{type}</span>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-1">Golongan</div>
                          </div>
                          <div className="w-full flex justify-between gap-2 px-2">
                               <div className="flex flex-col items-center flex-1 bg-slate-50 rounded p-1 border border-slate-100">
                                   <span className="text-[9px] font-bold text-slate-400 uppercase">Rh+</span>
                                   <span className="text-lg font-black text-[#800000]">{data.positive}</span>
                               </div>
                               <div className="flex flex-col items-center flex-1 bg-slate-50 rounded p-1 border border-slate-100">
                                   <span className="text-[9px] font-bold text-slate-400 uppercase">Rh-</span>
                                   <span className="text-lg font-black text-[#800000]">{data.negative}</span>
                               </div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-xl shadow-slate-100/50">
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 uppercase"><Activity className="text-[#800000]" /> Stok Darah PMI Lombok Timur</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 text-left">Info Stok Darah UTD</p>
                    </div>
                    <div className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Clock size={10}/> Update: {currentDate}</p>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl border-2 border-slate-200 text-left">
                  <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-100 text-slate-600 text-left">
                          <tr>
                              <th className="px-5 py-3 font-bold text-[10px] uppercase tracking-wider border-b-2 border-slate-200 text-left">Produk</th>
                              <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200 text-center">A</th>
                              <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200 text-center">B</th>
                              <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200 text-center">O</th>
                              <th className="px-4 py-3 text-center font-bold border-b-2 border-l border-slate-200 text-center">AB</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white text-left">
                          {pmiStock.length > 0 ? pmiStock.map((row, i) => (
                                  <tr key={i} className="hover:bg-red-50/50 transition-colors">
                                      <td className="px-5 py-3.5 font-bold text-slate-700">{row.product}</td>
                                      <td className="px-4 py-3 text-center text-slate-600 border-l border-slate-100">{row.A}</td>
                                      <td className="px-4 py-3 text-center text-slate-600 border-l border-slate-100">{row.B}</td>
                                      <td className="px-4 py-3 text-center text-slate-600 border-l border-slate-100">{row.O}</td>
                                      <td className="px-4 py-3 text-center text-slate-600 border-l border-slate-100">{row.AB}</td>
                                  </tr>
                          )) : <tr><td colSpan="5" className="p-6 text-center text-slate-400 text-xs italic">Menunggu sinkronisasi...</td></tr>}
                      </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-slate-800 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden text-left">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase"><Calendar className="text-red-400" /> Jadwal Mobil Unit</h3>
                <div className="space-y-4 text-left">
                  {mobileUnit.length > 0 ? mobileUnit.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors text-left">
                      <div className="bg-red-900/20 p-2 rounded-lg text-red-400"><MapPin size={18}/></div>
                      <div className="text-left"><p className="font-bold text-sm">{item.location}</p><p className="text-xs text-slate-400 mt-1">{formatDateIndo(item.date)} • {item.time}</p></div>
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
  
    // Sort: requests with status 'Mencari' come first
    const sortedRequests = [...activeRequests].sort((a, b) => {
        if (a.status === 'Mencari' && b.status !== 'Mencari') return -1;
        if (a.status !== 'Mencari' && b.status === 'Mencari') return 1;
        return b.id - a.id;
    });
  
    const handleShare = async (req) => {
      const shareUrl = `${window.location.origin}?view=patient_list&id=${req.id}`;
      const baseText = `🚨 *URGENT: BUTUH DONOR DARAH* 🚨\n\nPasien: *${req.patient}*\nGolongan: *${req.bloodType}${safeText(req.rhesus)}*\nKebutuhan: *${req.amount} Kantong*\nRS: *${req.hospital}*\n\nBantu share info ini! Detail selengkapnya di BloodLink PMR SMANEL:`;
      if (navigator.share) {
        try { await navigator.share({ title: 'Butuh Donor', text: baseText, url: shareUrl }); } catch (err) {}
      } else {
        navigator.clipboard.writeText(`${baseText}\n${shareUrl}`);
        showToast('Link disalin ke clipboard!', 'success');
      }
    };
  
    return (
      <section className="py-20 bg-red-50/50 min-h-screen text-left">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-slate-800 mb-2 uppercase tracking-tight text-center">Pasien Butuh Darah</h2><p className="text-slate-500 text-center">Daftar pasien yang mendesak membutuhkan bantuan donor.</p></div>
          {!sharedId && (
            <div className="flex flex-col items-center gap-6 mb-12 text-center">
              <div className="relative w-full max-w-lg">
                  <input type="text" placeholder="Cari nama pasien atau rumah sakit..." className="w-full p-4 pl-12 rounded-2xl border-none shadow-lg focus:ring-4 focus:ring-red-100 text-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                  {['ALL', 'A', 'B', 'AB', 'O'].map(type => (<button key={type} onClick={() => setFilterBlood(type)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${filterBlood === type ? 'bg-[#800000] text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200'}`}>{type === 'ALL' ? 'Semua' : type}</button>))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {sortedRequests.map(req => (
                <div key={req.id} className="bg-white p-7 rounded-[2rem] shadow-xl border border-slate-100 relative group hover:-translate-y-1 transition-all text-left">
                  <div className="absolute top-6 right-6 bg-red-50 text-[#800000] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">Urgent</div>
                  <div className="flex items-center gap-4 mb-6 text-left">
                        <div className="bg-red-50 text-[#800000] w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-red-100 shrink-0">
                            <span className="text-2xl font-bold leading-none">{req.bloodType}</span>
                            <span className="text-[10px] font-bold mt-0.5 opacity-70">{safeText(req.rhesus)}</span>
                        </div>
                        <div className="overflow-hidden pr-10 text-left">
                            <h3 className="font-bold text-xl text-slate-800 truncate text-left">{req.patient}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 text-left"><User size={14}/> {req.age ? `${req.age} Tahun` : 'Usia -'}</div>
                        </div>
                  </div>
                  <div className="space-y-4 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-left">
                      <div className="flex items-start gap-3 text-left">
                          <MapPin size={18} className="text-[#800000] shrink-0" />
                          <div className="text-left"><p className="text-[10px] text-slate-400 font-bold uppercase">Lokasi / RS</p><p className="text-sm font-semibold text-slate-700 text-left">{req.hospital}</p></div>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                          <Droplet size={18} className="text-[#800000] shrink-0" />
                          <div className="text-left"><p className="text-[10px] text-slate-400 font-bold uppercase">Dibutuhkan</p><p className="text-sm font-semibold text-slate-700 text-left">{req.amount} Kantong</p></div>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                          <Phone size={18} className="text-[#800000] shrink-0" />
                          <div className="text-left w-full">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Kontak Keluarga</p>
                              <div className="flex items-center justify-between">
                                <p className="text-base font-bold text-slate-800 text-left">{req.contact}</p>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(req.contact);
                                        showToast('Nomor disalin!', 'success');
                                    }}
                                    className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all"
                                    title="Salin Nomor"
                                >
                                    <Copy size={14}/>
                                </button>
                              </div>
                              {req.contact2 && (
                                <div className="flex items-center justify-between mt-1 pt-1 border-t border-dashed border-gray-100">
                                    <p className="text-xs text-slate-500 text-left">Alt: {req.contact2}</p>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(req.contact2);
                                            showToast('Nomor alternatif disalin!', 'success');
                                        }}
                                        className="p-1 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                                        title="Salin Nomor Alternatif"
                                    >
                                        <Copy size={10}/>
                                    </button>
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                      <a href={getWALink(req.contact, `Assalamu'alaikum/Halo, mohon maaf mengganggu waktunya. Saya mendapatkan informasi dari BloodLink PMR SMANEL bahwa Anda sedang membutuhkan donor darah golongan ${req.bloodType}${safeText(req.rhesus)} untuk pasien ${req.patient}. Apakah saya bisa membantu?`)} target="_blank" rel="noreferrer" className="col-span-3 bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wide hover:bg-emerald-600 transition-all shadow-md"><MessageCircle size={18} /> Chat WA</a>
                      <button onClick={() => handleShare(req)} className="col-span-1 bg-white text-blue-500 border border-blue-100 rounded-xl flex justify-center items-center hover:bg-blue-50 transition-all shadow-sm"><Share2 size={20}/></button>
                      <button onClick={() => setPosterData(req)} className="col-span-1 bg-white text-[#800000] border border-red-100 rounded-xl flex justify-center items-center hover:bg-red-50 transition-all shadow-sm"><Instagram size={20}/></button>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-16 text-center">
             <button onClick={() => setView('search')} className="px-8 py-3.5 bg-[#800000] text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-900 transition-all hover:-translate-y-1 uppercase tracking-wide text-sm flex items-center gap-2 mx-auto"><PlusCircle size={18}/> Ajukan Permohonan Darah</button>
          </div>
          {sortedRequests.length === 0 && <div className="text-center py-20 text-slate-400 italic">Tidak ada data ditemukan.</div>}
        </div>
        {posterData && <IGPosterModal patient={posterData} onClose={() => setPosterData(null)} />}
      </section>
    );
};

const VolunteerList = ({ volunteers, setView }) => {
  const [filterBloodType, setFilterBloodType] = useState('ALL');
  const [showReadyOnly, setShowReadyOnly] = useState(false);

  const activeVolunteers = volunteers.filter(vol => {
    const isActive = vol.status === 'Aktif';
    const matchesBlood = filterBloodType === 'ALL' || vol.bloodType === filterBloodType;
    const matchesReady = showReadyOnly ? calculateEligibility(vol.lastDonorDate).eligible : true;
    return isActive && matchesBlood && matchesReady;
  });

  return (
    <section className="py-20 bg-white min-h-screen text-left">
      <div className="container mx-auto px-4 text-left">
        <div className="text-center mb-10"><h2 className="text-3xl font-bold text-slate-800 mb-2 uppercase tracking-tight text-center">Relawan Siap Donor</h2><p className="text-slate-500 text-center">Para pahlawan kemanusiaan SMANEL.</p></div>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10 text-center items-center">
          <div className="flex gap-2 flex-wrap justify-center">
             {['ALL', 'A', 'B', 'AB', 'O'].map(type => (<button key={type} onClick={() => setFilterBloodType(type)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${filterBloodType === type ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>{type === 'ALL' ? 'Semua' : type}</button>))}
          </div>
          <button onClick={() => setShowReadyOnly(!showReadyOnly)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${showReadyOnly ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}>
             {showReadyOnly ? <CheckCircle size={16} /> : <Clock size={16} />} Hanya Siap Donor
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {activeVolunteers.map(vol => {
            const eligibility = calculateEligibility(vol.lastDonorDate);
            return (
              <div key={vol.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400"><User size={30} /></div>
                <h3 className="font-bold text-lg text-slate-800 text-center">{vol.name}</h3>
                <div className={`mt-2 mb-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${eligibility.eligible ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {eligibility.text}
                </div>
                <div className="w-full grid grid-cols-2 gap-4 text-sm mb-6 border-t pt-4">
                    <div><p className="text-[9px] text-slate-400 font-bold uppercase">Golongan</p><p className="text-xl font-bold text-[#800000]">{vol.bloodType}</p></div>
                    <div className="border-l"> <p className="text-[9px] text-slate-400 font-bold uppercase">Rhesus</p><p className="text-xl font-bold text-slate-700">{safeText(vol.rhesus)}</p></div>
                </div>
                {eligibility.eligible ? (
                    <a href={getWALink(vol.phone, `Assalamu'alaikum/Halo Kak ${vol.name}, mohon maaf mengganggu waktunya. Saya melihat Kakak terdaftar sebagai relawan donor darah di platform BloodLink PMR SMANEL. Apakah Kakak saat ini berkenan dan memenuhi syarat untuk melakukan donor darah?`)} target="_blank" rel="noreferrer" className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-xs flex justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-md"><MessageCircle size={16}/> Hubungi</a>
                ) : (
                    <button disabled className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-xl font-bold text-xs cursor-not-allowed">Menunggu Masa Tunggu</button>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
             <button onClick={() => setView('register')} className="px-8 py-3.5 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 transition-all hover:-translate-y-1 uppercase tracking-wide text-sm flex items-center gap-2 mx-auto"><UserPlus size={18}/> Saya Ingin Daftar Relawan</button>
        </div>
      </div>
    </section>
  );
};

const AboutStats = ({ volunteers, requests }) => {
  const activeVolunteerCount = volunteers ? volunteers.filter(v => v.status === 'Aktif').length : 0;
  const fulfilledBagsCount = requests ? requests.filter(r => r.status === 'Terpenuhi').reduce((sum, req) => sum + (parseInt(req.amount) || 0), 0) : 0;
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden text-left">
      <div className="container mx-auto px-4 flex flex-col gap-16 relative z-10 text-left">
        <div className="text-center max-w-4xl mx-auto text-left">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight uppercase text-center">
            Misi Kemanusiaan <br/>
            <span className="text-[#800000] text-5xl md:text-6xl">PMR SMANEL</span>
          </h2>
          <p className="text-slate-600 leading-relaxed mb-12 text-base max-w-2xl mx-auto text-center">
            Berawal dari kesadaran bahwa setetes darah sangat berharga, kami menyadari perlunya sebuah sistem yang dapat memetakan potensi pendonor di lingkungan SMAN 1 AIKMEL untuk membantu sesama yang membutuhkan.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full hover:shadow-md transition-all text-left">
                <div className="w-12 h-12 bg-red-50 text-[#800000] rounded-xl flex items-center justify-center mb-6"><Target size={24}/></div>
                <h4 className="font-bold text-slate-800 mb-4 text-xl uppercase tracking-tight text-left">Visi Kami</h4>
                <p className="text-sm text-slate-500 leading-relaxed text-left">Menjadi pusat informasi dan pangkalan data donor darah berbasis sekolah yang responsif, akurat, dan terpercaya guna mewujudkan generasi peduli kemanusiaan.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-full hover:shadow-md transition-all text-left">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Rocket size={24}/></div>
                <h4 className="font-bold text-slate-800 mb-4 text-xl uppercase tracking-tight text-left">Misi Kami</h4>
                <ul className="space-y-4 text-sm text-slate-500 text-left">
                  <li className="flex gap-3 text-left">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-left"><strong>Digitalisasi Data:</strong> Mengelola data golongan darah warga sekolah dan masyarakat secara terstruktur dan aman.</span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-left"><strong>Respons Cepat:</strong> Mempercepat proses pencarian pendonor di saat-saat darurat (urgent) melalui teknologi.</span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-left"><strong>Edukasi Masif:</strong> Meningkatkan kesadaran akan pentingnya donor darah bagi kesehatan dan nilai kemanusiaan.</span>
                  </li>
                  <li className="flex gap-3 text-left">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"></div>
                    <span className="text-left"><strong>Sinergi Kemanusiaan:</strong> Membangun kolaborasi solid antara sekolah, UTD, dan masyarakat luas.</span>
                  </li>
                </ul>
              </div>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto px-4 text-left">
            <div className="relative group text-left">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-[#800000] rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <img 
                    src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1200" 
                    alt="Aktivitas Kemanusiaan PMR" 
                    className="relative rounded-[2.5rem] w-full h-[300px] md:h-[500px] object-cover shadow-2xl border-4 border-white"
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto text-center">
            <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-all">
                <div className="text-5xl font-black text-[#800000] mb-2">{activeVolunteerCount}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Relawan Aktif</div>
            </div>
            <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-all">
                <div className="text-5xl font-black text-[#800000] mb-2">{fulfilledBagsCount}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Kantong Tersalur</div>
            </div>
            <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-all">
                <div className="text-5xl font-black text-[#800000] mb-2">24/7</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Layanan Siaga</div>
            </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 5. ADMIN COMPONENTS
// ============================================================================

const AdminPanel = ({ volunteers, setVolunteers, requests, setRequests, pmiStock, setPmiStock, mobileUnit, setMobileUnit, onLogout, showToast }) => {
    const [activeTab, setActiveTab] = useState('requests');
    const [saveLoading, setSaveLoading] = useState(false);
    const [newSched, setNewSched] = useState({ location: '', date: '', time: '' });
    const [editingVolunteer, setEditingVolunteer] = useState(null);

    const handlePmiChange = (idx, field, val) => {
        const newStock = [...pmiStock];
        newStock[idx][field] = val;
        setPmiStock(newStock);
    };

    const handleSaveStock = async () => {
        setSaveLoading(true);
        for (const item of pmiStock) {
          await sendDataToSheet('pmiStock', item, 'update');
        }
        setSaveLoading(false);
        showToast("Stok PMI berhasil diperbarui!", "success");
    };

    const toggleStatus = async (id) => {
        const req = requests.find(r => r.id === id);
        if (!req) return;
        const newStatus = req.status === 'Mencari' ? 'Terpenuhi' : 'Mencari';
        const updated = { ...req, status: newStatus };
        setRequests(requests.map(r => r.id === id ? updated : r));
        await sendDataToSheet('requests', updated, 'update');
        showToast(`Status diperbarui ke ${newStatus}`, 'success');
    };

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        const item = { id: Date.now(), ...newSched };
        setMobileUnit([...mobileUnit, item]);
        setNewSched({ location: '', date: '', time: '' });
        await sendDataToSheet('mobileUnit', item);
        showToast("Jadwal ditambahkan", "success");
    };

    const handleDeleteSchedule = async (id) => {
        setMobileUnit(mobileUnit.filter(m => m.id !== id));
        await sendDataToSheet('mobileUnit', { id }, 'delete');
        showToast("Jadwal dihapus", "success");
    };

    const handleUpdateVolunteer = async (e) => {
        e.preventDefault();
        setVolunteers(volunteers.map(v => v.id === editingVolunteer.id ? editingVolunteer : v));
        await sendDataToSheet('volunteers', editingVolunteer, 'update');
        showToast("Data relawan diperbarui", "success");
        setEditingVolunteer(null);
    };

    // Sort requests: 'Mencari' first
    const sortedAdminRequests = [...requests].sort((a, b) => {
      if (a.status === 'Mencari' && b.status !== 'Mencari') return -1;
      if (a.status !== 'Mencari' && b.status === 'Mencari') return 1;
      return b.id - a.id;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex text-left">
            <aside className="w-64 bg-slate-900 text-white hidden md:block text-left">
                <div className="p-6 border-b border-white/10 text-left"><h2 className="text-xl font-bold text-left">Admin Panel</h2><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-left">PMR SMANEL</p></div>
                <nav className="p-4 space-y-2 text-left">
                    <button onClick={() => setActiveTab('requests')} className={`w-full p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'requests' ? 'bg-[#800000]' : 'hover:bg-white/5 text-slate-400'}`}><AlertCircle size={18}/> Permohonan</button>
                    <button onClick={() => setActiveTab('volunteers')} className={`w-full p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'volunteers' ? 'bg-[#800000]' : 'hover:bg-white/5 text-slate-400'}`}><Users size={18}/> Relawan</button>
                    <button onClick={() => setActiveTab('stock')} className={`w-full p-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'stock' ? 'bg-[#800000]' : 'hover:bg-white/5 text-slate-400'}`}><Activity size={18}/> Update Stok & Jadwal</button>
                    <button onClick={onLogout} className="w-full p-3 rounded-xl text-sm font-bold flex items-center gap-3 text-red-400 mt-20 hover:bg-red-400/10 text-left"><LogOut size={18}/> Logout</button>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto h-screen text-left">
                <header className="flex justify-between items-center mb-10 text-left">
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight text-left">{activeTab === 'requests' ? 'Manajemen Permohonan' : activeTab === 'volunteers' ? 'Relawan Siap Donor' : 'Stok & Jadwal PMI'}</h1>
                </header>

                {activeTab === 'requests' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-left">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center text-left"><h3 className="font-bold text-slate-800 text-left">Daftar Permohonan Darah</h3><span className="text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Total: {requests.length}</span></div>
                        <div className="overflow-x-auto text-left">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                                    <tr><th className="p-4 text-left">Pasien & RS</th><th className="p-4 text-center">Gol</th><th className="p-4 text-center">Status</th><th className="p-4 text-right">Aksi</th></tr>
                                </thead>
                                <tbody className="divide-y text-left">
                                    {sortedAdminRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-slate-50 transition-colors text-left">
                                            <td className="p-4 text-left"><p className="font-bold text-slate-800 leading-none mb-1 text-left">{req.patient}</p><p className="text-[10px] text-slate-400 font-bold uppercase text-left">{req.hospital}</p></td>
                                            <td className="p-4 text-center font-bold text-red-600">{req.bloodType}{req.rhesus}</td>
                                            <td className="p-4 text-center"><span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${req.status === 'Mencari' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{req.status}</span></td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 text-right">
                                                    <button onClick={() => toggleStatus(req.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all"><RefreshCw size={12}/> Ubah Status</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'volunteers' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-left">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center text-left"><h3 className="font-bold text-slate-800 text-left">Relawan Siap Donor</h3><span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Total: {volunteers.length}</span></div>
                        <div className="overflow-x-auto text-left">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                                    <tr><th className="p-4 text-left">Nama Lengkap</th><th className="p-4 text-center">Gol</th><th className="p-4 text-center">No. WhatsApp</th><th className="p-4 text-right">Aksi</th></tr>
                                </thead>
                                <tbody className="divide-y text-left">
                                    {volunteers.map(vol => (
                                        <tr key={vol.id} className="hover:bg-slate-50 transition-colors text-left">
                                            <td className="p-4 font-bold text-slate-800 text-left">{vol.name}</td>
                                            <td className="p-4 text-center font-bold text-red-600">{vol.bloodType}{vol.rhesus}</td>
                                            <td className="p-4 text-center text-sm font-mono">{vol.phone}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => setEditingVolunteer(vol)} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-100 flex items-center gap-1 ml-auto"><Edit3 size={14}/> Edit Data</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'stock' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-left">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-left"><Activity size={18} className="text-[#800000]"/> Update Stok Darah PMI</h3>
                            <div className="space-y-4 text-left">
                                {pmiStock.map((row, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                                        <div className="flex-1 font-bold text-slate-600 text-sm text-left">{row.product}</div>
                                        <div className="flex gap-2 text-left">
                                            {['A', 'B', 'O', 'AB'].map(type => (
                                                <div key={type} className="flex flex-col items-center">
                                                    <span className="text-[9px] font-bold text-slate-400 mb-1">{type}</span>
                                                    <input type="number" className="w-12 p-2 text-center rounded-lg border font-bold text-xs" value={row[type]} onChange={(e) => handlePmiChange(i, type, e.target.value)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSaveStock} disabled={saveLoading} className="mt-8 w-full bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:bg-slate-300 uppercase tracking-widest text-xs transition-all shadow-md">
                                {saveLoading ? <Loader size={18} className="animate-spin" /> : <Save size={18}/>} Simpan Stok PMI
                            </button>
                        </div>
                        <div className="space-y-6 text-left">
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-left">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-left"><Calendar size={18} className="text-[#800000]"/> Manajemen Jadwal Mobil Unit</h3>
                                <form onSubmit={handleAddSchedule} className="space-y-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Tambah Jadwal Baru</h4>
                                    <input required placeholder="Lokasi (Contoh: SMAN 1 AIKMEL)" className="w-full p-3 rounded-xl border-2 text-sm outline-none focus:border-[#800000] text-left" value={newSched.location} onChange={e => setNewSched({...newSched, location: e.target.value})}/>
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <input required type="date" className="p-3 rounded-xl border-2 text-sm outline-none focus:border-[#800000] text-left" value={newSched.date} onChange={e => setNewSched({...newSched, date: e.target.value})}/>
                                        <input required placeholder="Jam (08:00 - Selesai)" className="p-3 rounded-xl border-2 text-sm outline-none focus:border-[#800000] text-left" value={newSched.time} onChange={e => setNewSched({...newSched, time: e.target.value})}/>
                                    </div>
                                    <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all text-left"><PlusCircle size={16}/> Tambah Jadwal</button>
                                </form>
                                <div className="space-y-3 text-left">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Jadwal Terdaftar</h4>
                                    {mobileUnit.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-red-100 transition-all text-left">
                                            <div className="flex items-start gap-3 text-left"><div className="p-2 bg-red-50 text-[#800000] rounded-lg text-left"><MapPin size={16}/></div><div className="text-left"><p className="font-bold text-slate-800 text-sm text-left">{item.location}</p><p className="text-[10px] text-slate-400 font-bold uppercase text-left">{item.date} • {item.time}</p></div></div>
                                            <button onClick={() => handleDeleteSchedule(item.id)} className="text-red-200 hover:text-red-500 p-2 text-left"><Trash2 size={18}/></button>
                                        </div>
                                    ))}
                                    {mobileUnit.length === 0 && <p className="text-center text-slate-400 italic text-sm py-4">Belum ada jadwal aktif.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {editingVolunteer && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Edit Data Relawan</h3>
                        <form onSubmit={handleUpdateVolunteer} className="space-y-4">
                            <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={editingVolunteer.name} onChange={e => setEditingVolunteer({...editingVolunteer, name: e.target.value})}/></div>
                            <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alamat Domisili</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={editingVolunteer.address} onChange={e => setEditingVolunteer({...editingVolunteer, address: e.target.value})}/></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Golongan</label><select className="w-full border-2 p-3 rounded-xl font-bold bg-white" value={editingVolunteer.bloodType} onChange={e => setEditingVolunteer({...editingVolunteer, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
                                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rhesus</label><select className="w-full border-2 p-3 rounded-xl font-bold bg-white" value={editingVolunteer.rhesus} onChange={e => setEditingVolunteer({...editingVolunteer, rhesus: e.target.value})}><option>+</option><option>-</option></select></div>
                            </div>
                            <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Donor Terakhir (Opsional)</label><input type="date" className="w-full border-2 p-3 rounded-xl font-bold" value={editingVolunteer.lastDonorDate} onChange={e => setEditingVolunteer({...editingVolunteer, lastDonorDate: e.target.value})}/></div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setEditingVolunteer(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold uppercase text-xs">Batal</button>
                                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase text-xs">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// 6. MAIN APP COMPONENTS (LOGIN, FOOTER, FORMS)
// ============================================================================

const Login = ({ onLogin, onBack }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const handleLogin = (e) => { e.preventDefault(); if(user === 'User' && pass === 'User') { onLogin(); } else { setErr('Username atau Password salah!'); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-left">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 text-left">
        <div className="text-center mb-8"><Shield size={48} className="text-[#2C3E50] mx-auto mb-4 text-center" /><h2 className="text-2xl font-bold text-slate-800 text-center">Admin Portal</h2><p className="text-slate-500 text-sm text-center">Gunakan kredensial pengurus PMR</p></div>
        {err && <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-4 text-xs text-center border border-red-100">{err}</div>}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Username</label><input type="text" className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" value={user} onChange={(e) => setUser(e.target.value)}/></div>
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Password</label><input type="password" className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" value={pass} onChange={(e) => setPass(e.target.value)}/></div>
          <button type="submit" className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black hover:bg-slate-900 transition-all shadow-lg mt-4 uppercase text-xs tracking-widest">Akses Dashboard</button>
        </form>
        <button onClick={onBack} className="w-full mt-6 text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 text-center"><ArrowLeft size={16}/> Kembali ke Beranda</button>
      </div>
    </div>
  );
};

const Footer = ({ setView }) => (
    <footer className="bg-slate-900 text-white py-16 text-left border-t border-white/5">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-left">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-6 text-left"><div className="h-10 w-10 bg-red-800 rounded-xl flex items-center justify-center text-white text-left"><Droplet fill="currentColor" size={20} /></div><h3 className="text-2xl font-bold tracking-tight text-left">BloodL!nk</h3></div>
          <p className="text-slate-400 text-sm leading-relaxed text-left text-left">“Bergerak Nyata, Berbagi Kehidupan.” Platform inovasi PMR SMAN 1 Aikmel dalam mengamalkan Tri Bakti PMR.</p>
        </div>
        <div className="text-left"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 text-left">Navigasi</h3><ul className="space-y-4 text-sm font-medium text-slate-300 text-left"><li><button onClick={() => setView('patient_list')} className="hover:text-red-400 transition-colors text-left">Butuh Donor</button></li><li><button onClick={() => setView('volunteer_list')} className="hover:text-red-400 transition-colors text-left">Relawan</button></li><li><button onClick={() => setView('stock')} className="hover:text-red-400 transition-colors text-left">Stok Darah</button></li></ul></div>
        <div className="text-left text-left"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 text-left text-left">Markas</h3><ul className="space-y-4 text-sm text-slate-300 text-left text-left text-left"><li className="flex items-start gap-3 text-left text-left"><MapPin size={18} className="text-red-700 shrink-0 text-left text-left"/><span>Jl. Pendidikan No.35, Aikmel, Kec. Aikmel, Kabupaten Lombok Timur, Nusa Tenggara Bar. 83653</span></li><li className="flex items-center gap-3 text-left text-left"><Phone size={18} className="text-red-700 text-left text-left"/> +62 818-0332-4919</li></ul></div>
        <div className="text-left">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 text-left">Media Sosial</h3>
          <div className="flex gap-4 text-left text-left">
            <a href="https://www.instagram.com/pmr_smanel/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all text-slate-400 hover:text-white text-left"><Instagram size={20}/></a>
            <a href="https://www.facebook.com/pmr.smanel.1" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all text-slate-400 hover:text-white text-left"><Facebook size={20}/></a>
            <a href="https://www.tiktok.com/@pmrsmanel" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-slate-800 transition-all text-slate-400 hover:text-white text-left"><Video size={20}/></a>
            <a href="https://www.youtube.com/@pmrsmanel4782" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-700 transition-all text-slate-400 hover:text-white text-left"><Youtube size={20}/></a>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">&copy; 2026 PMR SMANEL. DIBUAT UNTUK KEMANUSIAAN.</div>
    </footer>
);

// --- FORMS SUBCOMPONENTS ---
const RequestForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({ patient: '', hospital: '', bloodType: 'A', rhesus: '+', amount: '', contact: '', contact2: '' });
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-2xl mx-auto border-t-4 border-[#800000] text-left">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4 text-left">
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Nama Pasien</label><input required className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="Nama Lengkap Pasien" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} /></div>
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Rumah Sakit</label><input required className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="Contoh: RSUD Selong / Puskesmas Aikmel" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Gol Darah</label><select className="w-full border-2 rounded-2xl p-4 bg-white outline-none font-bold text-left" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Rhesus</label><select className="w-full border-2 rounded-2xl p-4 bg-white outline-none font-bold text-left" value={form.rhesus} onChange={e => setForm({...form, rhesus: e.target.value})}><option value="+">+</option><option value="-">-</option></select></div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Jumlah (Kantong)</label><input required type="number" className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="Contoh: 2" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">WhatsApp Keluarga</label><input required className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="08..." value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} /></div>
        </div>
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">No Kontak ke 2 (Opsional)</label><input className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="08..." value={form.contact2} onChange={e => setForm({...form, contact2: e.target.value})} /></div>
        <button disabled={isLoading} type="submit" className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg mt-4 disabled:bg-slate-300 transition-all text-left flex items-center justify-center">{isLoading ? 'Memproses...' : 'Kirim Permohonan'}</button>
      </form>
    </div>
  );
};

const VolunteerForm = ({ onSubmit, isLoading }) => {
  const [form, setForm] = useState({ name: '', bloodType: 'A', rhesus: '+', phone: '', address: '', lastDonorDate: '' });
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-2xl mx-auto border-t-4 border-[#800000] text-left">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4 text-left text-left">
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Nama Lengkap</label><input required className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="Nama Anda" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Alamat Domisili</label><input required className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="Alamat Lengkap" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Gol Darah</label><select className="w-full border-2 rounded-2xl p-4 bg-white outline-none font-bold text-left" value={form.bloodType} onChange={e => setForm({...form, bloodType: e.target.value})}><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
          <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Rhesus</label><select className="w-full border-2 rounded-2xl p-4 bg-white outline-none font-bold text-left" value={form.rhesus} onChange={e => setForm({...form, rhesus: e.target.value})}><option value="+">Positif (+)</option><option value="-">Negatif (-)</option></select></div>
        </div>
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">Tanggal Donor Terakhir (Opsional)</label><input type="date" className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" value={form.lastDonorDate} onChange={e => setForm({...form, lastDonorDate: e.target.value})} /></div>
        <div className="text-left"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2 text-left">WhatsApp Aktif</label><input required className="w-full border-2 rounded-2xl p-4 outline-none focus:border-[#800000] font-bold text-left" placeholder="08..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
        <button disabled={isLoading} type="submit" className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg mt-4 disabled:bg-slate-300 transition-all text-left flex items-center justify-center">{isLoading ? 'Memproses...' : 'Daftar Relawan'}</button>
      </form>
    </div>
  );
};

const Education = ({ articles }) => {
    const [sel, setSel] = useState(null);
    return (
        <section className="py-20 bg-white min-h-screen text-left">
            <div className="container mx-auto px-4 text-left">
                <div className="text-center mb-16 text-left"><h2 className="text-3xl font-black uppercase mb-2 text-center">Pojok Edukasi</h2><p className="text-slate-500 text-center">Pelajari donor darah lebih dalam.</p></div>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {articles.map(art => (
                        <div key={art.id} className="bg-slate-50 rounded-[2.5rem] overflow-hidden group cursor-pointer text-left" onClick={() => setSel(art)}>
                            <div className="h-52 overflow-hidden text-left"><img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 text-left" alt={art.title}/></div>
                            <div className="p-8 text-left">
                                <h3 className="font-bold text-lg mb-2 text-left">{art.title}</h3>
                                <p className="text-xs text-slate-500 mb-6 text-left">{art.excerpt}</p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-red-700 flex items-center gap-2 text-left">Baca Sekarang <ChevronRight size={14}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {sel && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md text-left">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto relative p-10 text-left">
                        <button onClick={() => setSel(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-left"><X size={20}/></button>
                        <h2 className="text-2xl font-black mb-6 uppercase text-left">{sel.title}</h2>
                        <ul className="space-y-4 text-left">
                            {sel.content.map((c, i) => <li key={i} className="flex gap-4 text-left text-left"><div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 text-left">{i+1}</div>{c}</li>)}
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
};

// ============================================================================
// 7. MAIN APP COMPONENT
// ============================================================================

const App = () => {
  const [view, setView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState(null);

  const [bloodStock, setBloodStock] = useState(FALLBACK_DATA.bloodStock);
  const [pmiStock, setPmiStock] = useState(FALLBACK_DATA.pmiStock);
  const [volunteers, setVolunteers] = useState(FALLBACK_DATA.volunteers);
  const [requests, setRequests] = useState(FALLBACK_DATA.requests);
  const [mobileUnit, setMobileUnit] = useState(FALLBACK_DATA.mobileUnit);

  const showToast = (message, type = 'info') => setToast({ message, type });

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const ts = Date.now();
      const [vRes, rRes, mRes, pRes] = await Promise.all([
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=volunteers&t=${ts}`),
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=requests&t=${ts}`),
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=mobileUnit&t=${ts}`),
        fetch(`${APPS_SCRIPT_URL}?action=read&sheet=pmiStock&t=${ts}`)
      ]);
      const vData = await vRes.json();
      const rData = await rRes.json();
      const mData = await mRes.json();
      const pData = await pRes.json();

      if(vData.status === 'success') {
          setVolunteers(vData.data);
          const stock = { A: { positive: 0, negative: 0 }, B: { positive: 0, negative: 0 }, AB: { positive: 0, negative: 0 }, O: { positive: 0, negative: 0 }};
          vData.data.forEach(v => {
              if(v.status === 'Aktif' && stock[v.bloodType]) {
                  const key = String(v.rhesus).includes('+') ? 'positive' : 'negative';
                  stock[v.bloodType][key]++;
              }
          });
          setBloodStock(stock);
      }
      if(rData.status === 'success') setRequests(rData.data);
      
      if(mData.status === 'success') {
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          setMobileUnit(mData.data.filter(item => !item.date || new Date(item.date) >= today));
      }
      if(pData.status === 'success') setPmiStock(pData.data.sort((a,b) => a.id - b.id));
    } catch (e) { console.error(e); } finally { setLoadingData(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRequestSubmit = async (formData) => {
    setLoadingData(true);
    const sanitized = { 
      ...formData, 
      contact: cleanPhoneNumber(formData.contact),
      contact2: cleanPhoneNumber(formData.contact2)
    };
    const item = { id: Date.now(), ...sanitized, status: 'Mencari' };
    setRequests([...requests, item]);
    setView('patient_list');
    await sendDataToSheet('requests', item);
    showToast("Permohonan berhasil dikirim!", "success");
    setLoadingData(false);
  };

  const handleVolunteerSubmit = async (formData) => {
    setLoadingData(true);
    const sanitized = { ...formData, phone: cleanPhoneNumber(formData.phone) };
    const item = { id: Date.now(), ...sanitized, status: 'Aktif' };
    setVolunteers([...volunteers, item]);
    setView('home');
    await sendDataToSheet('volunteers', item);
    showToast("Pendaftaran Relawan Berhasil!", "success");
    setLoadingData(false);
  };

  if(view === 'login') return <Login onLogin={() => { setIsLoggedIn(true); setView('admin'); }} onBack={() => setView('home')} />;
  if(view === 'admin' && isLoggedIn) return <AdminPanel volunteers={volunteers} setVolunteers={setVolunteers} requests={requests} setRequests={setRequests} pmiStock={pmiStock} setPmiStock={setPmiStock} mobileUnit={mobileUnit} setMobileUnit={setMobileUnit} onLogout={() => { setIsLoggedIn(false); setView('home'); }} showToast={showToast} />;

  return (
    <div className="font-sans antialiased text-slate-900 bg-white text-left">
      <Navbar setView={setView} view={view} isLoggedIn={isLoggedIn} />
      {loadingData && <div className="fixed top-20 left-0 w-full bg-yellow-50 text-yellow-700 py-1.5 text-[10px] font-bold uppercase z-40 border-b flex items-center justify-center gap-2"><Loader size={12} className="animate-spin"/> Sinkronisasi Database...</div>}
      {view === 'home' && (
        <div className="animate-fadeIn text-left">
          <Hero setView={setView} />
          <StockDashboard bloodStock={bloodStock} pmiStock={pmiStock} mobileUnit={mobileUnit} />
          <section className="py-24 bg-gray-50 text-center border-t border-gray-200 text-left">
             <h2 className="text-3xl font-black text-gray-800 mb-12 uppercase text-center">Fitur Layanan</h2>
             <div className="flex justify-center gap-8 flex-wrap px-4 text-left">
                <button onClick={() => setView('patient_list')} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all w-80 border border-gray-100 text-center group text-left">
                   <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:scale-110 text-center"><Activity size={32} /></div>
                   <h3 className="font-bold text-xl text-gray-800 mb-4 uppercase text-center">Pasien Butuh Darah</h3>
                   <p className="text-sm text-slate-500 leading-relaxed text-center">Lihat daftar pasien yang mendesak membutuhkan bantuan donor darah sesegera mungkin.</p>
                </button>
                <button onClick={() => setView('volunteer_list')} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all w-80 border border-gray-100 text-center group text-left">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110 text-center"><Users size={28} /></div>
                   <h3 className="font-bold text-lg text-gray-800 mb-3 uppercase text-center text-center">Data Relawan</h3>
                   <p className="text-sm text-slate-500 leading-relaxed text-center">Pahlawan kemanusiaan SMANEL yang siap sedia berbagi kehidupan melalui donor darah.</p>
                </button>
             </div>
          </section>
          <AboutStats volunteers={volunteers} requests={requests} />
        </div>
      )}
      {view === 'patient_list' && <PatientList requests={requests} setView={setView} showToast={showToast} />}
      {view === 'volunteer_list' && <VolunteerList volunteers={volunteers} setView={setView} />}
      {view === 'stock' && <StockDashboard bloodStock={bloodStock} pmiStock={pmiStock} mobileUnit={mobileUnit} />}
      {view === 'search' && <div className="py-20 bg-slate-50 min-h-screen text-center text-left"><div className="container mx-auto px-4 text-left"><h1 className="text-3xl font-black mb-12 uppercase text-center">Pasien Butuh Darah</h1><RequestForm onSubmit={handleRequestSubmit} isLoading={loadingData} /></div></div>}
      {view === 'register' && <div className="py-20 bg-slate-50 min-h-screen text-center text-left"><div className="container mx-auto px-4 text-left"><h1 className="text-3xl font-black mb-12 uppercase text-center text-left">Daftar Sebagai Relawan</h1><VolunteerForm onSubmit={handleVolunteerSubmit} isLoading={loadingData} /></div></div>}
      {view === 'education' && <Education articles={ARTICLES} />}
      <Footer setView={setView} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;