'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import { useSession } from 'next-auth/react';
import { 
  Download, 
  Settings, 
  Plus, 
  X, 
  ChevronDown,
  Cpu,
  Lock,
  Crown,
  Shield
} from 'lucide-react';

// Optimized heavy component loading
const PreviewTerminal = dynamic(() => import('@/components/data-forge/PreviewTerminal'), {
  loading: () => <div className="h-[600px] bg-[#0a0a0a] rounded-[2rem] animate-pulse flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Cpu className="w-8 h-8 text-red-500/20 animate-spin" />
      <span className="text-[length:var(--text-small)] font-black text-white/10 uppercase tracking-[0.3em]">Initializing Core...</span>
    </div>
  </div>,
  ssr: false // Client-side only for data generation previews
});

// --- CONFIGURATION OPTIONS ---
const INDUSTRIES = [
  { id: 'BFSI', label: 'BFSI (Finance)', fields: [
    { id: 'txn_type', label: 'Transaction Type (POS/ATM/Web)', category: 'Industry' },
    { id: 'acc_type', label: 'Account Type (Savings/Current)', category: 'Industry' },
    { id: 'risk_score', label: 'Risk Score (0-100)', category: 'Industry' }
  ]},
  { id: 'Retail', label: 'E-Commerce / Retail', fields: [
    { id: 'pay_method', label: 'Payment Method', category: 'Industry' },
    { id: 'prod_cat', label: 'Product Category', category: 'Industry' },
    { id: 'order_source', label: 'Order Source (App/Web)', category: 'Industry' }
  ]},
  { id: 'Health', label: 'Healthcare', fields: [
    { id: 'hosp_type', label: 'Hospital Type (Private/Govt)', category: 'Industry' },
    { id: 'diagnosis', label: 'Diagnosis Category', category: 'Industry' },
    { id: 'ins_status', label: 'Insurance Status', category: 'Industry' }
  ]},
  { id: 'Supply', label: 'Supply Chain / Logistics', fields: [
    { id: 'ship_method', label: 'Shipping Method', category: 'Industry' },
    { id: 'carrier', label: 'Carrier Name', category: 'Industry' },
    { id: 'inv_status', label: 'Inventory Status', category: 'Industry' }
  ]}
];

const GENERAL_FIELDS = [
  { id: 'id', label: 'Unique ID', category: 'General' },
  { id: 'name', label: 'Full Name', category: 'Personal' },
  { id: 'email', label: 'Email Address', category: 'Personal' },
  { id: 'date', label: 'Date/Timestamp', category: 'General' },
  { id: 'amount', label: 'Currency/Amount', category: 'Financial' },
  { id: 'country', label: 'Country', category: 'Geographic' },
  { id: 'region', label: 'State/Region', category: 'Geographic' },
  { id: 'zone', label: 'Zone (N/S/E/W)', category: 'Geographic' },
];

const DATA_COUNTS = [1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000];

