import { NextRequest, NextResponse } from 'next/server';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const existingSecret = searchParams.get('secret');
    
    // Use existing secret or generate new 20-byte base32 secret
    const secret = (existingSecret && existingSecret.length >= 16)
      ? existingSecret.trim().toUpperCase()
      : generateSecret();

    const label = 'Datta Sable Admin';
    const issuer = 'Datta Sable';
    const uri = generateURI({
      secret,
      label,
      issuer,
    });

    const qrCode = await QRCode.toDataURL(uri, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return NextResponse.json({
      secret,
      uri,
      qrCode,
      issuer,
      label,
    });
  } catch (err: any) {
    console.error('Error generating MFA QR:', err);
    return NextResponse.json({ error: 'Failed to generate MFA setup' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, secret } = body;

    if (!token || !secret) {
      return NextResponse.json({ valid: false, error: 'Token and secret are required' }, { status: 400 });
    }

    const cleanToken = String(token).replace(/\D/g, '').trim();
    const cleanSecret = String(secret).replace(/\s/g, '').toUpperCase().trim();

    if (cleanToken.length !== 6) {
      return NextResponse.json({ valid: false, error: 'Please enter a 6-digit code' }, { status: 400 });
    }

    const nowSec = Math.floor(Date.now() / 1000);
    // Allow 60 seconds tolerance for drift between server clock and user's phone clock
    const result = verifySync({
      secret: cleanSecret,
      token: cleanToken,
      epoch: nowSec,
      epochTolerance: 60,
    });

    if (result && result.valid) {
      return NextResponse.json({ valid: true, message: 'Code verified successfully' });
    }

    return NextResponse.json(
      {
        valid: false,
        error: 'Invalid 6-digit code. Please verify the code on your Google Authenticator app and ensure your phone time is accurate.',
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Error verifying MFA token:', err);
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
