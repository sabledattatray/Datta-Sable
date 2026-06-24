import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

    // 1. Try to find the document in the database first
    const applicant = await prisma.applicant.findFirst({
      where: {
        OR: [
          { resumeUrl: fileParam },
          { aadhaarUrl: fileParam },
          { photoUrl: fileParam },
          { portfolioFileUrl: fileParam }
        ]
      }
    });

    if (applicant) {
      let base64Data: string | null = null;
      let targetRelativePath = '';

      if (applicant.resumeUrl === fileParam) {
        base64Data = applicant.resumeBase64;
        targetRelativePath = applicant.resumeUrl;
      } else if (applicant.aadhaarUrl === fileParam) {
        base64Data = applicant.aadhaarBase64;
        targetRelativePath = applicant.aadhaarUrl;
      } else if (applicant.photoUrl === fileParam) {
        base64Data = applicant.photoBase64;
        targetRelativePath = applicant.photoUrl;
      } else if (applicant.portfolioFileUrl === fileParam) {
        base64Data = applicant.portfolioBase64;
        targetRelativePath = applicant.portfolioFileUrl;
      }

      if (base64Data) {
        const fileBuffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64');
        const filename = path.basename(targetRelativePath);
        
        let contentType = 'application/octet-stream';
        const ext = path.extname(filename).toLowerCase();
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
            'Content-Disposition': `inline; filename="${filename}"`,
          },
        });
      }
    }

    // 2. Fallback to Disk Storage
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
