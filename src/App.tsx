import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  MessageSquareMore, 
  FileText, 
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  BrainCircuit,
  Search,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BPKFinding, ChecklistItem, RDPState } from './types';
import { generateRDPQuestions } from './services/gemini';

// Mock Data
const INITIAL_FINDINGS: BPKFinding[] = [
  {
    id: '1',
    code: '2025-LHP-01',
    title: 'Ketidaksinkronan Data Penerima',
    description: 'Terdapat perbedaan data antara Dinas Sosial dan Dinas Pendidikan terkait 150 mahasiswa penerima bantuan.',
    amount: 1500000000,
    status: 'critical',
    recommendation: 'Sinkronisasi data menggunakan NIK dan verifikasi faktual lapangan.'
  },
  {
    id: '2',
    code: '2025-LHP-02',
    title: 'Keterlambatan Penyaluran Semester Ganjil',
    description: 'Dana bantuan semester ganjil 2025 baru disalurkan pada bulan Desember.',
    amount: 5000000000,
    status: 'pending',
    recommendation: 'Evaluasi SOP pengajuan dan percepatan verifikasi berkas.'
  },
  {
    id: '3',
    code: '2025-LHP-03',
    title: 'Laporan Pertanggungjawaban Tidak Lengkap',
    description: 'Ditemukan 45 dokumen pertanggungjawaban yang belum melampirkan bukti IPK.',
    status: 'addressed',
    recommendation: 'Pengetatan syarat pencairan tahap berikutnya.'
  }
];

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', task: 'Review LHP BPK Semester II 2025', completed: true, category: 'Document' },
  { id: 'c2', task: 'Minta Data Realisasi Anggaran dari BPKAD', completed: false, category: 'Data' },
  { id: 'c3', task: 'Koordinasi dengan Tenaga Ahli Komisi', completed: true, category: 'Strategy' },
  { id: 'c4', task: 'Draft Daftar Pertanyaan RDP', completed: false, category: 'Strategy' },
  { id: 'c5', task: 'Verifikasi Sampling Penerima Bantuan', completed: false, category: 'Data' },
];

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Temuan BPK', path: '/findings', icon: FileText },
    { name: 'Checklist Kesiapan', path: '/checklist', icon: ClipboardCheck },
    { name: 'AI Assistant RDP', path: '/ai-assistant', icon: BrainCircuit },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 lg:translate-x-0"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">KOMISI I DPRD</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">Alaudin</p>
              <p className="text-xs text-slate-500 truncate">Anggota DPRD</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-bottom border-slate-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="search" 
            placeholder="Cari data atau temuan..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}

