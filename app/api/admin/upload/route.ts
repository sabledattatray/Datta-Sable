import { randomUUID } from 'node:crypto';
import { validateUpload, UploadValidationError } from '@/lib/upload-validation';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const validated = await validateUpload(formData.get('file'));
    const file = validated.file;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = `media-${randomUUID()}.${validated.extension}`;
    if (process.env.VERCEL === '1' && !process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({error:'Persistent upload storage is not configured.'},{status:503});

    // If Vercel Blob Storage token is provided (typically in production/live server)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: 'public',
      });
      return NextResponse.json({ url: blob.url });
    }

    // Fallback: Local filesystem upload (typically for local development)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    if (error instanceof UploadValidationError) return NextResponse.json({error:error.message},{status:400});
    console.error('API Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file. Please check storage configuration.' },
      { status: 500 }
    );
  }
}
