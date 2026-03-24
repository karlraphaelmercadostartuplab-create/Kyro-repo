import React from 'react';
import { useTranslation } from 'react-i18next';
import { getAdminSetting, getImagePath } from '@/utils/helpers';

interface LandingPreviewProps {
  settings?: any;
}

export function LandingPreview({ settings }: LandingPreviewProps) {
  const { t } = useTranslation();

  const getSectionData = (key: string) => settings?.config_sections?.sections?.[key] || {};
  const isSectionVisible = (key: string) => settings?.config_sections?.section_visibility?.[key] !== false;
  const colors = settings?.config_sections?.colors || {
    primary: '#10b77f',
    secondary: '#059669',
    accent: '#f59e0b'
  };
  const sectionOrder = settings?.config_sections?.section_order || [
    'header',
    'hero',
    'stats',
    'features',
    'modules',
    'benefits',
    'gallery',
    'cta',
    'footer'
  ];

  const headerData = getSectionData('header');
  const heroData = getSectionData('hero');
  const statsData = getSectionData('stats');
  const featuresData = getSectionData('features');
  const modulesData = getSectionData('modules');
  const benefitsData = getSectionData('benefits');
  const galleryData = getSectionData('gallery');
  const ctaData = getSectionData('cta');
  const footerData = getSectionData('footer');

  const headerLogoPath =
    getAdminSetting('logo_dark') ||
    getAdminSetting('logoDark') ||
    settings?.logo_dark ||
    settings?.logo ||
    'logo_dark.png';
  const footerLogoPath =
    getAdminSetting('logo_light') ||
    getAdminSetting('logoLight') ||
    settings?.logo_light ||
    'logo_light.png';
  const logoUrl = getImagePath(headerLogoPath);
  const footerLogoUrl = getImagePath(footerLogoPath);
  const companyName = headerData.company_name || settings?.company_name || 'AccountGo SaaS';
  const heroTitle = heroData.title || t('Transform Your Business with AccountGo SaaS');
  const heroSubtitle = heroData.subtitle || t('The complete all-in-one business management solution for modern teams.');
  const heroImage = heroData.image ? getImagePath(heroData.image) : null;
  const primaryButtonText = heroData.primary_button_text || t('Start Free Trial');
  const secondaryButtonText = heroData.secondary_button_text || t('Request Demo');
  const featureItems = (featuresData.features || []).slice(0, 4);
  const galleryItems = (galleryData.images || []).slice(0, 3);

  const miniFeatures = featureItems.length > 0 ? featureItems : [{}, {}, {}, {}];
  const miniBenefits = (benefitsData.benefits || []).slice(0, 3);
  const visibleCount = sectionOrder.filter((key: string) => isSectionVisible(key)).length;

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-lg">
      <div className="border-b px-3 py-2" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}>
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
          {t('Live Preview')}
        </div>
      </div>

      <div className="relative bg-gray-100 p-3">
        <div className="absolute right-5 top-5 z-10 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
          <div className="text-xs font-medium text-white">{t('Mobile View')}</div>
        </div>

        <div className="mx-auto w-full max-w-[308px] overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <div className="h-6 bg-gray-100"></div>

          <div className="max-h-[620px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {isSectionVisible('header') && (
              <div className="border-b border-gray-200 bg-white px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="max-w-[128px]">
                    {logoUrl ? (
                      <img src={logoUrl} alt={companyName} className="h-9 w-auto object-contain" />
                    ) : (
                      <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                        {companyName}
                      </div>
                    )}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500">
                    <div className="space-y-1.5">
                      <div className="h-0.5 w-5 rounded-full bg-current"></div>
                      <div className="h-0.5 w-5 rounded-full bg-current"></div>
                      <div className="h-0.5 w-5 rounded-full bg-current"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isSectionVisible('hero') && (
              <section className="bg-white px-5 py-10">
                {heroImage && (
                  <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-lg">
                    <img src={heroImage} alt={heroTitle} className="h-36 w-full object-cover" />
                  </div>
                )}

                {!heroImage && (
                  <div className="mb-8 flex h-36 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 shadow-lg">
                    <div className="h-20 w-40 rounded-xl" style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}></div>
                  </div>
                )}

                <h2 className="mb-6 text-[28px] font-bold leading-[1.18] text-slate-900">
                  {heroTitle}
                </h2>
                <p className="mb-7 text-lg leading-9 text-slate-600">
                  {heroSubtitle}
                </p>
                <div className="space-y-3">
                  <div className="rounded-full px-5 py-3 text-center text-base font-semibold text-white" style={{ backgroundColor: colors.primary }}>
                    {primaryButtonText}
                  </div>
                  <div className="rounded-full border px-5 py-3 text-center text-base font-semibold text-slate-700" style={{ borderColor: `${colors.primary}55` }}>
                    {secondaryButtonText}
                  </div>
                </div>
              </section>
            )}

            {isSectionVisible('stats') && (
              <section className="px-5 pb-8">
                <div className="grid grid-cols-2 gap-3 rounded-3xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                  <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold">{statsData.businesses || '10K+'}</div>
                    <div className="mt-1 text-xs opacity-90">{t('Businesses')}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold">{statsData.uptime || '99.9%'}</div>
                    <div className="mt-1 text-xs opacity-90">{t('Uptime')}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold">{statsData.support || '24/7'}</div>
                    <div className="mt-1 text-xs opacity-90">{t('Support')}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-bold">{statsData.countries || '50+'}</div>
                    <div className="mt-1 text-xs opacity-90">{t('Countries')}</div>
                  </div>
                </div>
              </section>
            )}

            {isSectionVisible('features') && (
              <section className="bg-white px-5 py-8">
                <h3 className="mb-5 text-center text-[15px] font-bold text-slate-800">
                  {featuresData.title || t('Powerful Features')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {miniFeatures.map((feature: any, index: number) => (
                    <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                      <div className="mx-auto mb-3 h-6 w-6 rounded-full" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}></div>
                      <div className="text-xs font-medium leading-5 text-slate-700">
                        {feature.title || `${t('Feature')} ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isSectionVisible('modules') && (
              <section className="bg-gray-50 px-5 py-7">
                <h3 className="mb-4 text-center text-sm font-bold text-slate-800">
                  {modulesData.title || t('Business Solutions')}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {['ERP', 'CRM', 'HRM', 'POS'].map((module) => (
                    <div key={module} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-gray-200">
                      {module}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isSectionVisible('benefits') && (
              <section className="bg-white px-5 py-7">
                <h3 className="mb-4 text-center text-sm font-bold text-slate-800">
                  {benefitsData.title || t('Why Choose Us?')}
                </h3>
                <div className="space-y-3">
                  {(miniBenefits.length > 0 ? miniBenefits : [{}, {}, {}]).map((benefit: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                      <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                      <div className="text-sm leading-6 text-slate-600">
                        {benefit.title || `${t('Benefit')} ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isSectionVisible('gallery') && (
              <section className="bg-gray-50 px-5 py-7">
                <h3 className="mb-4 text-center text-sm font-bold text-slate-800">
                  {galleryData.title || t('Gallery')}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(galleryItems.length > 0 ? galleryItems : [{}, {}, {}]).map((image: any, index: number) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                      {image?.image ? (
                        <img src={getImagePath(image.image)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isSectionVisible('cta') && (
              <section className="px-5 py-8 text-white" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                <h3 className="mb-3 text-center text-lg font-bold leading-7">
                  {ctaData.title || t('Ready to Transform?')}
                </h3>
                <div className="space-y-3">
                  <div className="rounded-full bg-white px-4 py-3 text-center text-sm font-semibold" style={{ color: colors.primary }}>
                    {ctaData.primary_button || t('Start Trial')}
                  </div>
                  <div className="rounded-full border border-white/70 px-4 py-3 text-center text-sm font-semibold text-white">
                    {ctaData.secondary_button || t('Contact')}
                  </div>
                </div>
              </section>
            )}

            {isSectionVisible('footer') && (
              <footer className="bg-slate-950 px-5 py-8 text-white">
                <div className="border-b border-white/10 pb-4 text-center">
                  {footerLogoUrl ? (
                    <img
                      src={footerLogoUrl}
                      alt={companyName}
                      className="mx-auto h-12 w-auto object-contain"
                    />
                  ) : (
                    <div className="text-xl font-bold" style={{ color: colors.accent }}>
                      {companyName}
                    </div>
                  )}
                  <div className="mt-3 text-xs leading-5 text-slate-400">
                    {footerData.description || t('Business solution for modern teams.')}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{t('Product')}</span>
                  <span>{t('Company')}</span>
                  <span>{t('Support')}</span>
                </div>
              </footer>
            )}
          </div>
        </div>
      </div>

      <div className="border-t bg-gray-50 px-3 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{visibleCount} {t('sections active')}</span>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span>{t('Live')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}






