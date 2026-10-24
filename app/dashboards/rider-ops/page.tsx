'use client';

import React, { useState, useMemo } from 'react';
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
  Flame,
  Zap,
  Activity,
  ShieldCheck,
  BarChart3,
  PieChart,
  X,
  Target,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';


// Deterministic Indian number formatters to eliminate SSR / Client hydration mismatch
function formatIndianNum(num: number): string {
  const n = Math.floor(Math.abs(num));
  const s = n.toString();
  let res = '';
  if (s.length <= 3) {
    res = s;
  } else {
    const lastThree = s.slice(-3);
    const remaining = s.slice(0, -3);
    res = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return (num < 0 ? '-' : '') + res;
}

function formatIndianCurrency(num: number, decimals: number = 0): string {
  if (decimals === 0) {
    return '₹' + formatIndianNum(Math.round(num));
  }
  const fixed = num.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  return '₹' + formatIndianNum(Number(intPart)) + '.' + decPart;
}

interface RiderRecord {
  id: string;
  name: string;
  zone: 'Bandra West' | 'Andheri East' | 'Powai Tech-Hub' | 'South Mumbai';
  trips: number;
  distanceKm: number;
  grossEarnings: number;
  bonusDays: number;
  bonusAmount: number;
  attendanceDays: number;
  totalDays: number;
  deductions: number;
  netPayout: number;
  maxTripsDay: number;
  weekData: Record<string, { trips: number; earnings: number; presentDays: number }>;
}

const RIDER_DATASET: RiderRecord[] = [
  {
    id: 'RID101',
    name: 'Arjun Sharma',
    zone: 'Bandra West',
    trips: 342,
    distanceKm: 1480.5,
    grossEarnings: 34200,
    bonusDays: 18,
    bonusAmount: 4500,
    attendanceDays: 27,
    totalDays: 30,
    deductions: 320.5,
    netPayout: 38379.5,
    maxTripsDay: 16,
    weekData: {
      'Week 1': { trips: 68, earnings: 6800, presentDays: 5 },
      'Week 2': { trips: 74, earnings: 7400, presentDays: 6 },
      'Week 3': { trips: 62, earnings: 6200, presentDays: 5 },
      'Week 4': { trips: 70, earnings: 7000, presentDays: 5 },
      'Week 5': { trips: 68, earnings: 6800, presentDays: 6 },
    },
  },
  {
    id: 'RID102',
    name: 'Pradeep Shinde',
    zone: 'Andheri East',
    trips: 385,
    distanceKm: 1720.0,
    grossEarnings: 42350,
    bonusDays: 22,
    bonusAmount: 5500,
    attendanceDays: 29,
    totalDays: 30,
    deductions: 180.0,
    netPayout: 47670.0,
    maxTripsDay: 18,
    weekData: {
      'Week 1': { trips: 76, earnings: 8360, presentDays: 6 },
      'Week 2': { trips: 80, earnings: 8800, presentDays: 6 },
      'Week 3': { trips: 72, earnings: 7920, presentDays: 5 },
      'Week 4': { trips: 78, earnings: 8580, presentDays: 6 },
      'Week 5': { trips: 79, earnings: 8690, presentDays: 6 },
    },
  },
  {
    id: 'RID103',
    name: 'Siddharth Rao',
    zone: 'Powai Tech-Hub',
    trips: 310,
    distanceKm: 1395.2,
    grossEarnings: 32550,
    bonusDays: 14,
    bonusAmount: 3500,
    attendanceDays: 25,
    totalDays: 30,
    deductions: 450.0,
    netPayout: 35600.0,
    maxTripsDay: 15,
    weekData: {
      'Week 1': { trips: 60, earnings: 6300, presentDays: 5 },
      'Week 2': { trips: 65, earnings: 6825, presentDays: 5 },
      'Week 3': { trips: 58, earnings: 6090, presentDays: 5 },
      'Week 4': { trips: 63, earnings: 6615, presentDays: 5 },
      'Week 5': { trips: 64, earnings: 6720, presentDays: 5 },
    },
  },
  {
    id: 'RID104',
    name: 'Nikhil Kadam',
    zone: 'South Mumbai',
    trips: 395,
    distanceKm: 1890.0,
    grossEarnings: 45425,
    bonusDays: 24,
    bonusAmount: 6000,
    attendanceDays: 30,
    totalDays: 30,
    deductions: 120.0,
    netPayout: 51305.0,
    maxTripsDay: 19,
    weekData: {
      'Week 1': { trips: 78, earnings: 8970, presentDays: 6 },
      'Week 2': { trips: 82, earnings: 9430, presentDays: 6 },
      'Week 3': { trips: 75, earnings: 8625, presentDays: 6 },
      'Week 4': { trips: 80, earnings: 9200, presentDays: 6 },
      'Week 5': { trips: 80, earnings: 9200, presentDays: 6 },
    },
  },
  {
    id: 'RID105',
    name: 'Vikram Patil',
    zone: 'Bandra West',
    trips: 295,
    distanceKm: 1280.4,
    grossEarnings: 29500,
    bonusDays: 12,
    bonusAmount: 3000,
    attendanceDays: 24,
    totalDays: 30,
    deductions: 280.0,
    netPayout: 32220.0,
    maxTripsDay: 14,
    weekData: {
      'Week 1': { trips: 56, earnings: 5600, presentDays: 5 },
      'Week 2': { trips: 62, earnings: 6200, presentDays: 5 },
      'Week 3': { trips: 55, earnings: 5500, presentDays: 4 },
      'Week 4': { trips: 60, earnings: 6000, presentDays: 5 },
      'Week 5': { trips: 62, earnings: 6200, presentDays: 5 },
    },
  },
  {
    id: 'RID106',
    name: 'Rohan Mane',
    zone: 'Andheri East',
    trips: 360,
    distanceKm: 1620.0,
    grossEarnings: 37800,
    bonusDays: 19,
    bonusAmount: 4750,
    attendanceDays: 28,
    totalDays: 30,
    deductions: 210.0,
    netPayout: 42340.0,
    maxTripsDay: 17,
    weekData: {
      'Week 1': { trips: 70, earnings: 7350, presentDays: 5 },
      'Week 2': { trips: 75, earnings: 7875, presentDays: 6 },
      'Week 3': { trips: 68, earnings: 7140, presentDays: 5 },
      'Week 4': { trips: 73, earnings: 7665, presentDays: 6 },
      'Week 5': { trips: 74, earnings: 7770, presentDays: 6 },
    },
  },
  {
    id: 'RID107',
    name: 'Ganesh Jadhav',
    zone: 'Powai Tech-Hub',
    trips: 328,
    distanceKm: 1476.0,
    grossEarnings: 34440,
    bonusDays: 16,
    bonusAmount: 4000,
    attendanceDays: 26,
    totalDays: 30,
    deductions: 190.0,
    netPayout: 38250.0,
    maxTripsDay: 16,
    weekData: {
      'Week 1': { trips: 64, earnings: 6720, presentDays: 5 },
      'Week 2': { trips: 68, earnings: 7140, presentDays: 5 },
      'Week 3': { trips: 62, earnings: 6510, presentDays: 5 },
      'Week 4': { trips: 66, earnings: 6930, presentDays: 5 },
      'Week 5': { trips: 68, earnings: 7140, presentDays: 6 },
    },
  },
  {
    id: 'RID108',
    name: 'Sachin More',
    zone: 'South Mumbai',
    trips: 370,
    distanceKm: 1775.0,
    grossEarnings: 40700,
    bonusDays: 20,
    bonusAmount: 5000,
    attendanceDays: 28,
    totalDays: 30,
    deductions: 150.0,
    netPayout: 45550.0,
    maxTripsDay: 17,
    weekData: {
      'Week 1': { trips: 72, earnings: 7920, presentDays: 5 },
      'Week 2': { trips: 76, earnings: 8360, presentDays: 6 },
      'Week 3': { trips: 70, earnings: 7700, presentDays: 5 },
      'Week 4': { trips: 75, earnings: 8250, presentDays: 6 },
      'Week 5': { trips: 77, earnings: 8470, presentDays: 6 },
    },
  },
  {
    id: 'RID109',
    name: 'Aditya Deshmukh',
    zone: 'Bandra West',
    trips: 355,
    distanceKm: 1598.0,
    grossEarnings: 37275,
    bonusDays: 19,
    bonusAmount: 4750,
    attendanceDays: 28,
    totalDays: 30,
    deductions: 310.0,
    netPayout: 41715.0,
    maxTripsDay: 16,
    weekData: {
      'Week 1': { trips: 69, earnings: 7245, presentDays: 5 },
      'Week 2': { trips: 74, earnings: 7770, presentDays: 6 },
      'Week 3': { trips: 67, earnings: 7035, presentDays: 5 },
      'Week 4': { trips: 72, earnings: 7560, presentDays: 6 },
      'Week 5': { trips: 73, earnings: 7665, presentDays: 6 },
    },
  },
  {
    id: 'RID110',
    name: 'Rahul Sawant',
    zone: 'Andheri East',
    trips: 315,
    distanceKm: 1417.5,
    grossEarnings: 33075,
    bonusDays: 15,
    bonusAmount: 3750,
    attendanceDays: 25,
    totalDays: 30,
    deductions: 240.0,
    netPayout: 36585.0,
    maxTripsDay: 15,
    weekData: {
      'Week 1': { trips: 62, earnings: 6510, presentDays: 5 },
      'Week 2': { trips: 66, earnings: 6930, presentDays: 5 },
      'Week 3': { trips: 59, earnings: 6195, presentDays: 5 },
      'Week 4': { trips: 63, earnings: 6615, presentDays: 5 },
      'Week 5': { trips: 65, earnings: 6825, presentDays: 5 },
    },
  },
  {
    id: 'RID111',
    name: 'Sameer Shaikh',
    zone: 'Powai Tech-Hub',
    trips: 350,
    distanceKm: 1575.0,
    grossEarnings: 36750,
    bonusDays: 18,
    bonusAmount: 4500,
    attendanceDays: 27,
    totalDays: 30,
    deductions: 170.0,
    netPayout: 41080.0,
    maxTripsDay: 16,
    weekData: {
      'Week 1': { trips: 68, earnings: 7140, presentDays: 5 },
      'Week 2': { trips: 73, earnings: 7665, presentDays: 6 },
      'Week 3': { trips: 66, earnings: 6930, presentDays: 5 },
      'Week 4': { trips: 71, earnings: 7455, presentDays: 5 },
      'Week 5': { trips: 72, earnings: 7560, presentDays: 6 },
    },
  },
  {
    id: 'RID112',
    name: 'Omkar Bhosale',
    zone: 'South Mumbai',
    trips: 335,
    distanceKm: 1507.5,
    grossEarnings: 35175,
    bonusDays: 17,
    bonusAmount: 4250,
    attendanceDays: 26,
    totalDays: 30,
    deductions: 220.0,
    netPayout: 39205.0,
    maxTripsDay: 16,
    weekData: {
      'Week 1': { trips: 65, earnings: 6825, presentDays: 5 },
      'Week 2': { trips: 70, earnings: 7350, presentDays: 5 },
      'Week 3': { trips: 64, earnings: 6720, presentDays: 5 },
      'Week 4': { trips: 67, earnings: 7035, presentDays: 5 },
      'Week 5': { trips: 69, earnings: 7245, presentDays: 6 },
    },
  },
];

const FORMULA_DOCS = [
  {
    name: 'Rider Name & Zone Lookup',
    syntax: '=XLOOKUP(A2, Raw_Data!A:A, Raw_Data!B:B)',
    type: 'Dynamic Lookup',
    purpose: 'Automatically maps the rider profile from transactional tables without manual re-entry.',
  },
  {
    name: 'Total Completed Trips',
    syntax: '=SUMIF(Raw_Data!A:A, A2, Raw_Data!D:D)',
    type: 'Conditional Sum',
    purpose: 'Aggregates all daily completed trip counts across the entire 5-week logging period.',
  },
  {
    name: 'Gross Trip Earnings',
    syntax: '=SUMPRODUCT((Raw_Data!A$2:A$100=A2)*(Raw_Data!D$2:D$100)*(Raw_Data!F$2:F$100))',
    type: 'Matrix Multiplication',
    purpose: 'Multiplies daily trips by the specific rate per trip and calculates gross pay before deductions.',
  },
  {
    name: 'Performance Bonus Days',
    syntax: '=COUNTIFS(Raw_Data!A:A, A2, Raw_Data!G:G, "Y")',
    type: 'Multi-Condition Count',
    purpose: 'Counts high-productivity shifts where the rider completed threshold trips (11+ trips) to earn the ₹250 incentive.',
  },
  {
    name: 'Attendance Compliance Rate',
    syntax: '=COUNTIFS(Raw_Data!A:A, A2, Raw_Data!I:I, "Present") / COUNTIF(Raw_Data!A:A, A2)',
    type: 'Proportional Ratio',
    purpose: 'Divides days present by total scheduled working days to evaluate fleet reliability.',
  },
  {
    name: 'Net Final Payout',
    syntax: '=Gross_Earnings + Bonus_Payout - Deductions',
    type: 'Disbursement Math',
    purpose: 'Calculates the net disbursement amount payable after accounting for bonuses and deductions.',
  },
];

// Sample Raw Ingestion Data for '1. Raw_Data' sheet tab
const SAMPLE_RAW_DATA = [
  { date: '2026-05-01', id: 'RID101', name: 'Arjun Sharma', trips: 14, km: 62.4, rate: 100, bonus: 'Y', ded: 0, att: 'Present', zone: 'Bandra West', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID102', name: 'Pradeep Shinde', trips: 16, km: 74.0, rate: 110, bonus: 'Y', ded: 0, att: 'Present', zone: 'Andheri East', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID103', name: 'Siddharth Rao', trips: 12, km: 58.2, rate: 105, bonus: 'Y', ded: 0, att: 'Present', zone: 'Powai Tech-Hub', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID104', name: 'Nikhil Kadam', trips: 18, km: 82.5, rate: 115, bonus: 'Y', ded: 0, att: 'Present', zone: 'South Mumbai', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID105', name: 'Vikram Joshi', trips: 11, km: 52.0, rate: 95, bonus: 'Y', ded: 0, att: 'Present', zone: 'Bandra West', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID106', name: 'Amit Desai', trips: 13, km: 60.1, rate: 100, bonus: 'Y', ded: 0, att: 'Present', zone: 'Andheri East', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID107', name: 'Ganesh Patil', trips: 15, km: 68.3, rate: 105, bonus: 'Y', ded: 0, att: 'Present', zone: 'Powai Tech-Hub', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID108', name: 'Sachin More', trips: 17, km: 78.4, rate: 112, bonus: 'Y', ded: 0, att: 'Present', zone: 'South Mumbai', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID109', name: 'Rohan Sawant', trips: 10, km: 48.0, rate: 98, bonus: 'N', ded: 0, att: 'Present', zone: 'Bandra West', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID110', name: 'Mayur Tawde', trips: 12, km: 55.6, rate: 102, bonus: 'Y', ded: 0, att: 'Present', zone: 'Andheri East', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID111', name: 'Kunal Ghadge', trips: 14, km: 64.2, rate: 108, bonus: 'Y', ded: 0, att: 'Present', zone: 'Powai Tech-Hub', week: 'Week 1' },
  { date: '2026-05-01', id: 'RID112', name: 'Tanmay Salvi', trips: 15, km: 71.0, rate: 110, bonus: 'Y', ded: 0, att: 'Present', zone: 'South Mumbai', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID101', name: 'Arjun Sharma', trips: 15, km: 66.8, rate: 100, bonus: 'Y', ded: 0, att: 'Present', zone: 'Bandra West', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID102', name: 'Pradeep Shinde', trips: 17, km: 76.5, rate: 110, bonus: 'Y', ded: 0, att: 'Present', zone: 'Andheri East', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID103', name: 'Siddharth Rao', trips: 0, km: 0, rate: 0, bonus: 'N', ded: 0, att: 'Absent', zone: 'Powai Tech-Hub', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID104', name: 'Nikhil Kadam', trips: 19, km: 86.0, rate: 115, bonus: 'Y', ded: 0, att: 'Present', zone: 'South Mumbai', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID105', name: 'Vikram Joshi', trips: 12, km: 54.3, rate: 95, bonus: 'Y', ded: 0, att: 'Present', zone: 'Bandra West', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID106', name: 'Amit Desai', trips: 14, km: 62.5, rate: 100, bonus: 'Y', ded: 0, att: 'Present', zone: 'Andheri East', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID107', name: 'Ganesh Patil', trips: 13, km: 59.0, rate: 105, bonus: 'Y', ded: 0, att: 'Present', zone: 'Powai Tech-Hub', week: 'Week 1' },
  { date: '2026-05-02', id: 'RID108', name: 'Sachin More', trips: 18, km: 81.2, rate: 112, bonus: 'Y', ded: 0, att: 'Present', zone: 'South Mumbai', week: 'Week 1' },
  { date: '2026-05-03', id: 'RID101', name: 'Arjun Sharma', trips: 12, km: 54.0, rate: 100, bonus: 'Y', ded: 0, att: 'Present', zone: 'Bandra West', week: 'Week 1' },
  { date: '2026-05-03', id: 'RID102', name: 'Pradeep Shinde', trips: 15, km: 68.0, rate: 110, bonus: 'Y', ded: 0, att: 'Present', zone: 'Andheri East', week: 'Week 1' },
  { date: '2026-05-03', id: 'RID103', name: 'Siddharth Rao', trips: 14, km: 63.5, rate: 105, bonus: 'Y', ded: 0, att: 'Present', zone: 'Powai Tech-Hub', week: 'Week 1' },
  { date: '2026-05-03', id: 'RID104', name: 'Nikhil Kadam', trips: 16, km: 74.0, rate: 115, bonus: 'Y', ded: 0, att: 'Present', zone: 'South Mumbai', week: 'Week 1' },
  { date: '2026-05-03', id: 'RID105', name: 'Vikram Joshi', trips: 0, km: 0, rate: 0, bonus: 'N', ded: 0, att: 'Absent', zone: 'Bandra West', week: 'Week 1' },
];

export default function RiderOpsDashboardPage() {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedWeek, setSelectedWeek] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof RiderRecord>('netPayout');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [activeSheetTab, setActiveSheetTab] = useState<'Dashboard' | 'MIS_Summary' | 'Raw_Data' | 'AI_Insights'>('Dashboard');
  const [activeCell, setActiveCell] = useState<{ coord: string; formula: string; value: string }>({
    coord: 'B5:D7',
    formula: '=SUM(MIS_Summary!M2:M13)',
    value: '₹4,89,900',
  });
  const [selectedRiderModal, setSelectedRiderModal] = useState<RiderRecord | null>(null);

  // Top 3 Leaderboard Performers
  const topPerformers = useMemo(() => {
    return [...RIDER_DATASET].sort((a, b) => b.netPayout - a.netPayout).slice(0, 3);
  }, []);

  // 5 Operational Shift Windows
  const shiftWindows = [
    {
      name: 'Morning Essentials',
      time: '07:00 - 11:00',
      trips: 680,
      avgDuration: '18 min',
      surge: '1.1x Surge',
      category: 'Fresh Groceries',
    },
    {
      name: 'Lunch Peak Rush',
      time: '11:00 - 15:00',
      trips: 985,
      avgDuration: '24 min',
      surge: '1.4x Surge',
      category: 'Corporate Meals',
    },
    {
      name: 'Mid-Day Logistics',
      time: '15:00 - 18:00',
      trips: 510,
      avgDuration: '21 min',
      surge: '1.0x Base',
      category: 'Courier & Parcels',
    },
    {
      name: 'Dinner Surge Peak',
      time: '18:00 - 22:00',
      trips: 925,
      avgDuration: '26 min',
      surge: '1.5x Surge',
      category: 'Gourmet & Retail',
    },
    {
      name: 'Late-Night Express',
      time: '22:00 - 02:00',
      trips: 412,
      avgDuration: '16 min',
      surge: '1.3x Surge',
      category: 'Pharmacy & Snacks',
    },
  ];

  const zones = ['All', 'Bandra West', 'Andheri East', 'Powai Tech-Hub', 'South Mumbai'];
  const weeks = ['All', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

  // Filtered dataset
  const filteredRiders = useMemo(() => {
    return RIDER_DATASET.filter(r => {
      const matchZone = selectedZone === 'All' || r.zone === selectedZone;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.zone.toLowerCase().includes(q);
      return matchZone && matchSearch;
    }).sort((a, b) => {
      const valA: any = a[sortField];
      const valB: any = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [selectedZone, searchQuery, sortField, sortAsc]);

  // Aggregated KPIs based on selected week
  const kpis = useMemo(() => {
    let totalNet = 0;
    let totalTrips = 0;
    let totalGross = 0;
    let totalBonus = 0;
    let totalDaysPres = 0;
    let totalDaysLog = 0;

    filteredRiders.forEach(r => {
      if (selectedWeek === 'All') {
        totalNet += r.netPayout;
        totalTrips += r.trips;
        totalGross += r.grossEarnings;
        totalBonus += r.bonusAmount;
        totalDaysPres += r.attendanceDays;
        totalDaysLog += r.totalDays;
      } else {
        const wData = r.weekData[selectedWeek];
        if (wData) {
          totalTrips += wData.trips;
          totalGross += wData.earnings;
          totalNet += wData.earnings; // week level approximation
          totalDaysPres += wData.presentDays;
          totalDaysLog += 6;
        }
      }
    });

    const avgTripsPerRider = filteredRiders.length > 0 ? (totalTrips / filteredRiders.length).toFixed(1) : '0';
    const attendanceRate = totalDaysLog > 0 ? ((totalDaysPres / totalDaysLog) * 100).toFixed(1) : '0.0';

    return {
      totalNet: Math.round(totalNet),
      totalTrips,
      avgTripsPerRider,
      totalBonus,
      attendanceRate,
      activeRidersCount: filteredRiders.length,
    };
  }, [filteredRiders, selectedWeek]);

  // Weekly Trend Data for Pivot
  const weeklyTrend = useMemo(() => {
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'].map(w => {
      let trips = 0;
      let earnings = 0;
      let presentDays = 0;
      filteredRiders.forEach(r => {
        const d = r.weekData[w];
        if (d) {
          trips += d.trips;
          earnings += d.earnings;
          presentDays += d.presentDays;
        }
      });
      const avgTripsDay = presentDays > 0 ? (trips / presentDays).toFixed(1) : '0.0';
      return { week: w, trips, earnings, avgTripsDay };
    });
  }, [filteredRiders]);

  // Zone Breakdown for Pivot
  const zoneBreakdown = useMemo(() => {
    const map: Record<string, { trips: number; payout: number; count: number }> = {
      'Bandra West': { trips: 0, payout: 0, count: 0 },
      'Andheri East': { trips: 0, payout: 0, count: 0 },
      'Powai Tech-Hub': { trips: 0, payout: 0, count: 0 },
      'South Mumbai': { trips: 0, payout: 0, count: 0 },
    };

    RIDER_DATASET.forEach(r => {
      if (map[r.zone]) {
        map[r.zone].trips += r.trips;
        map[r.zone].payout += r.netPayout;
        map[r.zone].count += 1;
      }
    });

    return Object.entries(map).map(([zone, val]) => ({ zone, ...val }));
  }, []);

  const handleSort = (field: keyof RiderRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300">
      <Navbar />

      <main className="boxed-wrapper !max-w-[1400px] !mt-24 !mx-auto !min-h-screen border-none shadow-none bg-transparent relative pb-20">
        <Crosshair position="tl" />

        {/* ── 1. PAGE HEADER & TEMPLATE DOWNLOAD CTA ── */}
        <section className="pt-6 pb-8 px-4 sm:px-6 border-b border-[var(--border)] mb-8">
          <div className="max-w-[1340px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[length:var(--text-small)] px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider bg-emerald-500/15 text-[#107C41] dark:text-emerald-400 border border-emerald-500/30">
                    Microsoft Excel MIS Dashboard
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)] dark:text-zinc-300" style={{ color: 'var(--muted)' }}>
                    Mumbai Hyperlocal Fleet Operations
                  </span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 text-[var(--text)] dark:text-white"
                  style={{ color: 'var(--text)' }}
                >
                  Hyperlocal Fleet Operations &amp; Rider MIS Dashboard
                </h1>
                <p
                  className="text-xs sm:text-sm max-w-3xl leading-relaxed text-[var(--muted)] dark:text-zinc-300"
                  style={{ color: 'var(--muted)' }}
                >
                  Interactive Microsoft Excel MIS Workbook replica. Engineered with automated formula auditing
                  (<span className="font-mono text-[#107C41] dark:text-emerald-400 font-semibold text-xs">SUMIF</span>, <span className="font-mono text-[#107C41] dark:text-emerald-400 font-semibold text-xs">SUMPRODUCT</span>, <span className="font-mono text-[#107C41] dark:text-emerald-400 font-semibold text-xs">XLOOKUP</span>, <span className="font-mono text-[#107C41] dark:text-emerald-400 font-semibold text-xs">COUNTIFS</span>), interactive PivotTables, dynamic Slicers, and automated Net Bank payout reconciliation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/templates/Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx"
                  download="Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-white bg-[#107C41] hover:bg-[#0E6B37] transition-colors shadow-sm cursor-pointer"
                  style={{ textDecoration: 'none' }}
                >
                  <FileSpreadsheet size={15} />
                  <span>Download Excel File (.xlsx)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedZone('All');
                    setSelectedWeek('All');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded text-xs font-medium bg-[var(--surface2)] hover:bg-[var(--surface)] border border-[var(--border)] transition-colors cursor-pointer"
                  style={{ color: 'var(--text)' }}
                >
                  <RotateCcw size={13} />
                  <span>Reset Slicers</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. AUTHENTIC MICROSOFT EXCEL WORKBOOK VIEWER ── */}
        <section className="px-3 sm:px-6">
          <div className="max-w-[1340px] mx-auto">
            
            {/* The Excel Application Frame */}
            <div className="bg-white rounded border border-[#CBD5E1] shadow-2xl overflow-hidden font-sans text-slate-900">
              
              {/* Excel Green Ribbon Title Bar */}
              <div className="bg-[#107C41] text-white px-3 sm:px-4 py-2 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 bg-white text-[#107C41] font-bold rounded flex items-center justify-center text-xs shadow-sm">
                    X
                  </div>
                  <span className="font-semibold">AutoSave [ON]</span>
                  <span className="text-emerald-200">|</span>
                  <span className="font-medium text-emerald-50 truncate max-w-[280px] sm:max-w-none">
                    Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx - Excel
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-100 text-[length:var(--text-small)] hidden md:inline">
                    Interactive Grid: Click any KPI or cell to inspect active formula
                  </span>
                  <a
                    href="/templates/Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx"
                    download="Hyperlocal_Fleet_Ops_MIS_Dashboard_Template.xlsx"
                    className="px-2.5 py-1 rounded bg-white text-[#107C41] font-bold text-xs hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 shadow-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    <Download size={12} />
                    <span>Download .XLSX</span>
                  </a>
                </div>
              </div>

              {/* Excel Menu Ribbon Bar */}
              <div className="bg-[#F3F2F1] border-b border-[#CBD5E1] px-3 py-1 flex items-center gap-4 text-xs text-slate-700 select-none">
                <span className="px-2 py-0.5 rounded font-semibold hover:bg-slate-200 cursor-pointer">File</span>
                <span className="px-2 py-0.5 rounded font-semibold bg-white text-[#107C41] border-b-2 border-[#107C41] shadow-xs cursor-pointer">Home</span>
                <span className="px-2 py-0.5 rounded font-medium hover:bg-slate-200 cursor-pointer">Insert</span>
                <span className="px-2 py-0.5 rounded font-medium hover:bg-slate-200 cursor-pointer">Page Layout</span>
                <span className="px-2 py-0.5 rounded font-medium hover:bg-slate-200 cursor-pointer">Formulas</span>
                <span className="px-2 py-0.5 rounded font-medium hover:bg-slate-200 cursor-pointer">Data</span>
                <span className="px-2 py-0.5 rounded font-medium hover:bg-slate-200 cursor-pointer">Review</span>
                <span className="px-2 py-0.5 rounded font-medium hover:bg-slate-200 cursor-pointer">View</span>
              </div>

              {/* Excel Formula Bar */}
              <div className="bg-[#F8FAFC] border-b border-[#CBD5E1] px-3 py-1.5 flex items-center gap-2 text-xs">
                {/* Active Cell Coord (Name Box) */}
                <div className="px-2.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-slate-800 font-mono text-xs font-bold min-w-[75px] text-center shadow-xs">
                  {activeCell.coord}
                </div>
                <div className="flex items-center text-slate-400 gap-1 px-1">
                  <span className="hover:text-slate-700 cursor-pointer">✕</span>
                  <span className="hover:text-slate-700 cursor-pointer">✓</span>
                </div>
                {/* Function Icon */}
                <div className="text-slate-500 font-serif italic font-bold text-sm select-none px-1">
                  fx
                </div>
                {/* Formula Field */}
                <div className="flex-1 px-3 py-1 bg-white border border-[#CBD5E1] rounded text-slate-900 font-mono text-xs overflow-x-auto whitespace-nowrap shadow-xs flex items-center justify-between">
                  <span>{activeCell.formula}</span>
                  {activeCell.value && (
                    <span className="text-slate-400 font-sans text-[length:var(--text-small)] ml-4 font-normal">
                      Result: <strong className="text-slate-800">{activeCell.value}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Excel Slicers Bar */}
              <div className="bg-[#F1F5F9] border-b border-[#CBD5E1] px-3 sm:px-5 py-2.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Zone Slicer */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Filter size={13} className="text-[#1F4E78]" />
                      <span>Hub Zone:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {zones.map(z => {
                        const isSel = selectedZone === z;
                        return (
                          <button
                            key={z}
                            type="button"
                            onClick={() => setSelectedZone(z)}
                            className={`px-2.5 py-0.5 text-xs rounded transition-all cursor-pointer ${
                              isSel
                                ? 'bg-[#1F4E78] text-white font-bold border border-[#163857] shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 font-normal'
                            }`}
                          >
                            {z}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Week Slicer */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Calendar size={13} className="text-[#1F4E78]" />
                      <span>Period:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {weeks.map(w => {
                        const isSel = selectedWeek === w;
                        return (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSelectedWeek(w)}
                            className={`px-2.5 py-0.5 text-xs rounded transition-all cursor-pointer ${
                              isSel
                                ? 'bg-[#1F4E78] text-white font-bold border border-[#163857] shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 font-normal'
                            }`}
                          >
                            {w}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Search Slicer Filter */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search rider..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8 pr-2.5 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1F4E78] w-[140px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── EXCEL SPREADSHEET CANVAS ── */}
              <div className="bg-white overflow-x-auto min-h-[550px]">
                
                {/* Excel Column Headers Row */}
                <div className="flex border-b border-[#CBD5E1] bg-[#F2F4F8] text-[length:var(--text-small)] font-semibold text-slate-600 select-none min-w-[950px]">
                  <div className="w-10 border-r border-[#CBD5E1] py-1 text-center bg-[#E5E9F0] text-slate-500 flex items-center justify-center">
                    <span className="text-[length:var(--text-small)]">◢</span>
                  </div>
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'].map((col) => (
                    <div key={col} className="flex-1 py-1 text-center border-r border-[#CBD5E1] font-mono text-[length:var(--text-small)]">
                      {col}
                    </div>
                  ))}
                </div>

                <div className="p-6 sm:p-8 md:p-10 bg-white min-w-[950px] space-y-12">
                
                {/* ════ TAB 1: 3. DASHBOARD SHEET ════ */}
                {activeSheetTab === 'Dashboard' && (
                  <div className="space-y-12 sm:space-y-14 max-w-[1240px] mx-auto">
                    
                    {/* Dashboard Merged Title Banner (B2:P3) */}
                    <div
                      onClick={() => setActiveCell({ coord: 'B2:P3', formula: '="METRO HYPERLOCAL EXPRESS — RIDER OPERATIONS MIS DASHBOARD"', value: 'Dashboard Title' })}
                      className="bg-[#1F4E78] text-white p-6 sm:p-7 rounded-none border border-[#163857] shadow-sm cursor-pointer hover:brightness-105 transition-all select-none relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-[length:var(--text-small)] uppercase tracking-wider text-blue-200 font-semibold font-mono">
                          MANAGEMENT INFORMATION SYSTEM (MIS) COCKPIT — MUMBAI REGION
                        </div>
                        <span className="font-mono text-[length:var(--text-small)] text-blue-200 bg-white/15 px-2 py-0.5 rounded border border-white/20 hidden sm:inline-block">
                          Cells B2:P3
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-1">
                        METRO HYPERLOCAL EXPRESS — FLEET OPERATIONS &amp; RIDER MIS DASHBOARD
                      </div>
                      <div className="text-xs text-blue-100 mt-2 flex flex-wrap items-center gap-2">
                        <span>Fulfillment Velocity, Incentive Auditing &amp; Net Bank Reconciliation</span>
                        <span>•</span>
                        <span>Multi-Hub Operations</span>
                        <span>•</span>
                        <span className="text-emerald-300 font-semibold">Live MIS Engine</span>
                      </div>
                    </div>

                    {/* ── 5 EXECUTIVE EXCEL KPI CARDS (PREMIUM FINANCIAL STYLING) ── */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[length:var(--text-small)] text-slate-700">
                          <Activity size={14} className="text-[#1F4E78]" />
                          Executive Financial &amp; Operational Metrics
                        </span>
                        <span className="font-mono text-[length:var(--text-small)] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Cells B6:P7 • Auto-Aggregated
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                        {[
                          {
                            id: 'netPayout',
                            coord: 'B6:D7',
                            label: 'TOTAL NET PAYOUT',
                            value: formatIndianCurrency(kpis.totalNet),
                            formula: '=SUM(MIS_Summary!M2:M13)',
                            badge: '✓ 100% Reconciled',
                            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
                            sub: `Disbursed to ${kpis.activeRidersCount} active riders`,
                          },
                          {
                            id: 'trips',
                            coord: 'E6:G7',
                            label: 'COMPLETED TRIPS',
                            value: formatIndianNum(kpis.totalTrips),
                            formula: '=SUM(MIS_Summary!D2:D13)',
                            badge: '▲ 103.5% vs SLA',
                            badgeClass: 'bg-blue-50 text-[#1F4E78] border-blue-300/80',
                            sub: '4,000 monthly baseline',
                          },
                          {
                            id: 'avgTrips',
                            coord: 'H6:J7',
                            label: 'AVG TRIPS / RIDER',
                            value: kpis.avgTripsPerRider,
                            formula: '=AVERAGE(MIS_Summary!D2:D13)',
                            badge: '⚡ 11.5 / Active Day',
                            badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300/80',
                            sub: 'Daily productivity average',
                          },
                          {
                            id: 'bonus',
                            coord: 'K6:M7',
                            label: 'BONUS PAYOUTS',
                            value: formatIndianCurrency(kpis.totalBonus),
                            formula: '=SUM(MIS_Summary!H2:H13)',
                            badge: '★ 214 High Shifts',
                            badgeClass: 'bg-amber-50 text-amber-900 border-amber-300/80',
                            sub: '₹250 / 11+ trip target shift',
                          },
                          {
                            id: 'attendance',
                            coord: 'N6:P7',
                            label: 'ATTENDANCE RATE',
                            value: `${kpis.attendanceRate}%`,
                            formula: '=AVERAGE(MIS_Summary!K2:K13)',
                            badge: '● 268 / 300 Shifts',
                            badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
                            sub: 'Scheduled fleet adherence',
                          },
                        ].map((card) => {
                          const isSelected = activeCell.coord === card.coord;
                          return (
                            <div
                              key={card.id}
                              onClick={() => setActiveCell({ coord: card.coord, formula: card.formula, value: card.value })}
                              className={`border rounded-sm overflow-hidden cursor-pointer bg-white transition-all select-none relative shadow-[0_2px_10px_rgba(31,78,120,0.06)] hover:shadow-lg hover:-translate-y-0.5 ${
                                isSelected ? 'ring-2 ring-[#107C41] border-[#107C41] shadow-lg' : 'border-[#CBD5E1] hover:border-[#1F4E78]'
                              }`}
                            >
                              {/* Card Header with subtle cell coordinate */}
                              <div className="bg-[#F8FAFD] border-b border-[#E2E8F0] px-3.5 py-2 flex items-center justify-between">
                                <span className="text-[length:var(--text-small)] font-bold uppercase tracking-wider text-[#1F4E78] truncate">
                                  {card.label}
                                </span>
                                <span className="font-mono text-[length:var(--text-small)] text-slate-500 font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                                  {card.coord}
                                </span>
                              </div>

                              {/* Card Body with Premium Typography & Status Badge */}
                              <div className="p-4 sm:p-5 text-center bg-gradient-to-b from-white to-[#FAFBFD] flex flex-col justify-center items-center min-h-[105px]">
                                <div className="text-2xl sm:text-[1.8rem] font-extrabold text-[#0F2C59] font-sans tracking-tight leading-none mb-2.5">
                                  {card.value}
                                </div>
                                <span className={`inline-flex items-center gap-1 text-[length:var(--text-small)] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs mb-2 ${card.badgeClass}`}>
                                  {card.badge}
                                </span>
                                <div className="text-[length:var(--text-small)] text-slate-500 font-medium leading-tight">
                                  {card.sub}
                                </div>
                              </div>

                              {/* Active Excel Cell Fill Handle Indicator */}
                              {isSelected && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#107C41]" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── SECTION 1: SIDE-BY-SIDE CLASSIC EXCEL PIVOT TABLES ── */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[length:var(--text-small)] text-slate-700">
                          <BarChart3 size={14} className="text-[#1F4E78]" />
                          Pivot Analysis: Weekly Performance &amp; Hub Zone Allocations
                        </span>
                        <span className="font-mono text-[length:var(--text-small)] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Cells B9:P15 • Formula Slicers Linked
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                        
                        {/* Pivot Table 1: Weekly Performance Trend */}
                        <div className="border border-[#CBD5E1] rounded-none overflow-hidden shadow-xs bg-white">
                          <div className="bg-[#1F4E78] text-white px-4 py-3 text-xs font-bold flex items-center justify-between">
                            <span className="tracking-wide">Weekly Performance Pivot Table</span>
                            <span className="font-mono text-[length:var(--text-small)] bg-white/20 px-2 py-0.5 rounded font-normal">SUMIF / PIVOT</span>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F2F5F9] border-b border-[#CBD5E1] font-bold text-slate-700 text-[length:var(--text-small)]">
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Week</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Trips Completed</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Gross Earnings</th>
                                <th className="py-3 px-4 text-right">Avg Trips/Day</th>
                              </tr>
                            </thead>
                            <tbody>
                              {weeklyTrend.map((w, idx) => (
                                <tr
                                  key={w.week}
                                  onClick={() => setActiveCell({ coord: `B${10 + idx}`, formula: `=SUMIF(Raw_Data!J:J, "${w.week}", Raw_Data!D:D)`, value: `${w.trips} Trips` })}
                                  className={`border-b border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                  }`}
                                >
                                  <td className="py-3 px-4 font-semibold text-slate-800 border-r border-[#CBD5E1]">{w.week}</td>
                                  <td className="py-3 px-4 text-right text-slate-800 border-r border-[#CBD5E1] font-medium">{formatIndianNum(w.trips)}</td>
                                  <td className="py-3 px-4 text-right text-slate-800 border-r border-[#CBD5E1] font-medium">{formatIndianCurrency(w.earnings)}</td>
                                  <td className="py-3 px-4 text-right text-slate-700">{w.avgTripsDay}</td>
                                </tr>
                              ))}
                              {/* Grand Total Row with Accounting Double Underline */}
                              <tr
                                onClick={() => setActiveCell({ coord: 'B15', formula: '=SUM(C10:C14)', value: formatIndianNum(kpis.totalTrips) })}
                                className="bg-[#EDF2F8] font-bold cursor-pointer"
                                style={{ borderTop: '1px solid #000000', borderBottom: '3px double #000000' }}
                              >
                                <td className="py-3 px-4 text-slate-900 border-r border-[#CBD5E1]">GRAND TOTAL</td>
                                <td className="py-3 px-4 text-right text-slate-900 border-r border-[#CBD5E1]">{formatIndianNum(kpis.totalTrips)}</td>
                                <td className="py-3 px-4 text-right text-slate-900 border-r border-[#CBD5E1]">{formatIndianCurrency(weeklyTrend.reduce((a, b) => a + b.earnings, 0))}</td>
                                <td className="py-3 px-4 text-right text-slate-900">11.5</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Pivot Table 2: Hub Zone Allocation */}
                        <div className="border border-[#CBD5E1] rounded-none overflow-hidden shadow-xs bg-white">
                          <div className="bg-[#1F4E78] text-white px-4 py-3 text-xs font-bold flex items-center justify-between">
                            <span className="tracking-wide">Hub Zone Allocation Pivot Table</span>
                            <span className="font-mono text-[length:var(--text-small)] bg-white/20 px-2 py-0.5 rounded font-normal">SUMPRODUCT</span>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F2F5F9] border-b border-[#CBD5E1] font-bold text-slate-700 text-[length:var(--text-small)]">
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Hub Zone</th>
                                <th className="py-3 px-4 text-center border-r border-[#CBD5E1]">Riders</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Completed Trips</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Total Net Payout</th>
                                <th className="py-3 px-4 text-center">SLA Compliance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {zoneBreakdown.map((z, idx) => (
                                <tr
                                  key={z.zone}
                                  onClick={() => setActiveCell({ coord: `G${10 + idx}`, formula: `=SUMIF(MIS_Summary!C:C, "${z.zone}", MIS_Summary!M:M)`, value: formatIndianCurrency(z.payout) })}
                                  className={`border-b border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                  }`}
                                >
                                  <td className="py-3 px-4 font-semibold text-slate-800 border-r border-[#CBD5E1]">{z.zone}</td>
                                  <td className="py-3 px-4 text-center text-slate-700 border-r border-[#CBD5E1]">{z.count}</td>
                                  <td className="py-3 px-4 text-right text-slate-800 border-r border-[#CBD5E1] font-medium">{formatIndianNum(z.trips)}</td>
                                  <td className="py-3 px-4 text-right text-[#1F4E78] border-r border-[#CBD5E1] font-bold">{formatIndianCurrency(z.payout)}</td>
                                  <td className="py-3 px-4 text-center text-emerald-700 font-semibold">100%</td>
                                </tr>
                              ))}
                              {/* Grand Total Row */}
                              <tr
                                onClick={() => setActiveCell({ coord: 'G14', formula: '=SUM(J10:J13)', value: formatIndianCurrency(kpis.totalNet) })}
                                className="bg-[#F2F5F9] font-bold cursor-pointer"
                                style={{ borderTop: '1px solid #000000', borderBottom: '3px double #000000' }}
                              >
                                <td className="py-3 px-4 text-slate-900 border-r border-[#CBD5E1]">GRAND TOTAL</td>
                                <td className="py-3 px-4 text-center text-slate-900 border-r border-[#CBD5E1]">{kpis.activeRidersCount}</td>
                                <td className="py-3 px-4 text-right text-slate-900 border-r border-[#CBD5E1]">{formatIndianNum(kpis.totalTrips)}</td>
                                <td className="py-3 px-4 text-right text-[#1F4E78] border-r border-[#CBD5E1]">{formatIndianCurrency(kpis.totalNet)}</td>
                                <td className="py-3 px-4 text-center text-emerald-800">100%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>

                    {/* ── SECTION 2: SHIFT DYNAMICS & TOP PERFORMERS SCORECARD ── */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[length:var(--text-small)] text-slate-700">
                          <Trophy size={14} className="text-[#1F4E78]" />
                          Operational Shift Dynamics &amp; Top Earners Leaderboard
                        </span>
                        <span className="font-mono text-[length:var(--text-small)] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Cells B17:P23 • 24-Hour MIS
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                        
                        {/* Table 3: Shift Demand & Surge Matrix */}
                        <div className="border border-[#CBD5E1] rounded-none overflow-hidden shadow-xs bg-white">
                          <div className="bg-[#1F4E78] text-white px-4 py-3 text-xs font-bold flex items-center justify-between">
                            <span className="tracking-wide">Operational Shifts &amp; Surge Multiplier</span>
                            <span className="font-mono text-[length:var(--text-small)] bg-white/20 px-2 py-0.5 rounded font-normal">24-HOUR MIS</span>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8F9FA] border-b border-[#CBD5E1] font-bold text-slate-700 text-[length:var(--text-small)]">
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Operating Shift</th>
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Active Hours</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Total Orders</th>
                                <th className="py-3 px-4 text-center border-r border-[#CBD5E1]">Avg SLA</th>
                                <th className="py-3 px-4 text-center">Surge Multiplier</th>
                              </tr>
                            </thead>
                            <tbody>
                              {shiftWindows.map((s, idx) => (
                                <tr
                                  key={s.name}
                                  onClick={() => setActiveCell({ coord: `B${18 + idx}`, formula: `="Shift: ${s.name} | Orders: ${s.trips}"`, value: s.surge })}
                                  className={`border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors ${
                                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                  }`}
                                >
                                  <td className="py-3 px-4 font-semibold text-slate-800 border-r border-[#CBD5E1]">{s.name}</td>
                                  <td className="py-3 px-4 text-slate-600 border-r border-[#CBD5E1] font-mono text-[length:var(--text-small)]">{s.time}</td>
                                  <td className="py-3 px-4 text-right text-slate-800 border-r border-[#CBD5E1] font-medium">{formatIndianNum(s.trips)}</td>
                                  <td className="py-3 px-4 text-center text-slate-700 border-r border-[#CBD5E1]">{s.avgDuration}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[length:var(--text-small)] font-semibold ${
                                      s.surge.includes('1.4x') || s.surge.includes('1.5x')
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                                    }`}>
                                      {s.surge}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Table 4: Top 3 Fleet Performers (Leaderboard) */}
                        <div className="border border-[#CBD5E1] rounded-none overflow-hidden shadow-xs bg-white">
                          <div className="bg-[#1F4E78] text-white px-4 py-3 text-xs font-bold flex items-center justify-between">
                            <span className="tracking-wide">Top 3 Fleet Operations Earners</span>
                            <span className="font-mono text-[length:var(--text-small)] bg-white/20 px-2 py-0.5 rounded font-normal">AUDIT SCORECARD</span>
                          </div>
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F2F5F9] border-b border-[#CBD5E1] font-bold text-slate-700 text-[length:var(--text-small)]">
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Rank</th>
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Rider Name</th>
                                <th className="py-3 px-4 border-r border-[#CBD5E1]">Hub Zone</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Trips</th>
                                <th className="py-3 px-4 text-right border-r border-[#CBD5E1]">Net Payout</th>
                                <th className="py-3 px-4 text-center">Scorecard</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topPerformers.map((r, rank) => {
                                const rankLabel = rank === 0 ? '1st — Gold' : rank === 1 ? '2nd — Silver' : '3rd — Bronze';
                                const rankBg = rank === 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : rank === 1 ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-orange-100 text-orange-900 border-orange-300';
                                return (
                                  <tr
                                    key={r.id}
                                    onClick={() => setSelectedRiderModal(r)}
                                    className={`border-b border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                                      rank % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                    }`}
                                  >
                                    <td className="py-3 px-4 border-r border-[#CBD5E1]">
                                      <span className={`px-2 py-0.5 rounded text-[length:var(--text-small)] font-bold border ${rankBg}`}>
                                        {rankLabel}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-slate-800 border-r border-[#CBD5E1]">
                                      {r.name} <span className="font-mono text-[length:var(--text-small)] text-slate-500 font-normal">({r.id})</span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-700 border-r border-[#CBD5E1]">{r.zone}</td>
                                    <td className="py-3 px-4 text-right text-slate-800 font-medium border-r border-[#CBD5E1]">{r.trips}</td>
                                    <td className="py-3 px-4 text-right font-bold text-[#1F4E78] border-r border-[#CBD5E1]">
                                      {formatIndianCurrency(r.netPayout)}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedRiderModal(r);
                                        }}
                                        className="px-2.5 py-1 text-[length:var(--text-small)] font-semibold text-[#1F4E78] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded cursor-pointer transition-colors"
                                      >
                                        Inspect
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>

                    {/* ── SECTION 3: FLEET OPERATIONS MASTER LEDGER TABLE ── */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[length:var(--text-small)] text-slate-700">
                          <ShieldCheck size={14} className="text-[#1F4E78]" />
                          Fleet Operations Master Ledger (Table_Rider_MIS)
                        </span>
                        <span className="font-mono text-[length:var(--text-small)] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Cells A25:M38 • Full Bank Reconciliation
                        </span>
                      </div>

                      <div className="border border-[#CBD5E1] rounded-none overflow-hidden shadow-xs bg-white">
                        <div className="bg-[#1F4E78] text-white px-4 py-3 text-xs font-bold flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="tracking-wide">Master Rider Ledger &amp; Payout Audit</span>
                            <span className="font-normal text-blue-200 text-[length:var(--text-small)] hidden sm:inline">
                              • Click column header to sort • All calculations formula-driven
                            </span>
                          </div>
                          <span className="font-mono text-[length:var(--text-small)] bg-white/20 px-2.5 py-0.5 rounded font-normal">
                            Showing {filteredRiders.length} of {RIDER_DATASET.length} Riders
                          </span>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F2F5F9] border-b-2 border-[#1F4E78] font-bold text-slate-800 text-[length:var(--text-small)]">
                                <th className="py-3 px-3.5 cursor-pointer border-r border-[#CBD5E1]" onClick={() => handleSort('id')}>
                                  <div className="flex items-center gap-1">Rider_ID <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer border-r border-[#CBD5E1]" onClick={() => handleSort('name')}>
                                  <div className="flex items-center gap-1">Rider_Name <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer border-r border-[#CBD5E1]" onClick={() => handleSort('zone')}>
                                  <div className="flex items-center gap-1">Hub_Zone <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('trips')}>
                                  <div className="flex items-center justify-end gap-1">Completed_Trips <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('distanceKm')}>
                                  <div className="flex items-center justify-end gap-1">Distance_KM <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('grossEarnings')}>
                                  <div className="flex items-center justify-end gap-1">Gross_Pay <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('bonusAmount')}>
                                  <div className="flex items-center justify-end gap-1">Bonus_Pay <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('deductions')}>
                                  <div className="flex items-center justify-end gap-1">Deductions <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('attendanceDays')}>
                                  <div className="flex items-center justify-end gap-1">Attendance_% <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 cursor-pointer text-right border-r border-[#CBD5E1]" onClick={() => handleSort('netPayout')}>
                                  <div className="flex items-center justify-end gap-1">Net_Payout <ArrowUpDown size={11} className="text-slate-400" /></div>
                                </th>
                                <th className="py-3 px-3.5 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredRiders.map((r, idx) => {
                                const attRate = ((r.attendanceDays / r.totalDays) * 100).toFixed(0);
                                return (
                                  <tr
                                    key={r.id}
                                    onClick={() => setActiveCell({ coord: `M${2 + idx}`, formula: `=F${2 + idx}+H${2 + idx}-L${2 + idx}`, value: formatIndianCurrency(r.netPayout) })}
                                    className={`border-b border-[#E2E8F0] cursor-pointer hover:bg-blue-50 transition-colors ${
                                      idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                                    }`}
                                  >
                                    <td className="py-3 px-3.5 font-mono font-semibold text-blue-700 border-r border-[#CBD5E1]">{r.id}</td>
                                    <td className="py-3 px-3.5 font-bold text-slate-800 border-r border-[#CBD5E1]">{r.name}</td>
                                    <td className="py-3 px-3.5 text-slate-600 border-r border-[#CBD5E1]">{r.zone}</td>
                                    <td className="py-3 px-3.5 text-right font-medium text-slate-800 border-r border-[#CBD5E1]">{r.trips}</td>
                                    <td className="py-3 px-3.5 text-right text-slate-600 border-r border-[#CBD5E1]">{r.distanceKm.toFixed(1)}</td>
                                    <td className="py-3 px-3.5 text-right text-slate-800 border-r border-[#CBD5E1]">{formatIndianCurrency(r.grossEarnings)}</td>
                                    <td className="py-3 px-3.5 text-right text-amber-700 font-medium border-r border-[#CBD5E1]">{formatIndianCurrency(r.bonusAmount)}</td>
                                    <td className="py-3 px-3.5 text-right text-rose-600 border-r border-[#CBD5E1]">
                                      {r.deductions > 0 ? `-₹${r.deductions.toFixed(0)}` : '₹0'}
                                    </td>
                                    <td className="py-3 px-3.5 text-right border-r border-[#CBD5E1]">
                                      <span className={`px-2 py-0.5 rounded text-[length:var(--text-small)] font-semibold ${
                                        Number(attRate) >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                      }`}>
                                        {attRate}% ({r.attendanceDays}/{r.totalDays}d)
                                      </span>
                                    </td>
                                    <td className="py-3 px-3.5 text-right font-bold text-[#1F4E78] border-r border-[#CBD5E1]">
                                      {formatIndianCurrency(r.netPayout, 1)}
                                    </td>
                                    <td className="py-3 px-3.5 text-center">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedRiderModal(r);
                                        }}
                                        className="px-2.5 py-1 text-[length:var(--text-small)] font-semibold text-[#1F4E78] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded cursor-pointer transition-colors"
                                      >
                                        Inspect
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                              {/* Grand Total Row */}
                              <tr
                                onClick={() => setActiveCell({ coord: 'A14:M14', formula: '=SUM(M2:M13)', value: formatIndianCurrency(kpis.totalNet) })}
                                className="bg-[#EDF2F8] font-bold cursor-pointer"
                                style={{ borderTop: '2px solid #000000', borderBottom: '3px double #000000' }}
                              >
                                <td className="py-3.5 px-3.5 text-slate-900 border-r border-[#CBD5E1]">GRAND TOTAL</td>
                                <td className="py-3.5 px-3.5 text-slate-700 border-r border-[#CBD5E1]">{filteredRiders.length} Riders</td>
                                <td className="py-3.5 px-3.5 text-slate-600 border-r border-[#CBD5E1]">—</td>
                                <td className="py-3.5 px-3.5 text-right text-slate-900 border-r border-[#CBD5E1]">{formatIndianNum(kpis.totalTrips)}</td>
                                <td className="py-3.5 px-3.5 text-right text-slate-900 border-r border-[#CBD5E1]">
                                  {filteredRiders.reduce((a, b) => a + b.distanceKm, 0).toFixed(1)} km
                                </td>
                                <td className="py-3.5 px-3.5 text-right text-slate-900 border-r border-[#CBD5E1]">
                                  {formatIndianCurrency(filteredRiders.reduce((a, b) => a + b.grossEarnings, 0))}
                                </td>
                                <td className="py-3.5 px-3.5 text-right text-amber-800 border-r border-[#CBD5E1]">{formatIndianCurrency(kpis.totalBonus)}</td>
                                <td className="py-3.5 px-3.5 text-right text-rose-700 border-r border-[#CBD5E1]">
                                  -₹{filteredRiders.reduce((a, b) => a + b.deductions, 0).toFixed(0)}
                                </td>
                                <td className="py-3.5 px-3.5 text-right border-r border-[#CBD5E1] text-emerald-800">{kpis.attendanceRate}%</td>
                                <td className="py-3.5 px-3.5 text-right font-bold text-[#1F4E78] border-r border-[#CBD5E1]">
                                  {formatIndianCurrency(kpis.totalNet, 1)}
                                </td>
                                <td className="py-3.5 px-3.5 text-center text-slate-500">—</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* ════ TAB 2: 2. MIS_SUMMARY SHEET ════ */}
                {activeSheetTab === 'MIS_Summary' && (
                  <div className="space-y-4 max-w-[1200px] mx-auto">
                    <div className="bg-[#1F4E78] text-white p-3 rounded text-xs">
                      <div className="font-bold text-sm">Sheet: 2. MIS_Summary (Calculation Engine)</div>
                      <div className="text-blue-100 text-[length:var(--text-small)] mt-0.5">
                        Dynamic row-by-rider calculation table with XLOOKUP, SUMPRODUCT, SUMIF, COUNTIFS, and IFERROR without hardcoded numbers.
                      </div>
                    </div>

                    <div className="border border-[#CBD5E1] rounded overflow-x-auto shadow-sm">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F2F5F9] border-b-2 border-[#1F4E78] font-bold text-slate-800 text-[length:var(--text-small)]">
                            <th className="p-2 border-r border-[#CBD5E1]">Col A: ID</th>
                            <th className="p-2 border-r border-[#CBD5E1]">Col B: Rider [XLOOKUP]</th>
                            <th className="p-2 border-r border-[#CBD5E1]">Col C: Zone [XLOOKUP]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col D: Trips [SUMIF]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col E: KM [SUMIF]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col F: Gross [SUMPRODUCT]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col G: Bonus Days [COUNTIFS]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col H: Bonus Pay [G*250]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col I: Present [COUNTIFS]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col K: Attendance [I/J]</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Col L: Deductions [SUMIF]</th>
                            <th className="p-2 text-right">Col M: Net Payout [F+H-L]</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RIDER_DATASET.map((r, idx) => (
                            <tr
                              key={r.id}
                              onClick={() => setActiveCell({ coord: `M${2 + idx}`, formula: `=F${2 + idx}+H${2 + idx}-L${2 + idx}`, value: formatIndianCurrency(r.netPayout) })}
                              className={`border-b border-[#E2E8F0] cursor-pointer hover:bg-blue-50 transition-colors ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                              }`}
                            >
                              <td className="p-2 font-mono font-bold text-blue-700 border-r border-[#CBD5E1]">{r.id}</td>
                              <td className="p-2 font-medium text-slate-800 border-r border-[#CBD5E1]">{r.name}</td>
                              <td className="p-2 text-slate-600 border-r border-[#CBD5E1]">{r.zone}</td>
                              <td className="p-2 text-right text-slate-800 border-r border-[#CBD5E1]">{r.trips}</td>
                              <td className="p-2 text-right text-slate-600 border-r border-[#CBD5E1]">{r.distanceKm.toFixed(1)}</td>
                              <td className="p-2 text-right text-slate-800 border-r border-[#CBD5E1]">{formatIndianCurrency(r.grossEarnings)}</td>
                              <td className="p-2 text-right text-slate-700 border-r border-[#CBD5E1]">{r.bonusDays}</td>
                              <td className="p-2 text-right text-amber-700 border-r border-[#CBD5E1]">{formatIndianCurrency(r.bonusAmount)}</td>
                              <td className="p-2 text-right text-slate-700 border-r border-[#CBD5E1]">{r.attendanceDays}</td>
                              <td className="p-2 text-right text-emerald-700 border-r border-[#CBD5E1]">{((r.attendanceDays / r.totalDays) * 100).toFixed(1)}%</td>
                              <td className="p-2 text-right text-rose-600 border-r border-[#CBD5E1]">₹{r.deductions.toFixed(0)}</td>
                              <td className="p-2 text-right font-bold text-[#1F4E78]">{formatIndianCurrency(r.netPayout, 1)}</td>
                            </tr>
                          ))}
                          <tr
                            className="bg-[#EDF2F8] font-bold"
                            style={{ borderTop: '2px solid #000000', borderBottom: '3px double #000000' }}
                          >
                            <td className="p-2 text-slate-900 border-r border-[#CBD5E1]">GRAND TOTAL</td>
                            <td className="p-2 text-slate-600 border-r border-[#CBD5E1]">—</td>
                            <td className="p-2 text-slate-600 border-r border-[#CBD5E1]">—</td>
                            <td className="p-2 text-right text-slate-900 border-r border-[#CBD5E1]">=SUM(D2:D13)</td>
                            <td className="p-2 text-right text-slate-900 border-r border-[#CBD5E1]">=SUM(E2:E13)</td>
                            <td className="p-2 text-right text-slate-900 border-r border-[#CBD5E1]">=SUM(F2:F13)</td>
                            <td className="p-2 text-right text-slate-900 border-r border-[#CBD5E1]">=SUM(G2:G13)</td>
                            <td className="p-2 text-right text-amber-800 border-r border-[#CBD5E1]">=SUM(H2:H13)</td>
                            <td className="p-2 text-right text-slate-900 border-r border-[#CBD5E1]">=SUM(I2:I13)</td>
                            <td className="p-2 text-right text-emerald-800 border-r border-[#CBD5E1]">=AVERAGE(K2:K13)</td>
                            <td className="p-2 text-right text-rose-700 border-r border-[#CBD5E1]">=SUM(L2:L13)</td>
                            <td className="p-2 text-right text-[#1F4E78]">=SUM(M2:M13)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ════ TAB 3: 1. RAW_DATA SHEET ════ */}
                {activeSheetTab === 'Raw_Data' && (
                  <div className="space-y-4 max-w-[1200px] mx-auto">
                    <div className="bg-[#107C41] text-white p-3 rounded text-xs">
                      <div className="font-bold text-sm">Sheet: 1. Raw_Data (Transactional Ingestion Layer)</div>
                      <div className="text-emerald-100 text-[length:var(--text-small)] mt-0.5">
                        Granular transactional records. Showing first 25 sample daily logs across riders, delivery mileage, order pay rates, and attendance checks.
                      </div>
                    </div>

                    <div className="border border-[#CBD5E1] rounded overflow-x-auto shadow-sm">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F2F5F9] border-b-2 border-[#107C41] font-bold text-slate-800 text-[length:var(--text-small)]">
                            <th className="p-2 border-r border-[#CBD5E1]">Date</th>
                            <th className="p-2 border-r border-[#CBD5E1]">Rider_ID</th>
                            <th className="p-2 border-r border-[#CBD5E1]">Rider_Name</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Trips_Completed</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Distance_KM</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Rate_Per_Trip</th>
                            <th className="p-2 text-center border-r border-[#CBD5E1]">Bonus_Eligible</th>
                            <th className="p-2 text-right border-r border-[#CBD5E1]">Deductions</th>
                            <th className="p-2 text-center border-r border-[#CBD5E1]">Attendance</th>
                            <th className="p-2 border-r border-[#CBD5E1]">Zone</th>
                            <th className="p-2">Week</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_RAW_DATA.map((row, idx) => (
                            <tr
                              key={idx}
                              onClick={() => setActiveCell({ coord: `A${idx + 2}`, formula: `='Raw_Data'!A${idx + 2}`, value: `${row.name} (${row.date})` })}
                              className={`border-b border-[#E2E8F0] cursor-pointer hover:bg-slate-100 transition-colors ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                              }`}
                            >
                              <td className="p-2 font-mono text-slate-600 border-r border-[#CBD5E1]">{row.date}</td>
                              <td className="p-2 font-mono font-bold text-blue-700 border-r border-[#CBD5E1]">{row.id}</td>
                              <td className="p-2 font-medium text-slate-800 border-r border-[#CBD5E1]">{row.name}</td>
                              <td className="p-2 text-right text-slate-800 border-r border-[#CBD5E1] font-medium">{row.trips}</td>
                              <td className="p-2 text-right text-slate-600 border-r border-[#CBD5E1]">{row.km}</td>
                              <td className="p-2 text-right text-slate-700 border-r border-[#CBD5E1]">₹{row.rate}</td>
                              <td className="p-2 text-center border-r border-[#CBD5E1]">
                                <span className={`px-2 py-0.5 rounded text-[length:var(--text-small)] font-bold ${
                                  row.bonus === 'Y' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {row.bonus}
                                </span>
                              </td>
                              <td className="p-2 text-right text-slate-600 border-r border-[#CBD5E1]">₹{row.ded}</td>
                              <td className="p-2 text-center border-r border-[#CBD5E1]">
                                <span className={`px-2 py-0.5 rounded text-[length:var(--text-small)] font-semibold ${
                                  row.att === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {row.att}
                                </span>
                              </td>
                              <td className="p-2 text-slate-700 border-r border-[#CBD5E1]">{row.zone}</td>
                              <td className="p-2 text-slate-600 font-mono text-[length:var(--text-small)]">{row.week}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ════ TAB 4: 4. AI_INSIGHTS_&_FORMULAS SHEET ════ */}
                {activeSheetTab === 'AI_Insights' && (
                  <div className="space-y-4 max-w-[1200px] mx-auto">
                    <div className="bg-[#1F4E78] text-white p-3 rounded text-xs">
                      <div className="font-bold text-sm">Sheet: 4. AI_Insights_&amp;_Formulas (Calculation Reference)</div>
                      <div className="text-blue-100 text-[length:var(--text-small)] mt-0.5">
                        Technical formula syntax and aggregation logic implemented across the Excel workbook.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {FORMULA_DOCS.map((doc, idx) => (
                        <div key={idx} className="p-4 rounded border border-[#CBD5E1] bg-white shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-slate-900">{doc.name}</span>
                            <span className="text-[length:var(--text-small)] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {doc.type}
                            </span>
                          </div>
                          <div className="p-2 rounded font-mono text-xs mb-2 bg-[#F1F5F9] border border-[#CBD5E1] text-blue-800 overflow-x-auto">
                            {doc.syntax}
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {doc.purpose}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                </div>
              </div>

              {/* ── EXCEL SHEET TABS & WORKBOOK STATUS BAR ── */}
              <div className="bg-[#F3F2F1] border-t border-[#CBD5E1] px-3 py-1 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-slate-400 px-1">
                    <ChevronDown size={14} className="rotate-90 cursor-pointer hover:text-slate-700" />
                    <ChevronDown size={14} className="-rotate-90 cursor-pointer hover:text-slate-700" />
                  </div>

                  {[
                    { id: 'Raw_Data', label: '1. Raw_Data' },
                    { id: 'MIS_Summary', label: '2. MIS_Summary' },
                    { id: 'Dashboard', label: '3. Dashboard' },
                    { id: 'AI_Insights', label: '4. AI_Insights_&_Formulas' },
                  ].map(tab => {
                    const isAct = activeSheetTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveSheetTab(tab.id as any);
                          if (tab.id === 'Dashboard') {
                            setActiveCell({ coord: 'B5:D7', formula: '=SUM(MIS_Summary!M2:M13)', value: '₹4,89,900' });
                          } else if (tab.id === 'MIS_Summary') {
                            setActiveCell({ coord: 'M2', formula: '=F2+H2-L2', value: 'Net Payout' });
                          } else if (tab.id === 'Raw_Data') {
                            setActiveCell({ coord: 'A2', formula: '="2026-05-01"', value: 'RID101' });
                          } else {
                            setActiveCell({ coord: 'B4', formula: '=SUMIF(Raw_Data!A:A, A2, Raw_Data!D:D)', value: 'Formula Syntax' });
                          }
                        }}
                        className={`px-3 py-1.5 text-xs rounded-t transition-all cursor-pointer ${
                          isAct
                            ? 'bg-white text-[#107C41] border-t-2 border-t-[#107C41] border-x border-[#CBD5E1] font-bold shadow-sm'
                            : 'text-slate-600 hover:bg-[#E5E7EB] hover:text-slate-900 font-medium'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden sm:flex items-center gap-3 text-slate-500 text-[length:var(--text-small)]">
                  <span>Ready</span>
                  <span>•</span>
                  <span>Count: {filteredRiders.length}</span>
                  <span>•</span>
                  <span>Sum: {formatIndianCurrency(kpis.totalNet)}</span>
                  <span>•</span>
                  <span>100%</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── 3. RIDER AUDIT SCORECARD DIALOG ── */}
        {selectedRiderModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
            onClick={() => setSelectedRiderModal(null)}
          >
            <div
              className="bg-white text-slate-900 border border-slate-300 rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] shadow-2xl relative font-sans"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedRiderModal(null)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              {/* Dialog Header */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-200">
                <div className="w-11 h-11 rounded bg-[#1F4E78] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedRiderModal.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedRiderModal.name}</h3>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1F4E78] border border-blue-200">
                      {selectedRiderModal.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Hub Zone: <strong className="text-slate-800">{selectedRiderModal.zone}</strong>
                  </p>
                </div>
              </div>

              {/* 4 Clean Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                <div className="p-3 rounded bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[length:var(--text-small)] font-bold uppercase text-slate-500">Completed Trips</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{selectedRiderModal.trips}</div>
                  <div className="text-[length:var(--text-small)] text-slate-500">{(selectedRiderModal.trips / selectedRiderModal.attendanceDays).toFixed(1)} / day</div>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[length:var(--text-small)] font-bold uppercase text-slate-500">Distance</div>
                  <div className="text-lg font-bold text-[#2E75B6] mt-0.5">{selectedRiderModal.distanceKm.toFixed(0)} km</div>
                  <div className="text-[length:var(--text-small)] text-slate-500">{(selectedRiderModal.distanceKm / selectedRiderModal.trips).toFixed(1)} km/trip</div>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[length:var(--text-small)] font-bold uppercase text-slate-500">Bonus Shifts</div>
                  <div className="text-lg font-bold text-[#833C0C] mt-0.5">{selectedRiderModal.bonusDays} Shifts</div>
                  <div className="text-[length:var(--text-small)] text-slate-500">₹{selectedRiderModal.bonusAmount} earned</div>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-center">
                  <div className="text-[length:var(--text-small)] font-bold uppercase text-emerald-800">Net Payout</div>
                  <div className="text-lg font-bold text-[#107C41] mt-0.5">
                    {formatIndianCurrency(selectedRiderModal.netPayout)}
                  </div>
                  <div className="text-[length:var(--text-small)] text-emerald-700">100% reconciled</div>
                </div>
              </div>

              {/* 30-Day Attendance Grid */}
              <div className="p-4 rounded border border-slate-200 bg-slate-50 mb-5">
                <div className="flex items-center justify-between mb-2.5 text-xs font-bold text-slate-800">
                  <span>30-Day Shift Attendance Punch-Card</span>
                  <span className="text-emerald-700">
                    {selectedRiderModal.attendanceDays} Present / {selectedRiderModal.totalDays - selectedRiderModal.attendanceDays} Rest Days
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1 pt-1">
                  {Array.from({ length: 30 }, (_, i) => {
                    const isPresent = i < selectedRiderModal.attendanceDays;
                    const isBonusDay = isPresent && i < selectedRiderModal.bonusDays;
                    return (
                      <div
                        key={i}
                        className={`h-7 rounded flex items-center justify-center text-[length:var(--text-small)] font-bold font-mono ${
                          isBonusDay
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isPresent
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                        title={`Day ${i + 1}: ${isBonusDay ? 'Present (Bonus Hit: 11+ orders)' : isPresent ? 'Present' : 'Rest Day'}`}
                      >
                        D{i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-2.5 text-[length:var(--text-small)] text-slate-600">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-400" /> Bonus Shift (11+ orders)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Standard Shift</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-300" /> Rest Day</span>
                </div>
              </div>

              {/* Financial Reconciliation Breakdown */}
              <div className="p-3.5 rounded border border-slate-200 bg-white text-xs mb-5">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600">Gross Trip Pay (=SUMPRODUCT):</span>
                  <span className="font-bold text-slate-800">{formatIndianCurrency(selectedRiderModal.grossEarnings)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200 text-amber-800">
                  <span>Productivity Bonuses (=Bonus_Days * ₹250):</span>
                  <span className="font-bold">+{formatIndianCurrency(selectedRiderModal.bonusAmount)}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-200 text-rose-700">
                  <span>Deductions &amp; Penalty Adjustments:</span>
                  <span className="font-bold">-₹{selectedRiderModal.deductions.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-sm font-bold text-[#107C41]">
                  <span>Net Disbursed Payout (=F+H-L):</span>
                  <span className="text-base">{formatIndianCurrency(selectedRiderModal.netPayout, 1)}</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRiderModal(null)}
                  className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Close Scorecard
                </button>
              </div>
            </div>
          </div>
        )}

        <Crosshair position="br" />
      </main>

      <Footer />
    </div>
  );
}
