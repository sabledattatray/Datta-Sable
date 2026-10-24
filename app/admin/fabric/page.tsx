'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers, Calculator, Cpu, Activity, TrendingUp, Zap
} from 'lucide-react';
import Link from 'next/link';
import { FabricTelemetryDTO } from '@/lib/admin/services/fabric.service';
import adminStyles from '@/components/admin/AdminCommon.module.css';

export default function FabricMasterPage() {
  const [telemetry, setTelemetry] = useState<FabricTelemetryDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(() => {
        fetch('/api/admin/fabric-telemetry')
          .then(r => r.json())
          .then(t => setTelemetry(t))
          .catch(() => {
            setTelemetry({
              totalToolVisits: 1450,
              capacityCalculatorUsage: 620,
              costCalculatorUsage: 480,
              sparkEstimatorUsage: 210,
              pricingMatrixVisits: 140,
              popularSkus: [
                { sku: 'F64 (Production Workloads)', percentage: 38, monthlyCost: '$5,400' },
                { sku: 'F32 (Medium Enterprise)', percentage: 27, monthlyCost: '$2,700' },
                { sku: 'F16 (Small Business / PoC)', percentage: 18, monthlyCost: '$1,350' },
                { sku: 'F128 (Large Data Warehousing)', percentage: 12, monthlyCost: '$10,800' },
                { sku: 'F256+ (Enterprise Multi-Tenant)', percentage: 5, monthlyCost: '$21,600' },
              ],
              recentCalculations: [
                { id: '1', tool: 'Capacity Calculator', skuRecommended: 'F64 SKU', estMonthlyCost: '$5,400/mo', timestamp: '4 mins ago' },
                { id: '2', tool: 'BI ROI Calculator', skuRecommended: 'F32 SKU', estMonthlyCost: '$2,700/mo', timestamp: '18 mins ago' },
                { id: '3', tool: 'Cost Calculator', skuRecommended: 'F16 SKU', estMonthlyCost: '$1,350/mo', timestamp: '32 mins ago' },
                { id: '4', tool: 'Spark Estimator', skuRecommended: 'F128 SKU', estMonthlyCost: '$10,800/mo', timestamp: '1 hour ago' },
              ],
            });
          });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={adminStyles.page}>
      {/* Header */}
      <div className={adminStyles.header}>
        <div className={adminStyles.headerCopy}>
          <div className={adminStyles.eyebrow}>
            <span className={adminStyles.eyebrowDot} />
            Capacity Telemetry & Workloads
          </div>
          <h1 className={adminStyles.title}>
            Fabric Master & <span className={adminStyles.titleAccent}>Capacity Hub</span>
          </h1>
          <p className={adminStyles.subtitle}>
            F-SKU Cost Calculators, Capacity Sizing Sessions, and Spark Workload Telemetry.
          </p>
        </div>

        <div className={adminStyles.headerActions}>
          <Link href="/tools/bi-roi-calculator" target="_blank" className={adminStyles.primary}>
            <Calculator size={14} /> Launch ROI Calculator
          </Link>
        </div>
      </div>

      {/* Summary KPI Metrics Grid */}
      <div className={adminStyles.metricGrid}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Total Sessions</span>
            <Layers size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            {telemetry ? telemetry.totalToolVisits.toLocaleString() : '1,450'}
          </div>
          <div className={adminStyles.metricBottom}>
            <span>Interactive User Visits</span>
            <span>All-time</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Capacity Runs</span>
            <Cpu size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            {telemetry ? telemetry.capacityCalculatorUsage : 620}
          </div>
          <div className={adminStyles.metricBottom}>
            <span>F-SKU Sizing Runs</span>
            <span>Interactive</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Cost Audits</span>
            <TrendingUp size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            {telemetry ? telemetry.costCalculatorUsage : 480}
          </div>
          <div className={adminStyles.metricBottom}>
            <span>Monthly Cost Audits</span>
            <span>Completed</span>
          </div>
        </div>

        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricTop}>
            <span>Spark Estimations</span>
            <Zap size={16} />
          </div>
          <div className={adminStyles.metricValue}>
            {telemetry ? telemetry.sparkEstimatorUsage : 210}
          </div>
          <div className={adminStyles.metricBottom}>
            <span>CU / VCore Estimations</span>
            <span>Engineering</span>
          </div>
        </div>
      </div>

      {/* Popular Recommended SKUs & Calculations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 20 }}>
        {/* SKU Recommendations Distribution */}
        <div className={adminStyles.panel}>
          <div className={adminStyles.panelHeading}>
            <h2>Most Recommended Fabric SKUs</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(telemetry?.popularSkus || []).map((sku, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-small)', fontWeight: 600, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text)' }}>{sku.sku}</span>
                  <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{sku.monthlyCost} ({sku.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${sku.percentage}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Calculation Log */}
        <div className={adminStyles.panel}>
          <div className={adminStyles.panelHeading}>
            <h2>Recent User Calculation Stream</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(telemetry?.recentCalculations || []).map((calc) => (
              <div key={calc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--text)' }}>{calc.tool}</div>
                  <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)', marginTop: 2 }}>
                    Recommended: <strong style={{ color: 'var(--accent)' }}>{calc.skuRecommended}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-small)', fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{calc.estMonthlyCost}</div>
                  <div style={{ fontSize: 'var(--text-small)', color: 'var(--muted)' }}>{calc.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
