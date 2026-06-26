'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign, AlertCircle, ArrowRight, Share2, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BiRoiCalculator() {
  const [inputs, setInputs] = useState({
    teamSize: 5,
    avgSalary: 80000,
    manualHoursPerWeek: 15,
    errorRate: 5, // %
    automationPotential: 80, // %
  });

  const [results, setResults] = useState({
    annualCostManual: 0,
    potentialSavings: 0,
    hoursReclaimed: 0,
    roi: 0
  });

  useEffect(() => {
    const hourlyRate = inputs.avgSalary / 2080; // 52 weeks * 40 hours
    const weeklyCost = inputs.teamSize * inputs.manualHoursPerWeek * hourlyRate;
    const annualCost = weeklyCost * 52;
    
    // Add cost of errors (estimated as 20% of the manual cost impact)
    const errorImpact = annualCost * (inputs.errorRate / 100) * 1.5;
    const totalManualImpact = annualCost + errorImpact;
    
    const savings = totalManualImpact * (inputs.automationPotential / 100);
    const hoursSaved = (inputs.manualHoursPerWeek * inputs.teamSize * 52) * (inputs.automationPotential / 100);
    
    setResults({
      annualCostManual: totalManualImpact,
      potentialSavings: savings,
      hoursReclaimed: hoursSaved,
      roi: (savings / (annualCost * 0.1)) * 100 // Simplified ROI based on 10% implementation cost
    });
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('ROI Calculator link copied to clipboard! You can now share your results.');
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar />
      
      <main className="boxed-wrapper">
        <div className="container pt-16 pb-12">
          {/* Header */}
          <div className="mb-0">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="text-[var(--accent)]" size={24} />
              <span className="label-tech">LINKABLE_ASSET // ANALYTICS_ROI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 uppercase">
              BI Automation <span className="hero-title">ROI Calculator</span>
            </h1>
            <p className="text-[var(--muted)] text-lg max-w-2xl leading-relaxed">
              Calculate the true financial impact of manual data processing and the potential savings through Business Intelligence automation.
            </p>
          </div>
        </div>

        {/* Full Bleed Technical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-y border-[var(--border)]">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8 bg-[var(--surface)] p-12 border-r border-[var(--border)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent)]" />
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Team Size (Analysts)</label>
                <input 
                  type="range" name="teamSize" min="1" max="100" value={inputs.teamSize} onChange={handleInputChange}
                  className="w-full accent-[var(--accent)] bg-[var(--surface2)]"
                />
                <div className="flex justify-between mt-2 mono text-[12px]">
                  <span>1</span>
                  <span className="text-[var(--accent)] font-bold">{inputs.teamSize}</span>
                  <span>100</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Average Annual Salary ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">$</span>
                  <input 
                    type="number" name="avgSalary" value={inputs.avgSalary} onChange={handleInputChange}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] py-3 pl-10 pr-4 mono focus:border-[var(--accent)] outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Manual Reporting Hours / Week (Per Person)</label>
                <input 
                  type="range" name="manualHoursPerWeek" min="1" max="40" value={inputs.manualHoursPerWeek} onChange={handleInputChange}
                  className="w-full accent-[var(--accent)] bg-[var(--surface2)]"
                />
                <div className="flex justify-between mt-2 mono text-[12px]">
                  <span>1h</span>
                  <span className="text-[var(--accent)] font-bold">{inputs.manualHoursPerWeek}h</span>
                  <span>40h</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Est. Manual Error Rate (%)</label>
                <input 
                  type="range" name="errorRate" min="0" max="20" step="0.5" value={inputs.errorRate} onChange={handleInputChange}
                  className="w-full accent-[var(--accent)] bg-[var(--surface2)]"
                />
                <div className="flex justify-between mt-2 mono text-[12px]">
                  <span>0%</span>
                  <span className="text-[var(--accent)] font-bold">{inputs.errorRate}%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7 space-y-6 p-12 bg-[var(--surface2)]/30">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-8">Estimated Annual Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-1">
                <p className="text-[10px] mono uppercase text-[var(--muted)]">Total Manual Cost</p>
                <p className="text-3xl font-bold tracking-tighter">${results.annualCostManual.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] mono uppercase text-[var(--accent)]">Potential Annual Savings</p>
                <p className="text-4xl font-bold tracking-tighter text-[var(--accent)]">${results.potentialSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] mono uppercase text-[var(--muted)]">Hours Reclaimed / Year</p>
                <p className="text-3xl font-bold tracking-tighter">{results.hoursReclaimed.toLocaleString(undefined, {maximumFractionDigits: 0})}h</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] mono uppercase text-[var(--muted)]">Estimated Efficiency ROI</p>
                <p className="text-3xl font-bold tracking-tighter">{(results.roi / 10).toFixed(1)}x</p>
              </div>
            </div>

            <div className="mt-12 p-4 bg-black/40 border border-[var(--border)] flex items-start gap-4">
              <AlertCircle size={20} className="text-[var(--accent)] shrink-0 mt-1" />
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                This estimation includes labor costs and the "hidden cost" of manual errors (calculated at 1.5x labor impact). Automating these workflows usually pays for itself within <span className="text-white font-bold">3–6 months</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print mt-12">
              <div 
                onClick={handleShare}
                className="bg-[var(--surface)] border border-[var(--border)] p-6 group hover:border-[var(--accent)]/50 transition-all cursor-pointer"
              >
                <Share2 className="text-[var(--accent)] mb-4" size={20} />
                <h4 className="font-bold uppercase text-[12px] mb-2">Share Results</h4>
                <p className="text-[11px] text-[var(--muted)]">Copy a direct link to this calculation for your proposal.</p>
              </div>
              <div 
                onClick={handleDownload}
                className="bg-[var(--accent)] text-black p-6 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Download className="mb-4" size={20} />
                <h4 className="font-bold uppercase text-[12px] mb-2">Download PDF Report</h4>
                <p className="text-[11px] opacity-80">Get a detailed PDF breakdown of these savings.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-24">
          {/* Expert Commentary */}
          <div className="mt-0 border-t border-[var(--border)] pt-12">
            <h2 className="text-2xl font-bold uppercase mb-8">Why BI ROI Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-8 h-8 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[var(--accent)] font-bold">1</div>
                <h3 className="font-bold uppercase text-sm">Labor Displacement</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">Most analysts spend 80% of their time preparing data and only 20% analyzing it. Automation flips this ratio.</p>
              </div>
              <div className="space-y-4">
                <div className="w-8 h-8 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[var(--accent)] font-bold">2</div>
                <h3 className="font-bold uppercase text-sm">Error Mitigation</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">Manual spreadsheets have a 90% error rate in complex models. Automated pipelines ensure "One Version of Truth".</p>
              </div>
              <div className="space-y-4">
                <div className="w-8 h-8 rounded-full bg-[var(--surface2)] flex items-center justify-center text-[var(--accent)] font-bold">3</div>
                <h3 className="font-bold uppercase text-sm">Opportunity Cost</h3>
                <p className="text-[13px] text-[var(--muted)] leading-relaxed">The biggest cost isn't the labor—it's the delayed decision-making caused by slow, manual reporting cycles.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
        <div className="container" style={{ maxWidth: '860px', padding: '4rem 1.5rem' }}>
          <div className="label-tech mb-4" style={{ letterSpacing: '0.3em', fontSize: '0.65rem' }}>ABOUT_THIS_TOOL</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text)' }}>BI ROI Calculator — Justify Your Business Intelligence Investment</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            The BI ROI Calculator helps data team leads, BI managers, CFOs, and analytics consultants quantify the financial return of investing in Business Intelligence automation. By entering your team size, average salary, manual reporting hours per week, error rate, and automation potential, the calculator produces an annual cost-of-manual-work estimate, projected savings, hours reclaimed per year, and a simplified ROI percentage.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Use this calculator when preparing a business case for Power BI, Tableau, Looker, or any enterprise BI platform. The output is formatted for print and can be exported as a PDF to include in board presentations or vendor evaluation documents. All calculations follow standard cost-of-labor methodology with a 10% implementation cost assumption for ROI baseline.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
            {[
              { label: 'Annual Cost of Manual Work', desc: 'Labor cost + error impact of current manual reporting workflows' },
              { label: 'Potential Annual Savings', desc: 'Projected cost reduction based on your automation potential %' },
              { label: 'Hours Reclaimed Per Year', desc: 'Team hours freed from manual data work after BI implementation' },
              { label: 'ROI %', desc: 'Return on investment based on estimated 10% implementation cost' },
            ].map(f => (
              <div key={f.label} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{f.label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />


      <style jsx global>{`
        @media print {
          .no-print, nav, footer, .label-tech {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .boxed-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
          }
          .grid {
            display: block !important;
          }
          .bg-\[var\(--surface2\)\] {
            background: #f9f9f9 !important;
            border: 1px solid #ddd !important;
          }
          .hero-title {
            color: black !important;
            -webkit-text-fill-color: black !important;
          }
          .text-\[var\(--accent\)\] {
            color: #000 !important;
            font-weight: bold !important;
          }
        }
      `}</style>
    </div>
  );
}
