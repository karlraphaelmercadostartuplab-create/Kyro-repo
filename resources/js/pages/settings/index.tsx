import { useState, Suspense } from 'react';
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
      const scrollContainer = element.closest('main');

      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const top = elementRect.top - containerRect.top + scrollContainer.scrollTop - headerOffset;

        scrollContainer.scrollTo({
          top: Math.max(top, 0),
          behavior: 'smooth',
        });
      } else {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: Math.max(elementPosition - headerOffset, 0),
          behavior: 'smooth',
        });
      }

      setActiveSection(id);
    }
  };

  return (
    <AuthenticatedLayout
      breadcrumbs={[{ label: t('Settings') }]}
    >
      <Head title={t('Settings')} />

      <div className="min-w-0">
        <div className="sticky top-4 z-20 mb-4 -mx-1 px-1 lg:hidden">
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

        <div className="min-w-0 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-6">
           <aside className="hidden lg:sticky lg:top-4 lg:z-20 lg:block lg:self-start">
            <div className="max-h-[calc(100svh-2rem)] overflow-y-auto pr-1 pb-16">
              <div className="mb-2 px-1">
                <h1 className="text-base font-semibold">{t('Settings')}</h1>
              </div>
              <div className="space-y-1 pr-2">
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn('h-9 w-full justify-start gap-2 px-2.5 text-left text-sm leading-tight', {
                      'bg-muted font-medium': activeSection === item.href.replace('#', ''),
                    })}
                    onClick={() => handleNavClick(item.href)}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-8">
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
