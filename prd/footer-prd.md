🚀 FOOTER PRD — dattasable.com (Premium BI Website)
🎯 Objective

Design and implement a high-fidelity, responsive footer that:

Reinforces enterprise BI positioning
Drives lead conversion (contact/demo)
Provides clear navigation
Matches a dark, futuristic analytics UI
🧩 1. Layout Structure (Grid System)
Desktop (≥1200px)
------------------------------------------------------------
| LOGO + TAGLINE | NAVIGATION | SERVICES | RESOURCES | CTA  |
------------------------------------------------------------
| SOCIAL | NEWSLETTER | LEGAL LINKS | COPYRIGHT             |
------------------------------------------------------------
Tablet
LOGO + TAGLINE
NAVIGATION (2 cols)
SERVICES (2 cols)
RESOURCES
CTA
SOCIAL + NEWSLETTER
LEGAL
Mobile
LOGO
TAGLINE
ACCORDION SECTIONS:
- Navigation
- Services
- Resources
CTA BUTTON
SOCIAL ICONS
COPYRIGHT
🎨 2. Design System
Theme
Background: #0B0F19 (deep obsidian)
Card: #111827
Accent: #c9f31d (neon lime)
Secondary: #22D3EE (cyan glow)
Typography
Heading: Inter / Satoshi (SemiBold)
Body: Inter (Regular)
Font sizes:
Headings: 14–16px
Links: 13–14px
Effects
Subtle glassmorphism (blur + transparency)
Neon hover glow on links
Divider lines with low opacity
🧠 3. Content Sections
🧾 Brand Block
Dattasable
Engineering data into strategic assets

High-fidelity analytics, intelligent automation,
and scalable BI systems for enterprise growth.
🔗 Navigation
Home
About
Services
Case Studies
Blog
Contact
⚙️ Services
Business Intelligence
Data Engineering
Dashboard Development
Automation & Pipelines
Data Strategy Consulting
📚 Resources
Blogs
Documentation
Tutorials
Privacy Policy
Terms of Service
📩 CTA Section (IMPORTANT)
Heading: “Start Building Smarter Decisions”
Button:
Primary: Book a Demo
Secondary: Contact Us
📧 Newsletter
Input: Email
Button: Subscribe
Microcopy:
“Get insights on BI, dashboards & data trends”
🌐 Social Links
LinkedIn
GitHub
Twitter (X)
⚖️ Bottom Bar
© 2026 Dattasable. All rights reserved.
Built with precision in data & design.
⚙️ 4. Technical Requirements (Node.js / Next.js)
Stack
Framework: Next.js
Styling: Tailwind CSS
Icons: Lucide / Heroicons
Component Structure
components/
 └── Footer/
     ├── Footer.tsx
     ├── FooterLinks.tsx
     ├── Newsletter.tsx
     ├── SocialIcons.tsx
     └── CTASection.tsx
Key Features
Fully responsive (mobile-first)
Accessible (ARIA labels, keyboard nav)
Lazy-loaded icons
SEO-friendly links
Reusable config-driven links (JSON)
✨ 5. Interactions & Animations
Hover:
Text → neon glow
Icons → scale + color shift
Scroll reveal (fade-in)
Button:
Gradient glow on hover
🧩 6. Performance
Lightweight (<50kb CSS for footer)
Avoid heavy images
Use SVG icons
Optimize for Lighthouse (90+)
🔐 7. Accessibility
Contrast ratio ≥ 4.5
Focus states visible
Screen-reader labels
🧠 8. Developer Prompt (Copy-Paste Ready)
Writing

Build a premium, responsive footer component for a BI website (dattasable.com) using Next.js and Tailwind CSS. The design should follow a dark futuristic theme with neon lime (#c9f31d) and cyan accents. Include sections: brand (logo + tagline), navigation links, services, resources, newsletter signup, CTA buttons (Book Demo, Contact), and social icons. Ensure mobile responsiveness using accordion layout. Add smooth hover animations, glow effects, and accessibility features (ARIA labels, keyboard navigation). Structure components modularly and optimize for performance and SEO. The footer should reflect a high-end enterprise analytics platform aesthetic.

💡 Final Advice

Most people treat footer as “last section”
👉 You should treat it as a conversion zone

If done right:

It increases leads
Improves credibility
Makes your site feel premium