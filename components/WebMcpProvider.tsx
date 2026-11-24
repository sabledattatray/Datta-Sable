'use client';

import { useEffect } from 'react';

/**
 * WebMCP Tool Registration
 * Exposes in-browser tools to autonomous AI agents via navigator.modelContext / document.modelContext
 */
export default function WebMcpProvider() {
  useEffect(() => {
    try {
      const mc =
        (typeof navigator !== 'undefined' && (navigator as any).modelContext) ||
        (typeof document !== 'undefined' && (document as any).modelContext);

      if (mc && typeof mc.registerTool === 'function') {
        mc.registerTool({
          name: 'search_knowledge_base',
          description:
            'Search technical guides, Microsoft Fabric tutorials, Power BI blueprints, and data engineering case studies on Datta Sable’s website.',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search keywords, e.g. "Fabric OneLake", "DAX", "SQL window functions", "DP-600"',
              },
            },
            required: ['query'],
          },
          annotations: {
            readOnlyHint: true,
          },
          execute: async ({ query }: { query: string }) => {
            const target = `/blog?q=${encodeURIComponent(query)}`;
            if (typeof window !== 'undefined') {
              window.location.href = target;
            }
            return {
              success: true,
              url: `https://dattasable.com${target}`,
              message: `Navigating to articles matching "${query}"`,
            };
          },
        });
      }
    } catch {
      // Non-blocking fallback if the user agent does not yet implement WebMCP
    }
  }, []);

  return null;
}
