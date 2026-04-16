import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Cookie, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

interface CookieConsentProps {
  settings: {
    enableCookiePopup?: boolean;
    enableLogging?: boolean;
    strictlyNecessaryCookies?: boolean;
    cookieTitle?: string;
    cookieDescription?: string;
    strictlyCookieTitle?: string;
    strictlyCookieDescription?: string;
    contactUsDescription?: string;
    contactUsUrl?: string;
  };
}

const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'on', 'yes'].includes(normalized)) return true;
    if (['0', 'false', 'off', 'no', ''].includes(normalized)) return false;
  }

  return fallback;
};

export default function CookieConsent({ settings }: CookieConsentProps) {
  const { t } = useTranslation();
  const cookiePopupEnabled = toBoolean(settings.enableCookiePopup, false);
  const cookieLoggingEnabled = toBoolean(settings.enableLogging, false);
  const strictlyNecessaryEnabled = toBoolean(settings.strictlyNecessaryCookies, true);
  const [isVisible, setIsVisible] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent && cookiePopupEnabled) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Failed to read cookie consent:', error);
      if (cookiePopupEnabled) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  }, [cookiePopupEnabled]);

  const logCookieConsent = (consent: any) => {
    if (!cookieLoggingEnabled) {
      return;
    }

    router.post(route('cookie.consent.log'), {
      consent: consent,
      ip: window.location.hostname,
      userAgent: navigator.userAgent
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {},
      onError: () => {}
    });
  };

  const createConsent = (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => ({
    ...preferences,
    timestamp: Date.now(),
  });

  const saveConsent = (consent: any) => {
    try {
      localStorage.setItem('cookie-consent', JSON.stringify(consent));
      logCookieConsent(consent);
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  };

  const handleAcceptAll = () => {
    const consent = createConsent({ necessary: true, analytics: true, marketing: true });
    saveConsent(consent);
  };

  const handleAcceptSelected = () => {
    const consent = createConsent(acceptedCookies);
    saveConsent(consent);
  };

  const handleReject = () => {
    const consent = createConsent({ necessary: true, analytics: false, marketing: false });
    saveConsent(consent);
  };

  if (!isVisible || !cookiePopupEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-x-2 bottom-4 z-50 sm:left-1/2 sm:right-auto sm:w-[min(900px,95vw)] sm:-translate-x-1/2">
      <div className="bg-background border border-border rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Cookie className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-base">
              {settings.cookieTitle || t('Cookie Consent')}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                {settings.cookieDescription}
              </p>

              {strictlyNecessaryEnabled && (
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {settings.strictlyCookieTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {settings.strictlyCookieDescription}
                    </p>
                  </div>
                  <Switch checked={true} disabled className="ml-2" />
                </div>
              )}

              {settings.contactUsUrl && (
                <p className="text-xs text-muted-foreground">
                  {settings.contactUsDescription}{' '}
                  <a href={settings.contactUsUrl} className="text-primary hover:underline font-medium">
                    {t('Contact us')}
                  </a>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:min-w-[140px]">
              <Button size="sm" onClick={handleAcceptAll} className="w-full bg-green-600 hover:bg-green-700">
                {t('Accept All')}
              </Button>
              <Button size="sm" variant="outline" onClick={handleAcceptSelected} className="w-full">
                {t('Accept Selected')}
              </Button>
              <Button size="sm" variant="destructive" onClick={handleReject} className="w-full">
                {t('Reject')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