function StatCard({ title, value, label, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">{value}</h3>
          <p className="text-xs text-slate-400 mt-1">{label}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({ findings, checklist }: RDPState) {
  const criticalCount = findings.filter(f => f.status === 'critical').length;
  const progress = Math.round((checklist.filter(c => c.completed).length / checklist.length) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Utama</h1>
        <p className="text-slate-500">Persiapan RDP Masalah Bantuan Mahasiswa 2025-2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Temuan BPK" 
          value={findings.length} 
          label="LHP Semester II 2025" 
          icon={FileText} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Temuan Kritis" 
          value={criticalCount} 
          label="Memerlukan Perhatian Segera" 
          icon={AlertCircle} 
          color="bg-rose-500"
        />
        <StatCard 
          title="Progress Kesiapan" 
          value={`${progress}%`} 
          label={`${checklist.filter(c => c.completed).length} dari ${checklist.length} Tugas`} 
          icon={CheckCircle2} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Total Anggaran Temuan" 
          value="Rp 6.5 M" 
          label="Potensi Ketidaksesuaian" 
          icon={TrendingUp} 
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Ringkasan Temuan BPK</h2>
              <Link to="/findings" className="text-sm text-indigo-600 font-medium hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Temuan</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings.slice(0, 3).map((finding) => (
                    <tr key={finding.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 text-sm">{finding.title}</p>
                        <p className="text-xs text-slate-500">{finding.code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          finding.status === 'critical' ? 'bg-red-100 text-red-700' :
                          finding.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {finding.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <BrainCircuit className="absolute -right-8 -top-8 w-32 h-32 opacity-10" />
            <h3 className="font-bold text-lg mb-2 relative z-10 text-white">AI Asisten RDP</h3>
            <p className="text-indigo-100 text-sm mb-6 relative z-10">Gunakan AI untuk menganalisis data temuan dan membuat strategi pertanyaan rapat.</p>
            <Link to="/ai-assistant" className="inline-flex items-center gap-2 bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors relative z-10">
              Analisis Sekarang <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Urgent Checklist</h2>
            <div className="space-y-3">
              {checklist.filter(c => !c.completed).slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="mt-0.5 min-w-[20px]">
                    <div className="w-4 h-4 border-2 border-indigo-500 rounded" />
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{item.task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FindingsPage({ findings }: { findings: BPKFinding[] }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daftar Temuan BPK</h1>
          <p className="text-slate-500">Evaluasi Bantuan Mahasiswa 2025-2026</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          Tambah Catatan Temuan
        </button>
      </div>

      <div className="space-y-4">
        {findings.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
            <div className={`p-4 rounded-2xl self-start ${
              f.status === 'critical' ? 'bg-red-50 text-red-600' :
              f.status === 'pending' ? 'bg-amber-50 text-amber-600' :
              'bg-emerald-50 text-emerald-600'
            }`}>
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  f.status === 'critical' ? 'bg-red-100 text-red-700' :
                  f.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {f.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{f.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rekomendasi BPK</p>
                  <p className="text-sm font-medium text-slate-800">{f.recommendation}</p>
                </div>
                {f.amount && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nilai Potensi Temuan</p>
                    <p className="text-sm font-bold text-indigo-700">Rp {f.amount.toLocaleString('id-ID')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssistantPage({ findings }: { findings: BPKFinding[] }) {
  const [selectedFinding, setSelectedFinding] = useState<string>('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedFinding) return;
    setLoading(true);
    const findingObj = findings.find(f => f.id === selectedFinding);
    const text = await generateRDPQuestions(findingObj?.title || '', context);
    setResult(text);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-indigo-100 rounded-2xl mb-2">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Strategis RDP</h1>
        <p className="text-slate-500">Analisis temuan dan siapkan daftar pertanyaan kritis untuk Pemerintah Daerah.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">1. Pilih Temuan BPK</label>
          <select 
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none"
            value={selectedFinding}
            onChange={(e) => setSelectedFinding(e.target.value)}
          >
            <option value="">Pilih temuan untuk dianalisis...</option>
            {findings.map(f => (
              <option key={f.id} value={f.id}>{f.code} - {f.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">2. Konteks Tambahan (Opsional)</label>
          <textarea 
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 resize-none outline-none h-32"
            placeholder="Misal: Info dari lapangan tentang modus operandi, atau riwayat dinas terkait..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !selectedFinding}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Mulai Analisis Strategis <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-900 rounded-3xl p-8 text-white space-y-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 pb-6 border-b border-indigo-800">
              <MessageSquareMore className="w-6 h-6 text-indigo-300" />
              <h2 className="text-xl font-bold">Rekomendasi Pertanyaan RDP</h2>
            </div>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-indigo-50">
              {result}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChecklistPage({ checklist, setChecklist }: { checklist: ChecklistItem[], setChecklist: any }) {
  const toggleItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const categories: ('Document' | 'Data' | 'Strategy')[] = ['Document', 'Data', 'Strategy'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Checklist Kesiapan</h1>
        <p className="text-slate-500">Pantau persiapan teknis untuk RDP yang efektif.</p>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{cat}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklist.filter(i => i.category === cat).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    item.completed 
                      ? 'bg-emerald-50 border-emerald-100 opacity-80' 
                      : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md shadow-sm'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                    item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${item.completed ? 'text-emerald-800 line-through' : 'text-slate-700'}`}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [findings] = useState<BPKFinding[]>(INITIAL_FINDINGS);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8F9FA] flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardOverview findings={findings} checklist={checklist} />} />
              <Route path="/findings" element={<FindingsPage findings={findings} />} />
              <Route path="/checklist" element={<ChecklistPage checklist={checklist} setChecklist={setChecklist} />} />
              <Route path="/ai-assistant" element={<AssistantPage findings={findings} />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
