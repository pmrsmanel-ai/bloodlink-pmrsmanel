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

// PERLU DIINSTALL: npm install html2canvas
import html2canvas from 'html2canvas';

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
          <h3 className="text-xl font-black text-[#2C3E50] mb-2">{title}</h3>
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

// --- KOMPONEN POSTER INSTAGRAM (UPDATED) ---
const IGPosterModal = ({ patient, onClose }) => {
  const posterRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!patient) return null;

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);

    try {
      // Tunggu render gambar (jika ada)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // Kualitas HD Tinggi
        useCORS: true, 
        backgroundColor: null 
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `BloodLink-Poster-${patient.patient.replace(/\s+/g, '-')}.png`;
      link.click();
    } catch (error) {
      console.error("Gagal download poster:", error);
      alert("Gagal membuat poster. Pastikan koneksi internet stabil.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    // Z-Index sangat tinggi agar tidak tertutup header
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-sm flex flex-col items-center my-auto">
        
        {/* Tombol Tutup */}
        <button 
          onClick={onClose} 
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full mb-6 flex items-center gap-2 font-bold backdrop-blur-sm transition-all"
        >
          <X size={20} /> Tutup
        </button>

        {/* AREA POSTER (FIXED WIDTH UNTUK HASIL KONSTAN) */}
        <div ref={posterRef} className="w-[360px] bg-gradient-to-br from-red-600 to-red-900 p-6 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden border-[8px] border-white box-border">
          {/* Dekorasi Background - Posisi Absolut Statis agar tidak bergeser */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Header Poster */}
          <div className="relative z-10 flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white text-red-600 p-2.5 rounded-2xl shadow-lg">
                <Droplet size={24} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-black text-xl leading-none tracking-tight">URGENT</h3>
                <p className="text-[10px] opacity-90 font-bold uppercase tracking-[0.2em] mt-1">Butuh Donor Darah</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
              PMR SMANEL
            </div>
          </div>

          {/* Konten Utama */}
          <div className="relative z-10 bg-white text-[#2C3E50] rounded-[2rem] p-6 shadow-2xl mb-6">
            <div className="text-center mb-6 border-b border-gray-100 pb-6">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Golongan Darah</p>
              
              {/* Flex container dengan margin bottom untuk mencegah overlap */}
              <div className="flex items-center justify-center gap-1 mb-5"> 
                <span className="text-8xl font-black text-red-600 tracking-tighter leading-[0.8]">{patient.bloodType}</span>
                <span className="text-4xl font-black text-gray-300 mt-4 leading-none">{safeText(patient.rhesus)}</span>
              </div>
              
              <div className="inline-block bg-red-50 text-red-600 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest border border-red-100">
                Butuh {patient.amount} Kantong
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-2.5 rounded-full text-red-500"><User size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Pasien</p>
                  <p className="font-bold text-lg leading-tight text-gray-800">{patient.patient}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{patient.age ? `${patient.age} Tahun` : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-2.5 rounded-full text-red-500"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Lokasi / RS</p>
                  <p className="font-bold text-lg leading-tight text-gray-800">{patient.hospital}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-50 p-2.5 rounded-full text-red-500"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Hubungi Keluarga</p>
                  <p className="font-bold text-xl leading-tight text-gray-800">{patient.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Poster */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <p className="text-xs font-bold text-white/90 mb-4 italic">"Setetes darah Anda, nyawa bagi sesama."</p>
            
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2 px-4 inline-flex items-center gap-2 border border-white/10">
                  <Instagram size={16} />
                  <span className="text-[10px] font-black tracking-wide">@pmr_smanel</span>
                </div>
            </div>

            {/* Link Website */}
             <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 px-4 inline-flex items-center gap-2 border border-white/20 w-full justify-center">
                <Globe size={14} className="text-white" />
                <p className="text-[10px] font-bold tracking-[0.1em] text-white">bloodlink.pmrsmanel.my.id</p>
            </div>
          </div>
        </div>

        {/* Tombol Download */}
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="mt-8 w-full py-4 bg-white text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <><Loader size={18} className="animate-spin" /> Memproses...</>
          ) : (
            <><Download size={18} /> Simpan Poster</>
          )}
        </button>
        <p className="text-white/60 text-[10px] mt-3 font-medium text-center">
          Gambar akan tersimpan otomatis (HD).
        </p>
      </div>
    </div>
  );
};

// --- DATA FALLBACK ---