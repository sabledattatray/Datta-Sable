// Basic consent mode: queue defaults locally; do not load Google tags before consent.
export const GOOGLE_CONSENT_DEFAULTS = {
  analytics_storage: 'denied', ad_storage: 'denied',
  ad_user_data: 'denied', ad_personalization: 'denied',
};
export const googleConsentBootstrap =
  'window.dataLayer = window.dataLayer || [];' +
  'window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};' +
  "window.gtag('consent','default'," + JSON.stringify(GOOGLE_CONSENT_DEFAULTS) + ');';
export function buildAnalyticsInitialization(id: string) {
  return 'window.dataLayer = window.dataLayer || [];' +
    'window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};' +
    "window.gtag('consent','update',{analytics_storage:'granted'});" +
    "window.gtag('js',new Date());" +
    "window.gtag('config'," + JSON.stringify(id) +
    ',{allow_google_signals:false,allow_ad_personalization_signals:false,' +
    "page_location:window.location?window.location.origin+window.location.pathname:'',page_referrer:''});";
}
