import { LayoutDashboard, FileText, Briefcase, Layers, Users, Building2, CreditCard, ShoppingBag, BarChart3, Megaphone, Settings, Bell, Terminal, Search } from 'lucide-react';

export const adminNavigation = [
  { label: 'Workspace', items: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Content studio', icon: FileText, children: [
      { label: 'Blog articles', href: '/admin/blog' }, { label: 'Website pages', href: '/admin/pages' },
      { label: 'Media library', href: '/admin/cms/media' },
    ] },
    { label: 'Portfolio & services', icon: Briefcase, children: [
      { label: 'Projects', href: '/admin/projects' }, { label: 'Services', href: '/admin/services' }, { label: 'Testimonials', href: '/admin/testimonials' },
    ] },
  ] },
  { label: 'Commerce', items: [
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Digital products', href: '/admin/products', icon: ShoppingBag },
    { label: 'Orders & billing', icon: Layers, children: [
      { label: 'All orders', href: '/admin/orders' }, { label: 'Transactions', href: '/admin/orders/transactions' },
      { label: 'Purchase receipts', href: '/admin/billing/invoices' }, { label: 'Refunds', href: '/admin/refunds' },
      { label: 'Receipt email logs', href: '/admin/email-logs' }, { label: 'Subscriptions', href: '/admin/billing/subs' }, { label: 'Payment methods', href: '/admin/billing/methods' },
    ] },
  ] },
  { label: 'Growth & intelligence', items: [
    { label: 'Analytics', icon: BarChart3, children: [
      { label: 'Audience overview', href: '/admin/analytics' }, { label: 'Traffic & behavior', href: '/admin/analytics/traffic' }, { label: 'Custom reports', href: '/admin/analytics/reports' },
    ] },
    { label: 'Search & knowledge', icon: Search, children: [
      { label: 'SEO intelligence', href: '/admin/seo' }, { label: 'Knowledge graph', href: '/admin/knowledge' }, { label: 'Topic authority', href: '/admin/topic-authority' }, { label: 'Fabric master', href: '/admin/fabric' },
    ] },
    { label: 'Marketing', icon: Megaphone, children: [
      { label: 'Campaigns', href: '/admin/marketing/campaigns' }, { label: 'Coupons & deals', href: '/admin/marketing/coupons' },
    ] },
  ] },
  { label: 'People & operations', items: [
    { label: 'People', icon: Users, children: [
      { label: 'Users & subscribers', href: '/admin/users' }, { label: 'Roles & permissions', href: '/admin/users/roles' },
      { label: 'Careers & applications', href: '/admin/careers' }, { label: 'Mentorship', href: '/admin/mentorship' },
    ] },
    { label: 'Inbox & support', icon: Bell, children: [
      { label: 'Messages', href: '/admin/messages' }, { label: 'Alerts & events', href: '/admin/notifications/alerts' }, { label: 'Support tickets', href: '/admin/support/tickets' },
    ] },
    { label: 'Organization', icon: Building2, children: [
      { label: 'Company profile', href: '/admin/org/profile' }, { label: 'Branches & locations', href: '/admin/org/branches' },
    ] },
  ] },
  { label: 'System', items: [
    { label: 'Settings', icon: Settings, children: [
      { label: 'General settings', href: '/admin/settings' }, { label: 'Website typography', href: '/admin/settings/typography' },
      { label: 'Security & authentication', href: '/admin/settings/security' }, { label: 'Integrations', href: '/admin/settings/integrations' },
    ] },
    { label: 'Developer tools', icon: Terminal, children: [
      { label: 'API keys', href: '/admin/developer/keys' }, { label: 'Webhooks', href: '/admin/developer/webhooks' }, { label: 'System logs', href: '/admin/developer/logs' },
    ] },
  ] },
];

export const adminDestinations = adminNavigation.flatMap(group => group.items.flatMap(item => 'children' in item && item.children
  ? item.children.map(child => ({ ...child, group: group.label, parent: item.label }))
  : 'href' in item && item.href ? [{ label: item.label, href: item.href, group: group.label, parent: '' }] : []));

// A route gets one active destination, even where a parent path also matches.
export function activeAdminDestination(pathname: string) {
  return adminDestinations.filter(item => item.href === '/admin' ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
