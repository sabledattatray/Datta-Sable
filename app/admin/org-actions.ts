'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Type-cast prisma instance to bypass cached IDE TypeScript definition issues
const db = prisma as any;

export async function getCompanyProfile() {
  try {
    const settings = await db.systemSetting.findMany({
      where: {
        key: {
          in: ['company_name', 'company_email', 'company_tax_id', 'company_address']
        }
      }
    });

    const profile: Record<string, string> = {
      company_name: 'dattasable.',
      company_email: 'support@dattasable.com',
      company_tax_id: '27AABCU1234F1Z5',
      company_address: 'Sable Heights, Senapati Bapat Road, Pune, Maharashtra, 411016'
    };

    settings.forEach((s: any) => {
      profile[s.key] = s.value;
    });

    return profile;
  } catch (error) {
    console.error("Failed to fetch company profile settings:", error);
    return null;
  }
}

export async function saveCompanyProfile(data: {
  companyName: string;
  supportEmail: string;
  taxId: string;
  officeAddress: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== 'ADMIN') {
    return { error: 'Unauthorized. Admin access required.' };
  }

  try {
    const ops = [
      db.systemSetting.upsert({
        where: { key: 'company_name' },
        update: { value: data.companyName },
        create: { key: 'company_name', value: data.companyName }
      }),
      db.systemSetting.upsert({
        where: { key: 'company_email' },
        update: { value: data.supportEmail },
        create: { key: 'company_email', value: data.supportEmail }
      }),
      db.systemSetting.upsert({
        where: { key: 'company_tax_id' },
        update: { value: data.taxId },
        create: { key: 'company_tax_id', value: data.taxId }
      }),
      db.systemSetting.upsert({
        where: { key: 'company_address' },
        update: { value: data.officeAddress },
        create: { key: 'company_address', value: data.officeAddress }
      })
    ];

    await prisma.$transaction(ops);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save company profile settings:", error);
    return { error: error.message || 'Failed to save company profile settings' };
  }
}
