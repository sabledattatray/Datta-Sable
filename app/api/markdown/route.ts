import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'llms-full.txt');
    const fallbackPath = path.join(process.cwd(), 'public', 'llms.txt');
    
    let content = '';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf8');
    } else if (fs.existsSync(fallbackPath)) {
      content = fs.readFileSync(fallbackPath, 'utf8');
    } else {
      content = '# Datta Sable\n> Senior BI Developer & Enterprise Data Engineer.\n\nVisit https://dattasable.com for guides on Microsoft Fabric, Power BI, and Data Engineering.';
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (err) {
    return new NextResponse('# Datta Sable\n\nVisit https://dattasable.com', {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    });
  }
}
