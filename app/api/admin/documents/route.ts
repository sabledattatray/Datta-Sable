import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

async function checkAuth(req: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || process.env.NODE_ENV === 'development';
  return isAdmin;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await checkAuth(req))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileParam = searchParams.get('file');

    if (!fileParam) {
      return NextResponse.json({ message: "Missing file parameter" }, { status: 400 });
    }

    // Sanitize path to prevent Directory Traversal
    const sanitizedFileParam = fileParam.replace(/\.\./g, '').replace(/^\/+/g, '');
    const storageRoot = path.join(process.cwd(), 'storage');
    const fullPath = path.join(storageRoot, sanitizedFileParam);

    // Verify it resides within storageRoot
    if (!fullPath.startsWith(storageRoot)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    
    // Determine content type
    let contentType = 'application/octet-stream';
    const ext = path.extname(fullPath).toLowerCase();
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.doc') {
      contentType = 'application/msword';
    } else if (ext === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
      },
    });

  } catch (error) {
    console.error("Document download failed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
