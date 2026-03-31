import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { getAdminSetting, getImagePath } from '@/utils/helpers';
import { useTranslation } from 'react-i18next';
import { normalizeSafeLandingLink } from '../../units/safeLink';

interface HeaderProps {
    settings?: any;
}

const HEADER_VARIANTS = {
    header1: {
        nav: 'bg-white border-b border-gray-200 sticky top-0 z-50',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        wrapper: 'flex justify-between items-center h-16',
        logo: 'text-2xl font-bold lg:max-w-[180px] max-w-[140px]',
        desktop: 'hidden md:flex items-center space-x-2',
        mobile: 'md:hidden text-gray-600 p-2 transition-colors',
        mobileMenu: 'md:hidden bg-white border-t'
    },
    header2: {
        nav: 'bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        wrapper: 'flex flex-col items-center py-6 space-y-6',
        logo: 'text-3xl font-bold',
        desktop: 'flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full',
        mobile: 'md:hidden text-gray-600 p-2 transition-colors absolute top-4 right-4 hover:bg-gray-100 rounded-lg',
        mobileMenu: 'md:hidden bg-white border-t w-full shadow-lg'
    },
    header3: {
        nav: 'bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50',
        container: 'max-w-6xl mx-auto px-6 sm:px-8 lg:px-10',
        wrapper: 'flex justify-between items-center h-14 py-2',
        logo: 'text-xl font-bold',
        desktop: 'hidden md:flex items-center space-x-2',
        mobile: 'md:hidden text-gray-600 p-2 transition-colors hover:bg-gray-100 rounded-md',
        mobileMenu: 'md:hidden bg-white/95 backdrop-blur-md border-t'
    },
    header4: {
        nav: 'bg-black/20 backdrop-blur-md absolute top-0 left-0 right-0 z-50 border-b border-white/10',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        wrapper: 'flex justify-between items-center h-20 py-4',
        logo: 'text-2xl font-bold text-white drop-shadow-lg',
        desktop: 'hidden md:flex items-center space-x-2',
        mobile: 'md:hidden text-white p-2 transition-colors hover:bg-white/10 rounded-lg',
        mobileMenu: 'md:hidden bg-black/90 backdrop-blur-md border-t border-white/10'
    },
    header5: {
        nav: 'sticky top-0 z-50 shadow-xl',
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        wrapper: 'flex justify-between items-center h-20 py-4',
        logo: 'text-2xl font-bold text-white drop-shadow-lg',
        desktop: 'hidden md:flex items-center space-x-2',
        mobile: 'md:hidden text-white p-2 transition-colors hover:bg-white/10 rounded-lg',
        mobileMenu: 'md:hidden border-t border-white/20'
    }
};

