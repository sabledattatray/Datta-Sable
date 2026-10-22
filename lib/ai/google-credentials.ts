import fs from 'node:fs';
import path from 'node:path';

export interface GoogleServiceAccount {
  type: string;
  project_id: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
}

let cachedCredentials: GoogleServiceAccount | null = null;

/**
 * Retrieves the Google Cloud Service Account credentials.
 * Works seamlessly across both local development (reading service-account.json)
 * and Vercel serverless environments (reading GOOGLE_SERVICE_ACCOUNT_BASE64).
 */
export function getGoogleServiceAccountCredentials(): GoogleServiceAccount | null {
  if (cachedCredentials) return cachedCredentials;

  // 1. Check Base64 environment variable (Primary for Vercel / CI)
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    try {
      const decoded = Buffer.from(b64, 'base64').toString('utf8');
      cachedCredentials = JSON.parse(decoded);
      return cachedCredentials;
    } catch (err) {
      console.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_BASE64:', err);
    }
  }

  // 2. Check JSON string directly
  const jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonStr) {
    try {
      cachedCredentials = JSON.parse(jsonStr);
      return cachedCredentials;
    } catch (err) {
      console.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err);
    }
  }

  // 3. Check local file path (Primary for local dev)
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      cachedCredentials = JSON.parse(content);
      return cachedCredentials;
    } catch (err) {
      console.warn(`Failed to read credentials file from ${filePath}:`, err);
    }
  }

  return null;
}
