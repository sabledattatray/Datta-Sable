'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Crosshair from '@/components/Crosshair';
import {
  Download,
  Filter,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Code2,
  Trophy,
  Zap,
  Activity,
  ShieldCheck,
  BarChart3,
  PieChart,
  X,
  Target,
  ArrowUpRight,
  UserCheck,
  DollarSign,
  ExternalLink,
  BookOpen,
  Briefcase,
  Sliders,
  Globe,
  Database,
  Table,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import auraData from './auraData.json';
import { EXCEL_PROJECTS } from '@/data/excelProjects';

// Number formatters
function formatCurrency(val: number, decimals: number = 0): string {
  if (val >= 1_000_000) {
    return '$' + (val / 1_000_000).toFixed(decimals > 0 ? decimals : 2) + 'M';
  }
  return '$' + Math.round(val).toLocaleString('en-US');
}

function formatExactCurrency(val: number): string {
  return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(val: number): string {
  return (val * 100).toFixed(1) + '%';
}

export default function AuraCapitalSalesDashboardPage() {
  const projectMetadata = EXCEL_PROJECTS[0];

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'runrate' | 'regional' | 'products' | 'pivot' | 'ledger' | 'architecture'>('runrate');

  // Interactive Filter States
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination for Ledger
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Sorting for Ledger
  const [sortField, setSortField] = useState<'date' | 'revenue' | 'grossProfit' | 'qty'>('revenue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Available Filter Options
  const regions = ['All', 'North America', 'EMEA', 'APAC', 'LATAM'];
  const channels = ['All', 'Direct Enterprise', 'Partner Ecosystem', 'Inside Sales', 'Online Enterprise'];
  const categories = ['All', 'Risk & Compliance', 'Trading Systems', 'Wealth Management', 'FinTech Infrastructure'];

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return auraData.transactionsSample.filter((t: any) => {
      const matchRegion = selectedRegion === 'All' || t.region === selectedRegion;
      const matchChannel = selectedChannel === 'All' || t.channel === selectedChannel;
      const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.client.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.sku.toLowerCase().includes(q) ||
        t.rep.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q);

      return matchRegion && matchChannel && matchCategory && matchSearch;
    }).sort((a: any, b: any) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [selectedRegion, selectedChannel, selectedCategory, searchQuery, sortField, sortAsc]);

  // Dynamic Calculated Metrics based on active filters
  const computedMetrics = useMemo(() => {
    // If no filters are applied, use certified macro totals
    const isFiltered = selectedRegion !== 'All' || selectedChannel !== 'All' || selectedCategory !== 'All' || searchQuery !== '';

    if (!isFiltered) {
      return {
        grossVolume: 15948300,
        certifiedActuals: 3880442.5,
        grossProfit: 10874900,
        blendedMargin: 0.6819,
        orders: 1037,
        avgDealSize: 15409,
        units: 3582,
        isFiltered: false
      };
    }

    const totalRev = filteredTransactions.reduce((acc, t) => acc + t.revenue, 0);
    const totalProfit = filteredTransactions.reduce((acc, t) => acc + t.grossProfit, 0);
    const totalUnits = filteredTransactions.reduce((acc, t) => acc + t.qty, 0);
    const count = filteredTransactions.length;
    const margin = totalRev > 0 ? totalProfit / totalRev : 0;
    const avgDeal = count > 0 ? totalRev / count : 0;

    return {
      grossVolume: totalRev,
      certifiedActuals: totalRev,
      grossProfit: totalProfit,
      blendedMargin: margin,
      orders: count,
      avgDealSize: avgDeal,
      units: totalUnits,
      isFiltered: true
    };
  }, [filteredTransactions, selectedRegion, selectedChannel, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleResetFilters = () => {
    setSelectedRegion('All');
    setSelectedChannel('All');
    setSelectedCategory('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSort = (field: 'date' | 'revenue' | 'grossProfit' | 'qty') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      <Navbar />
      <Crosshair />

      {/* TOP HEADER / BREADCRUMB */}
      <section className="relative pt-24 pb-8 border-b border-[var(--border)] overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/dashboards" className="hover:text-[var(--accent)] transition-colors">Dashboards</Link>
              <span>/</span>
              <span className="text-[var(--accent)] font-semibold">Aura Capital FinTech BI</span>
            </div>

            {/* Badges & Verification */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                <ShieldCheck size={13} className="text-[#00F0FF]" />
                Certified Master Model
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={13} />
                Audited 2026 Edition
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--card)] border border-[var(--border)] text-[var(--muted)]">
                <FileSpreadsheet size={13} className="text-emerald-400" />
                4.86 MB .xlsx
              </span>
            </div>
          </div>

          {/* Headline & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] mb-3">
                <BuildingIcon className="w-3.5 h-3.5 text-[#00F0FF]" />
                Institutional FinTech Commercial Intelligence
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-3 leading-tight">
                Aura Capital & FinTech Group
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-sky-400 to-blue-500">
                  Executive Performance & Sales Dashboard
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Explore the interactive web mirror of this institutional Excel BI model. Slicers, dynamic quota scorecards,
                cross-tabulation matrices, and a 1,037 certified transaction ledger are modeled below — or download the master spreadsheet workbook.
              </p>
            </div>

            {/* Direct Download Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="/Projects/Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                download="Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00F0FF] to-sky-500 text-black shadow-lg shadow-[#00F0FF]/20 hover:shadow-[#00F0FF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Download size={18} className="text-black stroke-[2.5]" />
                <span>Download Master Excel (.xlsx)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/20 text-black/80 font-semibold">
                  4.86 MB
                </span>
              </a>

              <button
                onClick={() => {
                  const el = document.getElementById('architecture-deepdive');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <BookOpen size={16} />
                <span>Model Architecture</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. INTERACTIVE PARAMETER SLICER BAR */}
        <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#00F0FF]" />
              <h2 className="text-sm font-bold tracking-wide uppercase text-[var(--text)]">
                Interactive Model Slicers & Filters
              </h2>
              <span className="text-xs text-[var(--muted)] hidden sm:inline">
                (Mirrors Excel C4 & G4 Dynamic Dropdowns)
              </span>
            </div>

            {(selectedRegion !== 'All' || selectedChannel !== 'All' || selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#00F0FF] hover:underline font-mono"
              >
                <RotateCcw size={12} />
                Reset Slicers
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Region / Theater Filter */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 flex items-center gap-1">
                <Globe size={13} className="text-[var(--accent)]" />
                Global Theater / Region:
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:border-[#00F0FF] focus:outline-none transition-colors"
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r === 'All' ? 'All Global Theaters' : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Sales Channel Filter */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 flex items-center gap-1">
                <Layers size={13} className="text-[var(--accent)]" />
                Sales Channel:
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => {
                  setSelectedChannel(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:border-[#00F0FF] focus:outline-none transition-colors"
              >
                {channels.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Sales Channels' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 flex items-center gap-1">
                <Database size={13} className="text-[var(--accent)]" />
                Product Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:border-[#00F0FF] focus:outline-none transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Product Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Instant Search */}
            <div>
              <label className="block text-xs font-semibold text-[var(--muted)] mb-1.5 flex items-center gap-1">
                <Search size={13} className="text-[var(--accent)]" />
                Search Ledger / Client:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Zurich, AML, London..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:border-[#00F0FF] focus:outline-none transition-colors placeholder:text-[var(--muted)]/50"
                />
                <Search size={13} className="absolute left-2.5 top-2.5 text-[var(--muted)]" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC LIVE KPI SCORECARDS */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Gross Revenue */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 relative overflow-hidden group hover:border-[#00F0FF]/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1 font-mono uppercase tracking-wider">
              <span>Gross Revenue</span>
              <DollarSign size={14} className="text-[#00F0FF]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {computedMetrics.isFiltered ? formatCurrency(computedMetrics.grossVolume) : '$15.95M'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <TrendingUp size={11} />
              <span>{computedMetrics.isFiltered ? 'Active Filtered Volume' : '$3.88M Certified Actuals'}</span>
            </div>
          </div>

          {/* Card 2: Gross Operating Profit */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1 font-mono uppercase tracking-wider">
              <span>Gross Profit</span>
              <Activity size={14} className="text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
              {computedMetrics.isFiltered ? formatCurrency(computedMetrics.grossProfit) : '$10.87M'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[var(--muted)]">
              <span>Net Operating Spread</span>
            </div>
          </div>

          {/* Card 3: Blended Margin */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 relative overflow-hidden group hover:border-sky-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1 font-mono uppercase tracking-wider">
              <span>Blended Margin</span>
              <Target size={14} className="text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-sky-400 tracking-tight">
              {formatPercent(computedMetrics.blendedMargin)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <CheckCircle2 size={11} />
              <span>Target Met (&gt;65%)</span>
            </div>
          </div>

          {/* Card 4: Orders / Transactions */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1 font-mono uppercase tracking-wider">
              <span>Contracts / Tx</span>
              <BarChart3 size={14} className="text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {computedMetrics.orders.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[var(--muted)]">
              <span>{computedMetrics.isFiltered ? 'Matching Records' : '1,037 Total Audit Rows'}</span>
            </div>
          </div>

          {/* Card 5: Average Deal Size */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1 font-mono uppercase tracking-wider">
              <span>Avg Deal Value</span>
              <Award size={14} className="text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {formatCurrency(computedMetrics.avgDealSize)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-amber-400">
              <span>Tier-1 Enterprise Size</span>
            </div>
          </div>

          {/* Card 6: Software Units Shipped */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1 font-mono uppercase tracking-wider">
              <span>Units Deployed</span>
              <Zap size={14} className="text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[var(--text)] tracking-tight">
              {computedMetrics.units.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-[var(--muted)]">
              <span>Licensed Installs</span>
            </div>
          </div>
        </section>

        {/* 3. MULTI-TAB NAVIGATION */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border)] overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('runrate')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'runrate'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <BarChart3 size={15} />
              <span>1. Monthly Financial Run-Rate</span>
            </button>

            <button
              onClick={() => setActiveTab('regional')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'regional'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <Globe size={15} />
              <span>2. Regional Quotas & Scorecard</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'products'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <Briefcase size={15} />
              <span>3. Product Suite & Strategic Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('pivot')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'pivot'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <Table size={15} />
              <span>4. Dynamic Pivot Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'ledger'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <Database size={15} />
              <span>5. Transaction Ledger ({filteredTransactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'architecture'
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--card)]'
              }`}
            >
              <Code2 size={15} />
              <span>6. Excel Engineering Deep Dive</span>
            </button>
          </div>

          {/* TAB 1: MONTHLY FINANCIAL RUN-RATE */}
          {activeTab === 'runrate' && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                      <BarChart3 size={18} className="text-[#00F0FF]" />
                      FY2024 Monthly Financial Run-Rate & Margin Trajectory
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      Audited monthly progression from Jan '24 to Dec '24 with certified revenue, COGS, gross profit, and margin %
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-[var(--text)]">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#00F0FF]" /> Revenue
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> Gross Profit
                    </span>
                  </div>
                </div>

                {/* Visual Run-Rate Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
                  {auraData.monthlyRunRate.map((m) => {
                    const revPct = (m.revenue / 320000) * 100;
                    const profitPct = (m.grossProfit / 320000) * 100;

                    return (
                      <div
                        key={m.period}
                        className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[#00F0FF]/40 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-[var(--text)] font-mono">{m.period}</span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                            {formatPercent(m.marginPct)} Margin
                          </span>
                        </div>

                        {/* Revenue & Profit Amounts */}
                        <div className="flex items-baseline justify-between text-xs mb-2.5">
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">Revenue</span>
                            <span className="font-bold text-[var(--text)] font-mono">{formatCurrency(m.revenue)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[var(--muted)] block">Profit</span>
                            <span className="font-bold text-emerald-400 font-mono">{formatCurrency(m.grossProfit)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-[var(--muted)] block">Orders</span>
                            <span className="font-semibold text-[var(--muted)] font-mono">{m.orders}</span>
                          </div>
                        </div>

                        {/* Comparative Stacked Visual Bar */}
                        <div className="w-full bg-[var(--card)] h-2 rounded-full overflow-hidden flex gap-0.5">
                          <div
                            className="bg-[#00F0FF] h-full rounded-l-full"
                            style={{ width: `${Math.min(revPct, 100)}%` }}
                            title={`Revenue: ${formatCurrency(m.revenue)}`}
                          />
                          <div
                            className="bg-emerald-400 h-full rounded-r-full"
                            style={{ width: `${Math.min(profitPct, 100)}%` }}
                            title={`Profit: ${formatCurrency(m.grossProfit)}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Run-Rate Totals Strip */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--card)] to-[var(--bg)] border border-[#00F0FF]/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-[#00F0FF] font-bold block">
                      Total LTM Run-Rate Summary
                    </span>
                    <span className="text-xs text-[var(--muted)]">12-Month Audited Aggregation</span>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-[var(--muted)] block">Total Revenue</span>
                      <span className="text-base font-bold text-[var(--text)]">$2,496,807.50</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted)] block">Total COGS</span>
                      <span className="text-base font-bold text-rose-400">$863,950.00</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted)] block">Net Gross Profit</span>
                      <span className="text-base font-bold text-emerald-400">$1,632,857.50</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted)] block">Weighted Margin</span>
                      <span className="text-base font-bold text-sky-400">65.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGIONAL QUOTAS & SCORECARD */}
          {activeTab === 'regional' && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="mb-6 pb-4 border-b border-[var(--border)]">
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Globe size={18} className="text-[#00F0FF]" />
                    Global Territory Performance & Director Quota Scorecard
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Managing director quota accountability, variance spread, attainment % gauges, and YoY growth rates
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auraData.regionalPerformance.map((reg) => {
                    const isExceeded = reg.attainment >= 1.0;
                    const attainmentPct = reg.attainment * 100;

                    return (
                      <div
                        key={reg.region}
                        className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[#00F0FF]/50 transition-colors space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] font-semibold">
                              {reg.region} Theater
                            </span>
                            <h4 className="text-lg font-bold text-[var(--text)]">{reg.director}</h4>
                            <p className="text-xs text-[var(--muted)] mt-0.5">{reg.markets}</p>
                          </div>

                          <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                            isExceeded
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {attainmentPct.toFixed(1)}% Quota
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                            <span className="text-[var(--muted)]">Attainment Progress:</span>
                            <span className={isExceeded ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                              {formatCurrency(reg.actualRevenue)} / {formatCurrency(reg.quotaTarget)}
                            </span>
                          </div>
                          <div className="w-full bg-[var(--card)] h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isExceeded ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'
                              }`}
                              style={{ width: `${Math.min(attainmentPct, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] text-xs font-mono">
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">Variance ($)</span>
                            <span className={`font-bold ${reg.variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {reg.variance >= 0 ? '+' : ''}{formatCurrency(reg.variance)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">Gross Margin</span>
                            <span className="font-bold text-sky-400">{formatPercent(reg.marginPct)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--muted)] block">YoY Growth</span>
                            <span className="font-bold text-emerald-400">+{formatPercent(reg.yoyGrowth)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT SUITE & STRATEGIC ACCOUNTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Catalog */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="mb-4 pb-3 border-b border-[var(--border)]">
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Briefcase size={18} className="text-[#00F0FF]" />
                    Enterprise Product Portfolio & Target Margins
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Catalog of institutional FinTech solutions, pricing structure, inventory status, and target gross margins
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3 font-sans">Product Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Unit Cost</th>
                        <th className="py-2.5 px-3 text-right">List Price</th>
                        <th className="py-2.5 px-3 text-right">Target Margin</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {auraData.productCatalog.map((p) => (
                        <tr key={p.sku} className="hover:bg-[var(--bg)] transition-colors">
                          <td className="py-3 px-3 text-[#00F0FF] font-semibold">{p.sku}</td>
                          <td className="py-3 px-3 font-sans font-medium text-[var(--text)]">{p.name}</td>
                          <td className="py-3 px-3 text-[var(--muted)]">{p.category}</td>
                          <td className="py-3 px-3 text-right text-rose-400">{formatExactCurrency(p.unitCost)}</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">{formatExactCurrency(p.listPrice)}</td>
                          <td className="py-3 px-3 text-right text-sky-400 font-semibold">{formatPercent(p.targetMargin)}</td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Customer Accounts */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="mb-4 pb-3 border-b border-[var(--border)]">
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Users size={18} className="text-[#00F0FF]" />
                    Top Strategic Institutional Accounts & Retention Health
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Tier-1 client accounts, contract order history, lifetime revenues, and renewal calendar
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {auraData.customerAccounts.map((c) => (
                    <div
                      key={c.accountId}
                      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[#00F0FF]/40 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#00F0FF] block">{c.accountId} • {c.tier}</span>
                          <h4 className="text-sm font-bold text-[var(--text)] line-clamp-1">{c.organization}</h4>
                          <span className="text-xs text-[var(--muted)]">{c.industry} ({c.country})</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                          c.accountHealth === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {c.accountHealth}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-[var(--muted)] block">Lifetime Rev</span>
                          <span className="font-bold text-[var(--text)]">{formatCurrency(c.lifetimeRevenue)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--muted)] block">Renewal Cycle</span>
                          <span className="font-semibold text-amber-400">{c.renewalQuarter}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DYNAMIC PIVOT MATRIX */}
          {activeTab === 'pivot' && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="mb-4 pb-3 border-b border-[var(--border)]">
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Table size={18} className="text-[#00F0FF]" />
                    Cross-Tabulation Matrix: Theater by Sales Channel ($)
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Mirrors Pivot Table 1 from the master Excel workbook calculating channel volume mix and theater contributions
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                        <th className="py-2.5 px-3">Global Theater</th>
                        <th className="py-2.5 px-3 text-right">Partner Ecosystem</th>
                        <th className="py-2.5 px-3 text-right">Direct Enterprise</th>
                        <th className="py-2.5 px-3 text-right">Total Gross Revenue</th>
                        <th className="py-2.5 px-3 text-right">Gross Profit</th>
                        <th className="py-2.5 px-3 text-right">Blended Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      <tr className="hover:bg-[var(--bg)] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text)]">North America</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$1,003,607.50</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$3,220,102.50</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[var(--text)]">$4,223,710.00</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">$2,755,260.00</td>
                        <td className="py-2.5 px-3 text-right text-sky-400 font-bold">65.2%</td>
                      </tr>
                      <tr className="hover:bg-[var(--bg)] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text)]">EMEA</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$1,271,227.50</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$3,408,940.00</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[var(--text)]">$4,680,167.50</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">$3,046,067.50</td>
                        <td className="py-2.5 px-3 text-right text-sky-400 font-bold">65.1%</td>
                      </tr>
                      <tr className="hover:bg-[var(--bg)] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text)]">APAC</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$536,275.00</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$2,256,517.50</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[var(--text)]">$2,792,792.50</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">$1,822,792.50</td>
                        <td className="py-2.5 px-3 text-right text-sky-400 font-bold">65.3%</td>
                      </tr>
                      <tr className="hover:bg-[var(--bg)] transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-[var(--text)]">LATAM</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$675,052.50</td>
                        <td className="py-2.5 px-3 text-right text-[var(--muted)]">$1,856,032.50</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[var(--text)]">$2,531,085.00</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">$1,651,835.00</td>
                        <td className="py-2.5 px-3 text-right text-sky-400 font-bold">65.3%</td>
                      </tr>
                      <tr className="bg-[var(--card)] font-bold border-t-2 border-[#00F0FF]/30">
                        <td className="py-3 px-3 text-[#00F0FF]">Total Global Run-Rate:</td>
                        <td className="py-3 px-3 text-right text-[var(--muted)]">$3,486,162.50</td>
                        <td className="py-3 px-3 text-right text-[var(--muted)]">$10,741,592.50</td>
                        <td className="py-3 px-3 text-right text-[#00F0FF]">$14,227,755.00</td>
                        <td className="py-3 px-3 text-right text-emerald-400">$9,275,955.00</td>
                        <td className="py-3 px-3 text-right text-sky-400">65.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fiscal Quarters Breakdown */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="mb-4 pb-3 border-b border-[var(--border)]">
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Calendar size={18} className="text-[#00F0FF]" />
                    Fiscal Quarterly Performance & Pacing (Q1-2024 to Q4-2024)
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Quarterly pacing demonstrating deal velocity and average deal expansion towards year-end
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { q: 'Q1-2024', rev: 503172.5, gp: 325772.5, deals: 48, avg: 10482.76, margin: '64.7%' },
                    { q: 'Q2-2024', rev: 491055.0, gp: 318355.0, deals: 40, avg: 12276.38, margin: '64.8%' },
                    { q: 'Q3-2024', rev: 469782.5, gp: 303732.5, deals: 37, avg: 12696.82, margin: '64.7%' },
                    { q: 'Q4-2024', rev: 663700.0, gp: 429850.0, deals: 43, avg: 15434.88, margin: '64.8%' },
                  ].map((item) => (
                    <div
                      key={item.q}
                      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[#00F0FF]/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[var(--text)] font-mono">{item.q}</span>
                        <span className="text-[11px] font-mono font-semibold text-sky-400">{item.margin} Margin</span>
                      </div>
                      <div className="text-lg font-black text-[#00F0FF] font-mono">
                        {formatCurrency(item.rev)}
                      </div>
                      <div className="pt-2 border-t border-[var(--border)] text-xs font-mono space-y-1">
                        <div className="flex justify-between text-[var(--muted)]">
                          <span>Gross Profit:</span>
                          <span className="text-emerald-400 font-semibold">{formatCurrency(item.gp)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--muted)]">
                          <span>Deals Closed:</span>
                          <span className="text-[var(--text)] font-semibold">{item.deals} Deals</span>
                        </div>
                        <div className="flex justify-between text-[var(--muted)]">
                          <span>Avg Deal:</span>
                          <span className="text-amber-400 font-semibold">{formatCurrency(item.avg)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TRANSACTION LEDGER EXPLORER */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                      <Database size={18} className="text-[#00F0FF]" />
                      Certified Sales Transaction Ledger
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      Showing {filteredTransactions.length} records matching current slicers. Click headers to sort.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--muted)]">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                        <th className="py-2.5 px-3">TX ID</th>
                        <th
                          className="py-2.5 px-3 cursor-pointer hover:text-[var(--accent)]"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Date</span>
                            <ArrowUpDown size={11} />
                          </div>
                        </th>
                        <th className="py-2.5 px-3 font-sans">Client Organization</th>
                        <th className="py-2.5 px-3">Region</th>
                        <th className="py-2.5 px-3">Channel</th>
                        <th className="py-2.5 px-3">Product SKU</th>
                        <th
                          className="py-2.5 px-3 text-right cursor-pointer hover:text-[var(--accent)]"
                          onClick={() => handleSort('qty')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <span>Qty</span>
                            <ArrowUpDown size={11} />
                          </div>
                        </th>
                        <th
                          className="py-2.5 px-3 text-right cursor-pointer hover:text-[var(--accent)]"
                          onClick={() => handleSort('revenue')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <span>Revenue</span>
                            <ArrowUpDown size={11} />
                          </div>
                        </th>
                        <th
                          className="py-2.5 px-3 text-right cursor-pointer hover:text-[var(--accent)]"
                          onClick={() => handleSort('grossProfit')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <span>Profit</span>
                            <ArrowUpDown size={11} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {paginatedTransactions.map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-[var(--bg)] transition-colors">
                          <td className="py-3 px-3 text-[#00F0FF] font-semibold">{tx.id}</td>
                          <td className="py-3 px-3 text-[var(--muted)]">{tx.date}</td>
                          <td className="py-3 px-3 font-sans font-medium text-[var(--text)]">
                            <div>{tx.client}</div>
                            <div className="text-[10px] text-[var(--muted)]">{tx.industry} • {tx.city}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--card)] border border-[var(--border)]">
                              {tx.region}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[var(--muted)]">{tx.channel}</td>
                          <td className="py-3 px-3 text-[#00F0FF]">{tx.sku}</td>
                          <td className="py-3 px-3 text-right font-semibold text-[var(--text)]">{tx.qty}</td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-400">{formatExactCurrency(tx.revenue)}</td>
                          <td className="py-3 px-3 text-right font-bold text-sky-400">{formatExactCurrency(tx.grossProfit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--muted)] font-mono">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} records
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--accent)]"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-mono px-2 text-[var(--muted)]">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--border)] bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--accent)]"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EXCEL ENGINEERING DEEP DIVE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Code2 size={18} className="text-[#00F0FF]" />
                    Excel Technical Architecture & Engineering Breakdown
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    How this workbook was structured to achieve dynamic live calculation speeds across 1,000+ transaction lines
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectMetadata.excelEngineeringHighlights.map((tech) => (
                    <div
                      key={tech.feature}
                      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-2"
                    >
                      <h4 className="text-sm font-bold text-[#00F0FF] flex items-center gap-1.5">
                        <Sparkles size={14} />
                        {tech.feature}
                      </h4>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        {tech.description}
                      </p>
                      <div className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] font-mono text-[11px] text-emerald-400 break-all">
                        {tech.formulaOrMethod}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Star Schema Diagram & Logic */}
                <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                    <Database size={16} className="text-[var(--accent)]" />
                    Spreadsheet Data Modeling & Relational Schema
                  </h4>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Rather than building flat, bloated tables, the Aura Capital workbook utilizes a clean dimensional relational model:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-[#00F0FF] font-bold block mb-1">FactSales</span>
                      <span className="text-[var(--muted)] text-[11px]">1,037 certified ledger rows tracking Transaction ID, Date, Amount, Cost, Qty.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-emerald-400 font-bold block mb-1">DimProduct</span>
                      <span className="text-[var(--muted)] text-[11px]">5 enterprise SKUs with list prices, standard unit costs, and target margins.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-sky-400 font-bold block mb-1">DimCustomer</span>
                      <span className="text-[var(--muted)] text-[11px]">Key accounts classified by strategic tier, industry vertical, and renewal date.</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-amber-400 font-bold block mb-1">DimRegion</span>
                      <span className="text-[var(--muted)] text-[11px]">4 global theaters linked to Managing Directors and assigned annual quota targets.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. COMPREHENSIVE ARCHITECTURAL GUIDE & INFORMATION */}
        <section id="architecture-deepdive" className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-[var(--border)] pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] font-bold block mb-1">
              Technical Documentation & Context
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">
              About This Interactive Dashboard & The Master Excel Model
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              Full background on the business requirements, methodology, strategic insights, and instructions for running the Excel file.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Objective & Context */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                <Target size={16} className="text-[#00F0FF]" />
                Executive Business Problem
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Aura Capital & FinTech Group provides mission-critical risk compliance, high-frequency execution terminals, and automated wealth management infrastructure to top-tier financial institutions.
                Historically, regional sales directors maintained standalone spreadsheets, causing data silos, delayed quarter-end consolidations, and unreliable quota attainment projections.
              </p>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                This workbook was developed as a unified, C-suite grade reporting cockpit capable of modeling multi-theater sales run-rates, individual contract margins, and partner channel profitability without requiring complex external BI servers.
              </p>
            </div>

            {/* Strategic Findings */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" />
                Key Strategic Commercial Findings
              </h3>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                {projectMetadata.strategicFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Use the Downloaded Excel File */}
          <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <HelpCircle size={16} className="text-sky-400" />
              How to Use the Downloaded Excel Workbook (.xlsx)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--muted)]">
              <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] space-y-1">
                <span className="font-bold text-[var(--text)] block font-mono">1. Enable Editing</span>
                <p>Open the downloaded file in Microsoft Excel (2016 or newer recommended) and click "Enable Editing". No VBA macros or external plugins required.</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] space-y-1">
                <span className="font-bold text-[var(--text)] block font-mono">2. Use Slicer Dropdowns</span>
                <p>On the "Executive Dashboard" sheet, click cells C4 (Region Filter) or G4 (Channel Filter) to watch the entire dashboard recalculate dynamically.</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] space-y-1">
                <span className="font-bold text-[var(--text)] block font-mono">3. Inspect Formulas</span>
                <p>Navigate to "Sales Transactions" or "Pivot Table Analysis" to inspect clean SUMIFS, XLOOKUP, and structured table references.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DOWNLOAD CALLOUT CARD (BOTTOM VERIFIED CTA) */}
        <section className="relative overflow-hidden rounded-3xl border border-[#00F0FF]/40 bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--bg)] p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                <FileSpreadsheet size={14} />
                <span>Verified Direct Excel Download</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
                Download the Complete Master Workbook
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Get full access to the original 6-sheet Microsoft Excel model containing all 1,037 transaction rows,
                dynamic pivot matrices, formulas, and native charts.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-mono text-[var(--muted)]">
                <span>• File Size: <strong>4.86 MB</strong></span>
                <span>• Format: <strong>.xlsx (Excel 2016+)</strong></span>
                <span>• Sheets: <strong>6 Verified Sheets</strong></span>
                <span>• Macros: <strong>None Required (Native Formulas)</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <a
                href="/Projects/Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                download="Aura_Capital___FinTech_Group_Executive_Sales_Dashboard_2026.xlsx"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-[#00F0FF] via-sky-400 to-blue-500 text-black shadow-xl shadow-[#00F0FF]/30 hover:shadow-[#00F0FF]/50 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <Download size={20} className="stroke-[2.5]" />
                <span>Download .xlsx File (4.86 MB)</span>
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <span>Request Custom Excel BI</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
