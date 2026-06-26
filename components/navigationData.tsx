import React from 'react';
import {
  BarChart3, Database, Code2, Globe, Shield, Zap, TrendingUp,
  Activity, Layers, FileText, Sparkles, Pen,
  PenTool, LayoutGrid, Scale, Book, Search, Cpu,
  Monitor, Server, Palette, Megaphone, ShoppingCart, Workflow,
  HelpCircle, User, Mail, Users, MessageSquare, PhoneCall
} from 'lucide-react';

export const navLinks = [
  { label: 'Start Here', href: '/start-here' },
  { label: 'Services',   href: '/services',              mega: true },
  { label: 'Portfolio',  href: '/portfolio',             mega: true },
  { label: 'Blog',       href: '/blog',                  mega: true },
  { label: 'Dashboards', href: '/dashboards',            mega: true },
  { label: 'Tools',      href: '/tools',                 mega: true },
  { label: 'Knowledge',  href: '/knowledge/architecture', mega: true },
  { label: 'Templates',  href: '/templates' },
  { label: 'Connect',    href: '/contact',               mega: true },
];

export const megaMenuData: Record<string, any> = {

  Services: {
    featured: {
      title: 'Full-Stack Web Development',
      desc: 'Next.js, React, Node.js, and PostgreSQL — end-to-end web applications built for scale and performance.',
      href: '/services#web-dev',
      tag: 'Most Popular',
    },
    items: [
      { title: 'Next.js Development',   desc: 'Fast, SEO-ready React apps.',        icon: <Code2 size={18} />,     href: '/services#web-dev',          color: '#c9f31d' },
      { title: 'UI/UX Design',          desc: 'Figma-to-code premium interfaces.',  icon: <Palette size={18} />,   href: '/services#web-design',       color: '#a78bfa' },
      { title: 'WordPress & CMS',       desc: 'Custom themes & headless setups.',   icon: <Globe size={18} />,     href: '/services#web-solutions',    color: '#60a5fa' },
      { title: 'Power BI Dashboards',   desc: 'Enterprise BI architecture.',        icon: <BarChart3 size={18} />, href: '/services#dashboards',       color: '#fb923c' },
      { title: 'SEO & Technical Audit', desc: 'Rankings, speed & Core Web Vitals.', icon: <Search size={18} />,   href: '/services#seo-optimization', color: '#34d399' },
      { title: 'Marketing Automation',  desc: 'n8n workflows & CRM integration.',   icon: <Workflow size={18} />,  href: '/services#n8n-automation',   color: '#f472b6' },
      { title: 'Python Automation',     desc: 'ETL pipelines & data processing.',   icon: <Cpu size={18} />,       href: '/services#automation',       color: '#c9f31d' },
      { title: 'E-commerce Dev',        desc: 'WooCommerce & Shopify builds.',      icon: <ShoppingCart size={18} />, href: '/services#web-solutions',  color: '#00C9F2' },
      { title: 'API & Backend Dev',     desc: 'REST APIs & Node.js services.',      icon: <Server size={18} />,    href: '/services#web-dev',          color: '#a78bfa' },
      { title: 'Digital Marketing',     desc: 'GTM, ads tracking & analytics.',     icon: <Megaphone size={18} />, href: '/services#seo-optimization', color: '#fb923c' },
      { title: 'Data Visualisation',    desc: 'Tableau, charts & infographics.',    icon: <Activity size={18} />,  href: '/services#dashboards',       color: '#60a5fa' },
      { title: 'Graphic Design',        desc: 'CorelDRAW vector brand assets.',     icon: <PenTool size={18} />,   href: '/services#graphic-design',   color: '#34d399' },
    ]
  },

  Portfolio: {
    featured: {
      title: 'Web Apps & Dashboards',
      desc: 'Full-stack builds, BI dashboards, and automation projects with real measurable impact.',
      href: '/portfolio',
      tag: 'Live Projects',
    },
    items: [
      { title: 'Web Applications',    desc: 'Next.js & React full-stack builds.', icon: <Monitor size={18} />,     href: '/portfolio?category=Web',          color: '#c9f31d' },
      { title: 'BI Dashboards',       desc: 'Power BI & Tableau live reports.',   icon: <BarChart3 size={18} />,   href: '/portfolio?category=Dashboard',    color: '#60a5fa' },
      { title: 'UI/UX Projects',      desc: 'Interface design case studies.',     icon: <Palette size={18} />,     href: '/portfolio?category=Design',       color: '#a78bfa' },
      { title: 'Automation Projects', desc: 'Python & n8n workflow builds.',      icon: <Zap size={18} />,         href: '/portfolio?category=Automation',   color: '#34d399' },
      { title: 'SEO Case Studies',    desc: 'Traffic growth & ranking wins.',     icon: <TrendingUp size={18} />,  href: '/portfolio?category=SEO',          color: '#fb923c' },
    ]
  },

  Blog: {
    featured: {
      title: 'Tutorials & Guides',
      desc: 'Practical articles on AI, Next.js, SEO, WordPress, and Digital Marketing.',
      href: '/blog',
      tag: 'Updated Weekly',
    },
    items: [
      { title: 'AI Tutorials',        desc: 'ChatGPT, Gemini & workflow tools.', icon: <Sparkles size={18} />,  href: '/blog?category=AI',           color: '#c9f31d' },
      { title: 'Next.js & React',     desc: 'Full-stack dev guides.',            icon: <Code2 size={18} />,     href: '/blog?category=Engineering',  color: '#60a5fa' },
      { title: 'SEO Guides',          desc: 'Rank higher on Google.',            icon: <Search size={18} />,    href: '/blog?category=SEO',          color: '#34d399' },
      { title: 'WordPress',           desc: 'Themes, plugins & speed tips.',     icon: <Globe size={18} />,     href: '/blog?category=WordPress',    color: '#fb923c' },
      { title: 'Digital Marketing',   desc: 'Ads, GTM & CRM strategies.',        icon: <Megaphone size={18} />, href: '/blog?category=Marketing',    color: '#f472b6' },
      { title: 'Data & Power BI',     desc: 'BI, dashboards & SQL insights.',    icon: <BarChart3 size={18} />, href: '/blog?category=Analysis',     color: '#a78bfa' },
    ]
  },

  Dashboards: {
    featured: {
      title: 'Global Sales Intelligence',
      desc: 'Real-time revenue monitoring with SQL + Power BI — 10M+ rows processed daily.',
      href: '/dashboards/global-sales-intelligence',
      tag: 'Featured',
    },
    items: [
      { title: 'Global Sales',      desc: 'Real-time revenue monitoring.',       icon: <Globe size={18} />,     href: '/dashboards/global-sales-intelligence', color: '#a78bfa' },
      { title: 'EMI Intelligence',  desc: 'Collection & loan performance.',      icon: <Activity size={18} />,  href: '/dashboards/collection-intelligence',   color: '#c9f31d' },
      { title: 'Revenue Intel',     desc: 'MoM forecasting & SQL reporting.',    icon: <TrendingUp size={18} />, href: '/dashboards/revenue-intelligence',      color: '#60a5fa' },
      { title: 'Sales Pipeline',    desc: 'Deal velocity & CRM conversion.',     icon: <BarChart3 size={18} />, href: '/dashboards/sales-pipeline',            color: '#34d399' },
      { title: 'Blinkit Analytics', desc: '10M+ row quick-commerce metrics.',    icon: <Database size={18} />,  href: '/dashboards/blinkit-sales',             color: '#fb923c' },
      { title: 'Surgical AI',       desc: 'C-suite AI command centre.',          icon: <Sparkles size={18} />,  href: '/dashboards/surgical-ai',               color: '#c9f31d' },
      { title: 'Interactive Demo',  desc: 'Live embedded BI experience.',        icon: <Layers size={18} />,    href: '/dashboards/interactive',               color: '#00C9F2' },
      { title: 'All Dashboards',    desc: 'Explore the full BI portfolio.',      icon: <LayoutGrid size={18} />, href: '/dashboards',                          color: '#a78bfa' },
    ]
  },

  Tools: {
    featured: {
      title: 'AI Prompt & SEO Toolkit',
      desc: 'Free browser-based tools for content creators, developers, and marketers.',
      href: '/tools',
      tag: 'Free to Use',
    },
    items: [
      { title: 'AI Prompt Generator',    desc: 'Generate optimised LLM prompts.',   icon: <Sparkles size={18} />, href: '/tools/ai-prompt-generator',  color: '#c9f31d' },
      { title: 'SEO Meta Generator',     desc: 'Craft click-worthy meta tags.',      icon: <Search size={18} />,   href: '/tools/seo-meta-generator',   color: '#34d399' },
      { title: 'LinkedIn Formatter',     desc: 'Format posts for maximum reach.',    icon: <Pen size={18} />,      href: '/tools/linkedin-formatter',   color: '#60a5fa' },
      { title: 'Schema Generator',       desc: 'JSON-LD structured data builder.',   icon: <Code2 size={18} />,    href: '/tools/schema-generator',     color: '#a78bfa' },
      { title: 'Image Blade',            desc: 'Resize & optimise images fast.',     icon: <Palette size={18} />,  href: '/tools/image-blade',          color: '#fb923c' },
      { title: 'Word Counter',           desc: 'Count, analyse & optimise text.',    icon: <FileText size={18} />, href: '/tools/word-counter',         color: '#f472b6' },
      { title: 'Mermaid Forge',          desc: 'Visual diagram code generator.',     icon: <LayoutGrid size={18} />, href: '/tools/mermaid-forge',      color: '#00C9F2' },
      { title: 'Data Forge',             desc: 'Synthetic dataset generation.',      icon: <Database size={18} />, href: '/data-forge',                 color: '#c9f31d' },
      { title: 'Workflow Chains',        desc: 'Multi-node automated AI pipelines.', icon: <Workflow size={18} />,     href: '/chains',                     color: '#fb923c' },
    ]
  },

  Knowledge: {
    featured: {
      title: 'Architecture Library',
      desc: 'System blueprints, design patterns, and engineering standards for modern web development.',
      href: '/knowledge/architecture',
      tag: 'Reference',
    },
    items: [
      { title: 'Architecture Library', desc: 'System blueprints & patterns.',     icon: <Layers size={18} />,    href: '/knowledge/architecture', color: '#c9f31d' },
      { title: 'RFC Directory',        desc: 'Technical Requests for Comments.',  icon: <FileText size={18} />,  href: '/knowledge/rfc',          color: '#60a5fa' },
      { title: 'Workflow Patterns',    desc: 'Canonical design frameworks.',      icon: <LayoutGrid size={18} />, href: '/knowledge/patterns',    color: '#00C9F2' },
      { title: 'Standards & Audits',  desc: 'Prompt & code quality benchmarks.', icon: <Shield size={18} />,    href: '/knowledge/standards',    color: '#34d399' },
      { title: 'System Glossary',      desc: 'Technical terminology index.',      icon: <Book size={18} />,      href: '/glossary',               color: '#a78bfa' },
      { title: 'Comparisons',          desc: 'Framework & tool analysis.',        icon: <Scale size={18} />,     href: '/knowledge/comparisons',  color: '#fb923c' },
      { title: 'Infrastructure Hub',  desc: 'Deployments, server logs & uptime.', icon: <Server size={18} />,    href: '/infrastructure',         color: '#60a5fa' },
      { title: 'Live Analytics Feed',  desc: 'Real-time telemetry & visitor logs.', icon: <Activity size={18} />,  href: '/analytics-live',         color: '#c9f31d' },
      { title: 'FAQ & Help',           desc: 'Find direct answers to common queries.', icon: <HelpCircle size={18} />, href: '/faq',                  color: '#fb923c' },
    ]
  },

  Connect: {
    featured: {
      title: 'Get in Touch',
      desc: 'Collaborate with Datta Sable on enterprise data solutions, custom BI dashboards, and automation strategy.',
      href: '/contact',
      tag: 'Contact',
    },
    items: [
      { title: 'About Datta',        desc: 'Learn about my background & BI philosophy.', icon: <User size={18} />,      href: '/about',                      color: '#c9f31d' },
      { title: 'Contact Me',         desc: 'Start a project or consult with me.',        icon: <Mail size={18} />,      href: '/contact',                    color: '#60a5fa' },
      { title: 'Careers',            desc: 'Join the team (hiring Collection Officers).', icon: <Users size={18} />,     href: '/careers',                    color: '#34d399' },
      { title: 'WhatsApp Chat',      desc: 'Direct message on WhatsApp for fast replies.', icon: <PhoneCall size={18} />, href: 'https://wa.me/918010803756?text=Hi%20Datta,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.', color: '#25D366' },
      { title: 'LinkedIn Profile',   desc: 'Professional network & updates.',            icon: <Users size={18} />,     href: 'https://www.linkedin.com/in/dattasable/', color: '#0A66C2' },
      { title: 'Twitter / X',        desc: 'Real-time thoughts & tech updates.',         icon: <MessageSquare size={18} />, href: 'https://x.com/sabledattatray', color: '#1DA1F2' },
      { title: 'GitHub Codebase',    desc: 'Explore open-source BI templates.',          icon: <Code2 size={18} />,     href: 'https://github.com/sabledattatray', color: '#a78bfa' },
      { title: 'YouTube Channel',    desc: 'Watch technical tutorials & masterclasses.', icon: <Globe size={18} />,     href: 'https://www.youtube.com/@sabledatttatray', color: '#FF0000' },
    ]
  }
};
