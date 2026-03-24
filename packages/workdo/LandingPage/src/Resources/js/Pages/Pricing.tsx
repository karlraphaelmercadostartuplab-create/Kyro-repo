import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CookieConsent from '@/components/cookie-consent';
import { formatAdminCurrency, getAdminSetting, getImagePath } from '@/utils/helpers';

import Footer from './components/Footer';
import Header from './components/Header';

interface Plan {
    id: number;
    name: string;
    description?: string;
    package_price_monthly: number;
    package_price_yearly: number;
    number_of_users: number;
    storage_limit: number;
    modules: string[];
    free_plan: boolean;
    trial: boolean;
    trial_days: number;
    orders_count?: number;
}

interface Module {
    module: string;
    alias: string;
    image?: string;
    monthly_price?: number;
    yearly_price?: number;
}

interface PricingProps {
    plans?: Plan[];
    activeModules?: Module[];
    settings?: any;
    filters?: {
        search?: string;
        category?: string;
        price?: string;
        price_type?: string;
        sort?: string;
    };
}

export default function Pricing(props: PricingProps) {
    const { t } = useTranslation();
    const favicon = getAdminSetting('favicon');
    const faviconUrl = favicon ? getImagePath(favicon) : null;
    const { adminAllSetting, auth } = usePage().props as any;
    const plans = props.plans || [];
    const activeModules = props.activeModules || [];
    const settings = { ...props.settings, is_authenticated: auth?.user?.id !== undefined && auth?.user?.id !== null };
    const colors = settings?.config_sections?.colors || { primary: '#10b77f', secondary: '#059669', accent: '#f59e0b' };
    const pricingSettings = settings?.config_sections?.sections?.pricing || {};

    const [priceType, setPriceType] = useState(pricingSettings.default_price_type || 'monthly');

    const mostPopularPlanId = plans.length > 0
        ? plans.reduce((prev, current) => ((current.orders_count || 0) > (prev.orders_count || 0) ? current : prev)).id
        : null;

    const handlePrimaryAction = () => {
        if (settings?.is_authenticated) {
            router.visit(route('dashboard'));
            return;
        }

        router.visit(route('register'));
    };

    const renderPlanActions = (plan: Plan) => (
        <div className="space-y-2 border-t pt-4">
            <button
                className="w-full rounded-md px-4 py-2 font-medium text-white transition-colors"
                style={{ backgroundColor: colors.primary }}
                onClick={handlePrimaryAction}
            >
                {settings?.is_authenticated ? t('Go to Dashboard') : t('Get Started')}
            </button>
            {plan.trial && !settings?.is_authenticated && (
                <button
                    className="w-full rounded-md border px-4 py-2 font-medium transition-colors"
                    style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary;
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.primary;
                    }}
                    onClick={() => router.visit(route('register'))}
                >
                    {t('Start Trial')} ({plan.trial_days}d)
                </button>
            )}
        </div>
    );

    return (
        <div className="landing-theme min-h-screen bg-background text-foreground">
            <Head title="Pricing">
                {faviconUrl && <link rel="icon" type="image/x-icon" href={faviconUrl} />}
            </Head>

            <Header settings={settings} />

            <main className="min-h-screen bg-gray-50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-4xl">
                            {pricingSettings.title || t('Subscription Setting')}
                        </h1>
                        <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
                            {pricingSettings.subtitle || t('Choose the perfect subscription plan for your business needs')}
                        </p>
                    </div>

                    {pricingSettings.show_monthly_yearly_toggle === true && (
                        <div className="mb-8 flex justify-center px-4">
                            <div className="w-full max-w-xs rounded-lg bg-gray-100 p-1">
                                <div className="grid grid-cols-2 gap-1">
                                    <button
                                        onClick={() => setPriceType('monthly')}
                                        className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                            priceType === 'monthly'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {t('Monthly')}
                                    </button>
                                    <button
                                        onClick={() => setPriceType('yearly')}
                                        className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                            priceType === 'yearly'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {t('Yearly')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {pricingSettings.show_pre_package === true && plans.length > 0 ? (
                        <div className="space-y-6 overflow-x-hidden pt-10">
                            <div className="space-y-6 xl:hidden">
                                {plans.map((plan) => {
                                    const enabledAddOns = activeModules.filter((module) => plan.modules?.includes(module.module));
                                    const totalAddOns = activeModules.length;

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`relative overflow-visible rounded-2xl border-2 bg-white p-5 pt-8 ${
                                                plan.id === mostPopularPlanId && plans.length > 1 ? '' : 'border-gray-200'
                                            }`}
                                            style={plan.id === mostPopularPlanId && plans.length > 1
                                                ? {
                                                    borderColor: colors.primary,
                                                    boxShadow: `0 0 0 2px ${colors.primary}20`
                                                }
                                                : {}}
                                        >
                                            {plan.id === mostPopularPlanId && plans.length > 1 && (
                                                <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[55%]">
                                                    <div
                                                        className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold text-white shadow-lg"
                                                        style={{ backgroundColor: colors.primary, minWidth: '140px', textAlign: 'center' }}
                                                    >
                                                        {t('Most Popular')}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-5">
                                                <div className="space-y-3 text-center">
                                                    <div>
                                                        <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                                                        <p className="text-sm text-gray-600">{plan.description}</p>
                                                    </div>

                                                    {plan.free_plan ? (
                                                        <div>
                                                            <div className="mb-1 text-4xl font-black" style={{ color: colors.primary }}>
                                                                {t('Free')}
                                                            </div>
                                                            <div className="font-semibold" style={{ color: colors.primary }}>
                                                                {t('Forever')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-baseline justify-center space-x-1">
                                                            <span className="text-4xl font-normal text-gray-900">
                                                                {priceType === 'monthly'
                                                                    ? formatAdminCurrency(plan.package_price_monthly)
                                                                    : formatAdminCurrency(plan.package_price_yearly)}
                                                            </span>
                                                            <span className="text-xl font-semibold text-gray-500">
                                                                /{priceType === 'monthly' ? 'mo' : 'yr'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {plan.number_of_users === -1 ? 'Unlimited users' : `${plan.number_of_users} users`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {Math.round(plan.storage_limit / (1024 * 1024))}{t('GB storage')}
                                                        </span>
                                                    </div>
                                                    {plan.trial && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                                                            <span className="text-sm font-medium text-green-600">
                                                                {plan.trial_days}{t('d trial')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                                                        <span className="text-sm font-semibold text-gray-900">{t('Features')}</span>
                                                        <span className="text-xs font-semibold text-gray-500">
                                                            {enabledAddOns.length}/{totalAddOns} {t('Enabled')}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {activeModules.map((module) => {
                                                            const isEnabled = plan.modules?.includes(module.module);

                                                            return (
                                                                <div
                                                                    key={module.module}
                                                                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2"
                                                                >
                                                                    <span className="min-w-0 truncate text-sm text-gray-700">{module.alias}</span>
                                                                    <div className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                                        {isEnabled ? (
                                                                            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {renderPlanActions(plan)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="hidden overflow-x-auto overflow-y-visible pb-2 pt-4 xl:block">
                                <div
                                    className="grid gap-6"
                                    style={{
                                        gridTemplateColumns: `200px repeat(${plans.length}, 280px)`,
                                        minWidth: `${200 + (plans.length * 280) + ((plans.length - 1) * 24)}px`
                                    }}
                                >
                                    <div className="sticky left-0 z-20 rounded-xl border border-gray-200 bg-white p-4">
                                        <div className="flex items-center justify-center space-x-3">
                                            <h3 className="text-lg font-bold text-gray-900">{t('Features')}</h3>
                                        </div>
                                    </div>

                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`relative overflow-visible rounded-2xl border-2 bg-white p-6 pt-10 ${
                                                plan.id === mostPopularPlanId && plans.length > 1 ? '' : 'border-gray-200'
                                            }`}
                                            style={plan.id === mostPopularPlanId && plans.length > 1
                                                ? {
                                                    borderColor: colors.primary,
                                                    boxShadow: `0 0 0 2px ${colors.primary}20`
                                                }
                                                : {}}
                                        >
                                            {plan.id === mostPopularPlanId && plans.length > 1 && (
                                                <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[55%]">
                                                    <div
                                                        className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold text-white shadow-lg"
                                                        style={{ backgroundColor: colors.primary, minWidth: '140px', textAlign: 'center' }}
                                                    >
                                                        {t('Most Popular')}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4 text-center">
                                                <div>
                                                    <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                                                    <p className="text-sm text-gray-600">{plan.description}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    {plan.free_plan ? (
                                                        <div>
                                                            <div className="mb-1 text-4xl font-black" style={{ color: colors.primary }}>
                                                                {t('Free')}
                                                            </div>
                                                            <div className="font-semibold" style={{ color: colors.primary }}>
                                                                {t('Forever')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="mb-2 flex items-baseline justify-center space-x-1">
                                                            <span className="text-4xl font-normal text-gray-900">
                                                                {priceType === 'monthly'
                                                                    ? formatAdminCurrency(plan.package_price_monthly)
                                                                    : formatAdminCurrency(plan.package_price_yearly)}
                                                            </span>
                                                            <span className="text-xl font-semibold text-gray-500">
                                                                /{priceType === 'monthly' ? 'mo' : 'yr'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {plan.number_of_users === -1 ? 'Unlimited users' : `${plan.number_of_users} users`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {Math.round(plan.storage_limit / (1024 * 1024))}{t('GB storage')}
                                                        </span>
                                                    </div>
                                                    {plan.trial && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                                                            <span className="text-sm font-medium text-green-600">
                                                                {plan.trial_days}{t('d trial')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <div
                                        className="grid gap-6"
                                        style={{
                                            gridTemplateColumns: `300px repeat(${plans.length}, 280px)`,
                                            minWidth: `${300 + (plans.length * 280) + ((plans.length - 1) * 24)}px`
                                        }}
                                    >
                                        <div className="sticky left-0 z-20 rounded-2xl border border-gray-200 bg-white p-6">
                                            <div className="space-y-3">
                                                <div className="mb-3 flex h-10 items-center justify-center border-b border-gray-200 py-2">
                                                    <span className="text-sm font-semibold text-gray-900">{t('Features')}</span>
                                                </div>
                                                {activeModules.map((module) => (
                                                    <div key={module.module} className="flex h-10 items-center justify-center py-2">
                                                        <span className="text-sm capitalize text-gray-700">{module.alias}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {plans.map((plan) => {
                                            const enabledAddOns = activeModules.filter((module) => plan.modules?.includes(module.module));
                                            const totalAddOns = activeModules.length;

                                            return (
                                                <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-6">
                                                    <div className="space-y-3">
                                                        <div className="mb-3 flex h-10 items-center justify-center border-b border-gray-200 py-2">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {enabledAddOns.length}/{totalAddOns} {t('Enabled')}
                                                            </span>
                                                        </div>
                                                        {activeModules.map((module) => (
                                                            <div key={module.module} className="flex h-10 items-center justify-center py-2">
                                                                {plan.modules?.includes(module.module) ? (
                                                                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                                                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                ) : (
                                                                    <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                                                                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {renderPlanActions(plan)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-16 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">{t('No Plans Available')}</h3>
                            <p className="text-gray-600">{pricingSettings.empty_message || t('Check back later for new pricing plans.')}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer settings={settings} />

            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}



