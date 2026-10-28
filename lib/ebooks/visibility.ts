import type { Prisma } from '@prisma/client';

// Explicitly selected for public discovery. Other drafts remain private.
// Visibility does not approve content or enable sales.
export const publicBookWhere: Prisma.CommerceProductWhereInput = {
  OR: [
    { status: 'PUBLISHED' },
    { status: 'DRAFT', slug: { in: ['power-bi-real-world-projects-2026', 'power-bi-mastery-2026', 'digital-marketing-playbook-2026'] } },
  ],
};
