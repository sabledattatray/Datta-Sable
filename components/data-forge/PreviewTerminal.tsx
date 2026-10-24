'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface PreviewTerminalProps {
  selectedIndustry: any;
  selectedFields: any[];
  previewData: any[];
  isGenerating: boolean;
  dataCount: number;
  session: any;
}

export default function PreviewTerminal({ 
  selectedIndustry, 
  selectedFields, 
  previewData, 
  isGenerating, 
  dataCount, 
  session 
}: PreviewTerminalProps) {
  return (
    <div className="border border-[var(--border)] bg-[#0a0a0a] rounded-[2rem] overflow-hidden flex flex-col shadow-3xl min-h-[600px]">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-red-500" />
          <span className="text-[length:var(--text-small)] font-black text-gray-500 tracking-[0.2em] uppercase font-mono">Intelligence Stream</span>
        </div>
        <div className="flex items-center gap-4 text-[length:var(--text-small)] font-mono text-gray-600">
          <span className="text-red-500/50 uppercase tracking-widest">{selectedIndustry.id} ACTIVE</span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/20" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
            <div className="w-2 h-2 rounded-full bg-green-500/20" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 font-mono text-[length:var(--text-small)] overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead className="text-gray-600 border-b border-white/5">
            <tr>
              {selectedFields.map(f => (
                <th key={f.label} className="pb-4 px-4 uppercase tracking-tighter font-bold whitespace-nowrap">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            <AnimatePresence mode="wait">
              {previewData.map((row, idx) => (
                <motion.tr 
                  key={`${selectedIndustry.id}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  {selectedFields.map(f => (
                    <td key={f.label} className="py-4 px-4 whitespace-nowrap text-gray-300 tabular-nums">
                      {f.id === 'amount' ? `$${row[f.label]}` : row[f.label]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {isGenerating && (
          <div className="py-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-white/5 rounded-lg animate-pulse w-full" />
            ))}
          </div>
        )}
      </div>

      {/* Summary Bar */}
      <div className="px-8 py-5 bg-black/40 border-t border-white/5 flex justify-between items-center text-[length:var(--text-small)] font-mono text-gray-600 uppercase">
        <div className="flex gap-10">
          <div className="space-y-1">
            <span className="text-[length:var(--text-small)] opacity-50 block tracking-widest">Tier</span>
            <span className={session ? 'text-red-500 font-bold' : 'text-gray-400 font-bold'}>{session ? 'PRO' : 'OPEN'}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[length:var(--text-small)] opacity-50 block tracking-widest">Estimated Size</span>
            <span className="text-red-500 font-bold tabular-nums">~{(dataCount * selectedFields.length * 0.015).toFixed(1)} KB</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]" />
          <span className="tracking-widest">Ready to Forge</span>
        </div>
      </div>
    </div>
  );
}