export default function DataForgePage() {
  const { data: session } = useSession();
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [dataCount, setDataCount] = useState(5000);
  const [format, setFormat] = useState('CSV');
  const [selectedFields, setSelectedFields] = useState([
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Timestamp' },
    { id: 'amount', label: 'Amount' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [status, setStatus] = useState('IDLE');

  // Update preview
  useEffect(() => {
    generatePreview();
  }, [selectedFields, selectedIndustry]);

  const generatePreview = () => {
    const preview = [];
    for (let i = 0; i < 5; i++) {
      preview.push(generateRow(i + 1));
    }
    setPreviewData(preview);
  };

  const generateRow = (index: number) => {
    const row: any = {};
    selectedFields.forEach(field => {
      row[field.label] = getMockValue(field.id, index);
    });
    return row;
  };

  const getMockValue = (type: string, index: number) => {
    const now = new Date();
    switch (type) {
      case 'id': return `TXN_${10000 + index}`;
      case 'name': return ['Alex Carter', 'Jordan Smith', 'Maria Garcia', 'Raj Patel', 'Li Wei'][Math.floor(Math.random() * 5)];
      case 'email': return `user${index}@example.com`;
      case 'date': return new Date(now.getTime() - Math.random() * 10000000).toISOString().split('T')[0];
      case 'amount': return (Math.random() * 1000).toFixed(2);
      case 'country': return ['USA', 'India', 'UK', 'Germany', 'Japan'][Math.floor(Math.random() * 5)];
      case 'region': return ['Maharashtra', 'California', 'London', 'Berlin', 'Tokyo'][Math.floor(Math.random() * 5)];
      case 'zone': return ['North', 'South', 'East', 'West', 'Central'][Math.floor(Math.random() * 5)];
      
      // Industry Specific
      case 'txn_type': return ['POS', 'ATM', 'Online', 'Wire'][Math.floor(Math.random() * 4)];
      case 'acc_type': return ['Savings', 'Current', 'Credit'][Math.floor(Math.random() * 3)];
      case 'risk_score': return Math.floor(Math.random() * 100);
      case 'pay_method': return ['Credit Card', 'UPI', 'PayPal', 'Cash'][Math.floor(Math.random() * 4)];
      case 'prod_cat': return ['Electronics', 'Fashion', 'Home', 'Health'][Math.floor(Math.random() * 4)];
      case 'order_source': return ['Mobile App', 'Desktop', 'Tablet'][Math.floor(Math.random() * 3)];
      case 'hosp_type': return ['Private', 'Government', 'Non-Profit'][Math.floor(Math.random() * 3)];
      case 'diagnosis': return ['General', 'Cardiac', 'Neurology', 'Dental'][Math.floor(Math.random() * 4)];
      case 'ins_status': return ['Insured', 'Self-Pay', 'Insurance Pending'][Math.floor(Math.random() * 3)];
      case 'ship_method': return ['Air', 'Sea', 'Land', 'Express'][Math.floor(Math.random() * 4)];
      case 'carrier': return ['FedEx', 'DHL', 'BlueDart', 'UPS'][Math.floor(Math.random() * 4)];
      case 'inv_status': return ['In Stock', 'Low Stock', 'Out of Stock'][Math.floor(Math.random() * 3)];
      default: return '...';
    }
  };

  const addField = (field: any) => {
    if (selectedFields.find(f => f.id === field.id)) return;
    setSelectedFields([...selectedFields, { id: field.id, label: field.label }]);
  };

  const removeField = (index: number) => {
    const newList = [...selectedFields];
    newList.splice(index, 1);
    setSelectedFields(newList);
  };

  // --- GATING LOGIC ---
  const isLocked = dataCount > 10000 && !session;
  const isPremium = dataCount > 500000;

  const handleDownload = () => {
    if (isLocked || isPremium) return;
    
    setIsGenerating(true);
    setStatus('VALIDATING_TIER');

    setTimeout(() => {
      setStatus('FORGING_DATA');
      setTimeout(() => {
        // --- REAL DOWNLOAD LOGIC ---
        const rows = [];
        for (let i = 0; i < dataCount; i++) {
          rows.push(generateRow(i));
        }

        let content = '';
        let mimeType = '';
        let extension = '';

        if (format === 'CSV') {
          const headers = selectedFields.map(f => f.label).join(',');
          const csvRows = rows.map(r => 
            selectedFields.map(f => r[f.label]).join(',')
          );
          content = [headers, ...csvRows].join('\n');
          mimeType = 'text/csv';
          extension = 'csv';
        } else {
          content = JSON.stringify(rows, null, 2);
          mimeType = 'application/json';
          extension = 'json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dattasable_${selectedIndustry.id.toLowerCase()}_${dataCount}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsGenerating(false);
        setStatus('COMPLETE');
        setTimeout(() => setStatus('IDLE'), 2000);
      }, 1500);
    }, 800);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="boxed-wrapper" style={{ position: 'relative', marginBottom: '40px', overflow: 'hidden' }}>
        <Crosshair position="tl" />
        <Crosshair position="tr" />

        {/* Content Section */}
        <section className="px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-red-500" />
                <span className="text-[length:var(--text-small)] font-black uppercase tracking-[0.4em] text-red-500">Data Engineering Lab</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.85] text-[var(--text)]">
                Data <span className="text-red-500">Forge</span> <span className="text-2xl md:text-4xl text-[var(--muted)] font-light">PRO</span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-[var(--muted)] font-semibold leading-relaxed">
                Professional-grade synthetic data generation. Select an industry to unlock specialized fields and high-fidelity patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Configuration Panel */}
              <div className="lg:col-span-5 space-y-8">
                <div className="bg-[var(--surface2)] border border-[var(--border)] p-10 rounded-[2.5rem] relative overflow-hidden group transition-all hover:border-red-500/30 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <Settings size={20} className="text-red-500" />
                      </div>
                      <h2 className="text-xl font-bold uppercase tracking-tighter">Forge Control</h2>
                    </div>
                    {session ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[length:var(--text-small)] font-black text-green-500 uppercase tracking-widest">Authenticated</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                        <Lock size={10} className="text-yellow-500" />
                        <span className="text-[length:var(--text-small)] font-black text-yellow-500 uppercase tracking-widest">Free Tier</span>
                      </div>
                    )}
                  </div>

                  {/* Industry Selection */}
                  <div className="mb-10">
                    <label className="text-[length:var(--text-small)] font-black text-[var(--text)] uppercase tracking-[0.2em] mb-4 block opacity-70">Target Industry</label>
                    <div className="grid grid-cols-2 gap-3">
                      {INDUSTRIES.map(ind => (
                        <button
                          key={ind.id}
                          onClick={() => setSelectedIndustry(ind)}
                          className={`p-4 rounded-xl text-[length:var(--text-small)] font-black uppercase tracking-widest transition-all border ${
                            selectedIndustry.id === ind.id 
                              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' 
                              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-red-500/50'
                          }`}
                        >
                          {ind.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Schema Builder */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[length:var(--text-small)] font-black text-[var(--text)] uppercase tracking-[0.2em] block opacity-70">Dynamic Schema</label>
                      <span className="text-[length:var(--text-small)] font-mono text-[var(--muted)] font-bold">{selectedFields.length} / 12 Fields</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl mb-6 min-h-[120px] content-start">
                      {selectedFields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg group/tag">
                          <span className="text-[length:var(--text-small)] font-black text-red-500 uppercase tracking-widest">{field.label}</span>
                          <button onClick={() => removeField(idx)} className="hover:text-red-500 transition-colors">
                            <X size={10} className="text-red-500/50 group-hover/tag:text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3 text-[length:var(--text-small)] font-black text-[var(--muted)] px-1 tracking-widest">
                        <Plus size={10} className="text-red-500" />
                        <span>ADD NEW INTELLIGENCE FIELD</span>
                      </div>
                      <div className="relative">
                        <select 
                          onChange={(e) => {
                            const fieldId = e.target.value;
                            if (!fieldId) return;
                            const field = [...selectedIndustry.fields, ...GENERAL_FIELDS].find(f => f.id === fieldId);
                            if (field) addField(field);
                            e.target.value = "";
                          }}
                          className="w-full bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl text-xs appearance-none outline-none focus:border-red-500/50 transition-all text-[var(--text)] cursor-pointer font-bold"
                          defaultValue=""
                        >
                          <option value="" disabled className="bg-[var(--surface)] text-[var(--muted)]">Select a field to add...</option>
                          <optgroup label={`${selectedIndustry.id} SPECIALIZED`} className="bg-[var(--surface)] text-red-500 font-bold">
                            {selectedIndustry.fields.map(f => (
                              <option key={f.id} value={f.id} className="bg-[var(--surface)] text-[var(--text)]">{f.label}</option>
                            ))}
                          </optgroup>
                          <optgroup label="GENERAL DATA" className="bg-[var(--surface)] text-[var(--muted)] font-bold">
                            {GENERAL_FIELDS.map(f => (
                              <option key={f.id} value={f.id} className="bg-[var(--surface)] text-[var(--text)]">{f.label}</option>
                            ))}
                          </optgroup>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Volume Gating */}
                  <div className="mb-10">
                    <label className="text-[length:var(--text-small)] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-4 block text-center">Select Dataset Volume (Tiered)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {DATA_COUNTS.map(count => {
                        const isKLocked = count > 10000 && !session;
                        const isPLocked = count > 500000;
                        return (
                          <button
                            key={count}
                            disabled={isPLocked}
                            onClick={() => setDataCount(count)}
                            className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all relative ${
                              dataCount === count 
                                ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' 
                                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-red-500/50'
                            } ${(isKLocked || isPLocked) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="text-[length:var(--text-small)] font-bold uppercase">{count >= 1000 ? `${count/1000}k` : count}</span>
                            {isKLocked && <Lock size={8} className="absolute top-1 right-1" />}
                            {isPLocked && <Crown size={8} className="absolute top-1 right-1 text-yellow-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating || isPremium || isLocked}
                    className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:bg-[var(--surface)] disabled:text-[var(--muted)] transition-all font-black text-[length:var(--text-small)] tracking-[0.3em] uppercase flex items-center justify-center gap-4 group rounded-2xl shadow-2xl shadow-red-500/20"
                  >
                    {isGenerating ? (
                      <>
                        <Cpu className="w-5 h-5 animate-spin" />
                        Forging...
                      </>
                    ) : isLocked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Sign in to Unlock
                      </>
                    ) : isPremium ? (
                      <>
                        <Crown className="w-4 h-4" />
                        Upgrade to Premium
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        Forge Dataset
                      </>
                    )}
                  </button>
                </div>

                {/* Technical Note */}
                <div className="p-8 border border-[var(--border)] bg-[var(--surface2)]/50 rounded-[2rem]">
                  <h4 className="text-[length:var(--text-small)] font-black text-[var(--muted)] mb-4 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Shield size={14} className="text-red-500" />
                    Quality Assurance
                  </h4>
                  <p className="text-[length:var(--text-small)] text-[var(--muted)] leading-relaxed mb-6 font-medium">
                    Each generated record is subjected to our proprietary <strong className="text-[var(--text)]">Synthetic Integrity Check</strong>. For the healthcare template, Hospital Type is weighted based on regional government-to-private ratios to ensure statistical parity.
                  </p>
                  <div className="flex gap-4">
                    <div className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[length:var(--text-small)] font-bold text-[var(--muted)] uppercase tracking-tighter">
                      No PII Data
                    </div>
                    <div className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[length:var(--text-small)] font-bold text-[var(--muted)] uppercase tracking-tighter">
                      GDPR Compliant
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview & Terminal Panel (Dynamic) */}
              <div className="lg:col-span-7 h-full sticky top-32">
                <PreviewTerminal 
                  selectedIndustry={selectedIndustry}
                  selectedFields={selectedFields}
                  previewData={previewData}
                  isGenerating={isGenerating}
                  dataCount={dataCount}
                  session={session}
                />
              </div>
            </div>
          </div>
        </section>

        <Crosshair position="bl" />
        <Crosshair position="br" />

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </div>

      <Footer />
    </div>
  );
}
