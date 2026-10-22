import crypto from 'node:crypto';
import { getGoogleServiceAccountCredentials } from './google-credentials';

const tokenCache = new Map<string, { token: string; expiresAt: number }>();

/**
 * Generates an OAuth2 access token for Google APIs using the Service Account.
 */
export async function getGoogleAccessToken(
  scopes: string[] = [
    'https://www.googleapis.com/auth/indexing',
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/webmasters.readonly',
  ]
): Promise<string | null> {
  const credentials = getGoogleServiceAccountCredentials();
  if (!credentials || !credentials.client_email || !credentials.private_key) {
    return null;
  }

  const scopeKey = [...scopes].sort().join(' ');
  const now = Math.floor(Date.now() / 1000);
  const cached = tokenCache.get(scopeKey);
  if (cached && cached.expiresAt > now + 60) {
    return cached.token;
  }

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(
    JSON.stringify({
      iss: credentials.client_email,
      scope: scopeKey,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

  try {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(`${header}.${claim}`);
    const signature = signer.sign(credentials.private_key, 'base64url');
    const assertion = `${header}.${claim}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    });

    const data = await res.json();
    if (data.access_token) {
      tokenCache.set(scopeKey, {
        token: data.access_token,
        expiresAt: now + (data.expires_in || 3600),
      });
      return data.access_token;
    }
    console.warn('Google OAuth token error:', data);
    return null;
  } catch (err) {
    console.error('Failed to generate Google access token:', err);
    return null;
  }
}

export interface GoogleIndexingResult {
  success: boolean;
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
  notifiedAt?: string;
  error?: string;
  actionRequired?: string;
}

/**
 * Submits a URL directly to Google's Indexing API for rapid crawling and indexing.
 */
export async function submitUrlToGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<GoogleIndexingResult> {
  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/indexing']);
  if (!token) {
    return {
      success: false,
      url,
      type,
      error: 'Google Service Account credentials not configured or token generation failed.',
    };
  }

  try {
    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type }),
    });

    const data = await res.json();

    if (res.ok && data.urlNotificationMetadata) {
      return {
        success: true,
        url,
        type,
        notifiedAt: data.urlNotificationMetadata.latestUpdate?.notifyTime || new Date().toISOString(),
      };
    }

    if (data.error) {
      const code = data.error.code;
      const msg = data.error.message || '';
      let actionRequired: string | undefined;

      if (code === 403 && msg.includes('has not been used in project')) {
        actionRequired = 'Enable the Web Search Indexing API in Google Cloud Console: https://console.developers.google.com/apis/api/indexing.googleapis.com/overview';
      } else if (code === 403 && msg.includes('Permission denied')) {
        actionRequired = 'Add the service account email as an Owner or Full User in Google Search Console for dattasable.com.';
      }

      return {
        success: false,
        url,
        type,
        error: `[Google Error ${code}] ${msg}`,
        actionRequired,
      };
    }

    return {
      success: false,
      url,
      type,
      error: 'Unexpected response from Google Indexing API',
    };
  } catch (err: any) {
    return {
      success: false,
      url,
      type,
      error: err?.message || 'Network error during Google Indexing submission',
    };
  }
}

/**
 * Inspects a URL using the official Google Search Console URL Inspection API.
 */
export async function inspectUrlInGoogleSearchConsole(url: string, siteUrl = 'sc-domain:dattasable.com'): Promise<any> {
  const token = await getGoogleAccessToken([
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/webmasters',
  ]);
  if (!token) {
    return { error: 'Google Service Account credentials not available.' };
  }

  try {
    const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return { error: err?.message || 'Failed to inspect URL in Google Search Console' };
  }
}

/**
 * Submits the sitemap to Google Search Console via the official Webmasters Sitemaps API.
 */
export async function submitSitemapToGoogleSearchConsole(
  sitemapUrl = 'https://dattasable.com/sitemap.xml',
  siteUrl = 'sc-domain:dattasable.com'
): Promise<{ success: boolean; sitemapUrl: string; status?: number; error?: string }> {
  const token = await getGoogleAccessToken(['https://www.googleapis.com/auth/webmasters']);
  if (!token) {
    return { success: false, sitemapUrl, error: 'Google Service Account credentials not available.' };
  }

  try {
    const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.ok || res.status === 204) {
      return { success: true, sitemapUrl, status: res.status };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      sitemapUrl,
      status: res.status,
      error: data?.error?.message || `Google Sitemaps API responded with status ${res.status}`,
    };
  } catch (err: any) {
    return { success: false, sitemapUrl, error: err?.message || 'Failed to submit sitemap' };
  }
}