export default function Header({ settings }: HeaderProps) {
    const { url } = usePage();
    const sectionData = settings?.config_sections?.sections?.header || {};
    const { t } = useTranslation();
    const variant = sectionData.variant || 'header1';
    const config = HEADER_VARIANTS[variant as keyof typeof HEADER_VARIANTS] || HEADER_VARIANTS.header1;

    const companyName = sectionData.company_name || settings?.company_name || 'AccountGo SaaS';
    const isAuthenticated = settings?.is_authenticated;
    const colors = settings?.config_sections?.colors || { primary: '#10b77f', secondary: '#059669', accent: '#f59e0b' };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const savedThemeMode = getAdminSetting('theme_mode') || getAdminSetting('themeMode');
    const isDarkDocument = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const themeMode = savedThemeMode || (isDarkDocument ? 'dark' : 'light');

    const useLightLogo = themeMode === 'dark' || variant === 'header4' || variant === 'header5';
    const preferredLogo = useLightLogo
        ? (getAdminSetting('logo_light') || getAdminSetting('logoLight'))
        : (getAdminSetting('logo_dark') || getAdminSetting('logoDark'));
    const fallbackLogo = useLightLogo
        ? (getAdminSetting('logo_dark') || getAdminSetting('logoDark'))
        : (getAdminSetting('logo_light') || getAdminSetting('logoLight'));

    const logoPath = preferredLogo || fallbackLogo;
    const logoUrl = logoPath ? getImagePath(logoPath) : null;

    const navigationItems = sectionData.navigation_items || [];
    const customPages = settings?.custom_pages || [];
    const customPageItems = customPages.map((page) => ({
        text: page.title,
        href: `/page/${page.slug}`,
        target: '_self'
    }));

    const allNavigationItems = [...navigationItems, ...customPageItems];
    const isOnLandingPage = url === '/' || url.startsWith('/?');

    const resolveNavHref = (rawHref?: string) => {
        if (!rawHref) return route('landing.page');
        const normalizedHref = normalizeSafeLandingLink(rawHref, route('landing.page'));

        if (normalizedHref === '/' || normalizedHref.toLowerCase() === 'home') {
            return route('landing.page');
        }

        if (normalizedHref.startsWith('/page/')) {
            return route('custom-page.show', normalizedHref.replace('/page/', ''));
        }

        if (normalizedHref.startsWith('#')) {
            return isOnLandingPage ? normalizedHref : route('landing.page') + normalizedHref;
        }

        return normalizedHref;
    };

    const renderNavItems = (isMobile = false) => {
        const isTransparentOrGradient = variant === 'header4' || variant === 'header5';
        const textColor = isTransparentOrGradient ? 'text-white' : 'text-gray-600 dark:text-gray-300';
        const hoverBg = variant === 'header2'
            ? 'hover:bg-gray-100 hover:shadow-sm dark:hover:bg-white/10'
            : variant === 'header3'
                ? 'hover:bg-gray-50 dark:hover:bg-white/10'
                : isTransparentOrGradient
                    ? 'hover:bg-white/10'
                    : 'hover:bg-gray-50 dark:hover:bg-white/10';

        return allNavigationItems.map((item) => {
            const isHomeItem = typeof item.text === 'string' && item.text.trim().toLowerCase() === 'home';
            const href = isHomeItem ? route('landing.page') : resolveNavHref(item.href);
            const isAnchorLink = href.includes('#');
            return item.target === '_blank' || isAnchorLink ? (
                <a
                    key={item.text}
                    href={href}
                    target={item.target === '_blank' ? '_blank' : undefined}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className={isMobile
                        ? `block px-4 py-3 text-base font-medium ${textColor} ${hoverBg} rounded-lg transition-all`
                        : `${textColor} px-4 py-2 text-sm font-medium ${hoverBg} rounded-lg transition-all duration-200`
                    }
                    style={!isMobile ? { '--hover-color': isTransparentOrGradient ? 'white' : colors.primary } as React.CSSProperties : {}}
                    onMouseEnter={!isMobile ? (e) => {
                        if (!isTransparentOrGradient) {
                            e.currentTarget.style.color = colors.primary;
                        }
                    } : undefined}
                    onMouseLeave={!isMobile ? (e) => e.currentTarget.style.color = '' : undefined}
                >
                    {item.text}
                </a>
            ) : (
                <Link
                    key={item.text}
                    href={href}
                    className={isMobile
                        ? `block px-4 py-3 text-base font-medium ${textColor} ${hoverBg} rounded-lg transition-all`
                        : `${textColor} px-4 py-2 text-sm font-medium ${hoverBg} rounded-lg transition-all duration-200`
                    }
                    style={!isMobile ? { '--hover-color': isTransparentOrGradient ? 'white' : colors.primary } as React.CSSProperties : {}}
                    onMouseEnter={!isMobile ? (e) => {
                        if (!isTransparentOrGradient) {
                            e.currentTarget.style.color = colors.primary;
                        }
                    } : undefined}
                    onMouseLeave={!isMobile ? (e) => e.currentTarget.style.color = '' : undefined}
                >
                    {item.text}
                </Link>
            );
        });
    };

    const renderCTAButtons = (isMobile = false) => {
        const enableRegistration = settings?.enable_registration !== false;

        if (isAuthenticated) {
            return (
                <button
                    onClick={() => router.visit(route('dashboard'))}
                    className={`text-white rounded-md font-medium transition-colors ${
                        isMobile ? 'px-4 py-2 text-sm w-full' :
                        variant === 'header3' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                    }`}
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    {t('Dashboard')}
                </button>
            );
        }

        if (enableRegistration) {
            return (
                <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
                    <button
                        onClick={() => router.visit(route('login'))}
                        className={`border rounded-md font-medium transition-colors ${
                            isMobile ? 'px-4 py-2 text-sm w-full' :
                            variant === 'header3' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                        }`}
                        style={{ borderColor: colors.primary, color: colors.primary }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = colors.primary;
                        }}
                    >
                        {t('Sign In')}
                    </button>
                    <button
                        onClick={() => router.visit(route('register'))}
                        className={`text-white rounded-md font-medium transition-colors ${
                            isMobile ? 'px-4 py-2 text-sm w-full' :
                            variant === 'header3' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                        }`}
                        style={{ backgroundColor: colors.primary }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                    >
                        {t('Get Started')}
                    </button>
                </div>
            );
        }

        return (
            <button
                onClick={() => router.visit(route('login'))}
                className={`text-white rounded-md font-medium transition-colors ${
                    isMobile ? 'px-4 py-2 text-sm w-full' :
                    variant === 'header3' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                }`}
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
                {t('Sign In')}
            </button>
        );
    };

    const getGradientStyle = () => {
        if (variant === 'header5') {
            return {
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
            };
        }
        return {};
    };

    const getMobileMenuStyle = () => {
        if (variant === 'header5') {
            return {
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
            };
        }
        return {};
    };

    return (
        <nav className={config.nav} style={getGradientStyle()}>
            <div className={config.container}>
                <div className={config.wrapper}>
                    <Link href={route('landing.page')} className={config.logo} style={{ color: colors.primary }}>
                        {logoUrl ? (
                            <img src={logoUrl} alt={companyName} className="w-auto" />
                        ) : (
                            companyName
                        )}
                    </Link>

                    <div className={config.desktop}>
                        {renderNavItems()}
                        {sectionData?.enable_pricing_link !== false && (
                            <Link
                                href={route('pricing.page')}
                                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                                    variant === 'header4' || variant === 'header5'
                                        ? 'text-white hover:bg-white/10'
                                        : variant === 'header2'
                                            ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:shadow-sm dark:hover:bg-white/10'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                                }`}
                                onMouseEnter={(e) => {
                                    if (variant !== 'header4' && variant !== 'header5') {
                                        e.currentTarget.style.color = colors.primary;
                                    }
                                }}
                                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                            >
                                {t('Pricing')}
                            </Link>
                        )}
                        {renderCTAButtons()}
                    </div>

                    <button
                        className={config.mobile}
                        onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.color = ''}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className={config.mobileMenu} style={getMobileMenuStyle()}>
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {renderNavItems(true)}
                        {sectionData?.enable_pricing_link !== false && (
                            <Link
                                href={route('pricing.page')}
                                className="block px-4 py-3 text-base font-medium text-gray-600 transition-all rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/10"
                            >
                                {t('Pricing')}
                            </Link>
                        )}
                        <div className="px-2 pt-2">
                            {renderCTAButtons(true)}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
