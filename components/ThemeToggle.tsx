'use client';

import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-9 h-9 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300 overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 0 : 40,
          opacity: isDark ? 1 : 0
        }}
        className="absolute"
      >
        <Sun size={18} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          y: isDark ? -40 : 0,
          opacity: isDark ? 0 : 1
        }}
        className="absolute"
      >
        <Moon size={18} />
      </motion.div>
    </button>
  );
}
