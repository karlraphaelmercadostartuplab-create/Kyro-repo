import { useState, Suspense, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { allSettingsItems } from '@/utils/settings';
import { getSettingsComponent } from '@/utils/settings-components';

export default function Settings() {
  const { t } = useTranslation();
  const { auth, globalSettings = {}, emailProviders = {}, cacheSize = '0.00' } = usePage().props as any;
  const [activeSection, setActiveSection] = useState('brand-settings');

  const sidebarNavItems = allSettingsItems();

  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 96;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(elementPosition - headerOffset, 0),
        behavior: 'smooth',
      });

      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarNavItems.map(item => item.href.replace('#', ''));

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sidebarNavItems]);

  return (
    <AuthenticatedLayout
      breadcrumbs={[{ label: t('Settings') }]}
      pageTitle={t('Settings')}
    >
      <Head title={t('Settings')} />

      <div className="overflow-x-hidden">
        <div className="sticky top-4 z-20 mb-4 -mx-1 px-1 xl:hidden">
          <div className="overflow-x-auto pb-2">
            <div className="flex w-max min-w-full gap-2">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={activeSection === item.href.replace('#', '') ? 'default' : 'outline'}
                  className="shrink-0 whitespace-nowrap"
                  onClick={() => handleNavClick(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <aside className="hidden xl:block xl:w-72 xl:flex-shrink-0">
            <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <div className="space-y-1">
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn('w-full justify-start text-left', {
                      'bg-muted font-medium': activeSection === item.href.replace('#', ''),
                    })}
                    onClick={() => handleNavClick(item.href)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-8">
            {sidebarNavItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const canManage = auth.user?.permissions?.includes(item.permission);

              if (!canManage) return null;

              const Component = getSettingsComponent(item.component);
              if (!Component) return null;

              return (
                <section key={sectionId} id={sectionId} className="scroll-mt-24">
                  <Suspense fallback={<div className="p-4">Loading...</div>}>
                    <Component
                      userSettings={globalSettings}
                      auth={auth}
                      emailProviders={emailProviders}
                      cacheSize={cacheSize}
                    />
                  </Suspense>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
