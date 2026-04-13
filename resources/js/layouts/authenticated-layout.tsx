import { PropsWithChildren, ReactNode, Fragment, useEffect } from "react";
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavUser } from "@/components/nav-user";
import { usePage, Head, Link, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { BrandProvider, useBrand } from "@/contexts/brand-context";
import CookieConsent from "@/components/cookie-consent";
import { useFavicon } from "@/hooks/use-favicon";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { useFlashMessages } from "@/hooks/useFlashMessages";

function AuthenticatedLayoutContent({
    header,
    children,
    breadcrumbs,
    pageTitle,
    pageActions
}: PropsWithChildren<{
    header?: ReactNode;
    breadcrumbs?: Array<{label: string, url?: string}>;
    pageTitle?: string;
    pageActions?: ReactNode;
    className?: string;
}>) {
    const { t } = useTranslation();
    const { auth, companyAllSetting, adminAllSetting } = usePage<PageProps>().props as any;
    const { settings } = useBrand();
    const mobileBreadcrumbs = breadcrumbs?.length ? [breadcrumbs[breadcrumbs.length - 1]] : [];
    useFavicon();
    useFlashMessages();

    useEffect(() => {
        // Prevent window-level scrollbar in authenticated pages.
        document.documentElement.classList.add('auth-no-window-scroll');
        document.body.classList.add('auth-no-window-scroll');

        return () => {
            document.documentElement.classList.remove('auth-no-window-scroll');
            document.body.classList.remove('auth-no-window-scroll');
        };
    }, []);

    return (
        <>
        <Head>
            {companyAllSetting?.metaKeywords && (
                <meta name="keywords" content={companyAllSetting.metaKeywords} />
            )}
            {companyAllSetting?.metaDescription && (
                <meta name="description" content={companyAllSetting.metaDescription} />
            )}
            {companyAllSetting?.metaImage && (
                <meta property="og:image" content={companyAllSetting.metaImage} />
            )}
        </Head>
        <div
            className={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
            data-theme={settings.themeMode}
            dir={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
            style={{ direction: settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr' }}
        >
        <SidebarProvider defaultOpen={true} className="min-w-0 overflow-x-clip">
            <AppSidebar />

            <SidebarInset className="min-w-0 h-svh overflow-hidden"
                style={{ direction: settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr' }}
                dir={settings.layoutDirection === 'rtl' ? 'rtl' : 'ltr'}
            >
                <header
                    className={`bg-background mb-2 flex h-20 min-w-0 shrink-0 flex-wrap items-start justify-between gap-2 overflow-visible border-b px-4 py-3 sm:h-12 sm:flex-nowrap sm:items-center sm:overflow-x-hidden sm:py-1`}
                    >
                    {/* Sidebar + Breadcrumb */}
                    <div className={`flex min-w-0 flex-1 items-start gap-2 ${ settings.layoutDirection === "rtl" ? "order-2 flex-row-reverse" : "order-1" } sm:items-center`} >
                        {/* SidebarTrigger */}
                        <SidebarTrigger className={`-ml-1 rtl:ml-0 rtl:-mr-1 ${ settings.layoutDirection === "rtl" ? "order-3" : "order-1" }`} />

                        {/* Separator */}
                        <Separator orientation="vertical" className="mx-2 h-4 order-2" />

                        {/* Breadcrumb */}
                        <Breadcrumb className={`min-w-0 flex-1 ${ settings.layoutDirection === "rtl" ? "order-1" : "order-3" }`} >
                            <BreadcrumbList className={`flex min-w-0 flex-wrap text-xs sm:hidden ${ settings.layoutDirection === "rtl" ? "justify-end" : "justify-start" }`} >
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={route("dashboard")}>{t('Dashboard')}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {mobileBreadcrumbs.map((crumb, index) => (
                                <Fragment key={`mobile-${index}`}>
                                <BreadcrumbSeparator className={settings.layoutDirection === 'rtl' ? 'rotate-180' : ''} />
                                <BreadcrumbItem>
                                    {crumb.url ? (
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.url}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                    ) : (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                </Fragment>
                            ))}
                            </BreadcrumbList>
                            <BreadcrumbList className={`hidden min-w-0 flex-wrap text-sm sm:flex ${ settings.layoutDirection === "rtl" ? "justify-end" : "justify-start" }`} >
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={route("dashboard")}>{t('Dashboard')}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {breadcrumbs?.map((crumb, index) => (
                                <Fragment key={index}>
                                <BreadcrumbSeparator className={settings.layoutDirection === 'rtl' ? 'rotate-180' : ''} />
                                <BreadcrumbItem>
                                    {crumb.url ? (
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.url}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                    ) : (
                                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                </Fragment>
                            ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* NavUser */}
                    <div
                        className={`flex min-w-0 items-center gap-2 ${
                        settings.layoutDirection === "rtl" ? "order-1 flex-row-reverse" : "order-2"
                        }`}
                    >
                        {/* Leave Impersonation Button */}
                        {auth.impersonating && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.post(route('users.leave-impersonation'))}
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            >
                                <UserX className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                {t('Leave Login As User')}
                            </Button>
                        )}
                        <NavUser user={auth.user} inHeader={true} />
                    </div>
                </header>

                <main className="min-w-0 flex-1 min-h-0 overflow-y-auto overflow-x-clip scrollbar-hover-only [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-4 md:pt-0">
                    {pageTitle && (
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center" dir={settings.layoutDirection}>
                            <h1 className="min-w-0 flex-1 break-words text-xl font-semibold">{pageTitle}</h1>
                            <div className="flex w-full flex-wrap justify-start gap-2 sm:w-auto sm:flex-shrink-0 sm:justify-end">{pageActions}</div>
                        </div>
                    )}
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
        <CookieConsent settings={adminAllSetting || {}} />
        </div>
        </>
    );
}

export default function AuthenticatedLayout(props: PropsWithChildren<{
    header?: ReactNode;
    breadcrumbs?: Array<{label: string, url?: string}>;
    pageTitle?: string;
    pageActions?: ReactNode;
    className?: string;
}>) {
    return (
        <BrandProvider>
            <AuthenticatedLayoutContent {...props} />
        </BrandProvider>
    );
}
