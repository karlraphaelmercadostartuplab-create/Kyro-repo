import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from '@/components/ui/button';
import { Check, Plus, Edit, Trash2, X, MoreVertical, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate, formatAdminCurrency, formatStorage } from '@/utils/helpers';

interface Plan {
    id: number;
    name: string;
    description: string;
    number_of_users: number;
    status: boolean;
    free_plan: boolean;
    modules: string[];
    package_price_yearly: number;
    package_price_monthly: number;
    storage_limit: number;
    trial: boolean;
    trial_days: number;
    orders_count?: number;
    creator?: {
        name: string;
    };
}

interface Props {
    plans: Plan[];
    canCreate: boolean;
    activeModules: { module: string; alias: string; image: string; monthly_price: number; yearly_price: number }[];
    bankTransferEnabled: string;
    userTrialInfo?: {
        is_trial_done: number;
        trial_expire_date: string | null;
    };
}

export default function PlansIndex({ plans, canCreate, activeModules }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const isCompanyUser = !auth.user?.roles?.includes('superadmin');

    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
    const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const handleDelete = (plan: Plan) => {
        setDeletingPlan(plan);
    };

    const confirmDelete = () => {
        if (deletingPlan) {
            router.delete(route('plans.destroy', deletingPlan.id));
            setDeletingPlan(null);
        }
    };

    const allModules = activeModules.sort((a, b) => a.alias.localeCompare(b.alias));
    const activePlans = plans.filter((plan) => plan.status);
    const isUnlimitedUsers = (userCount: unknown) => Number(userCount) === -1;

    const mostPopularPlanId = activePlans.length > 0
        ? activePlans.reduce((prev, current) => ((current.orders_count || 0) > (prev.orders_count || 0) ? current : prev)).id
        : null;

    const hasModule = (plan: Plan, moduleObj: { module: string; alias: string; image: string }) => {
        return Array.isArray(plan.modules) ? plan.modules.includes(moduleObj.module) : false;
    };

    const handleStartTrial = (plan: Plan) => {
        router.post(route('plans.start-trial', plan.id), {}, {
            preserveState: true,
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleAssignFreePlan = (plan: Plan) => {
        router.post(route('plans.assign-free', plan.id), {
            duration: pricingPeriod === 'monthly' ? 'Month' : 'Year'
        }, {
            preserveState: true
        });
    };

    const canStartTrial = (plan: Plan) => {
        return isCompanyUser &&
            plan.trial &&
            plan.trial_days > 0 &&
            (auth.user?.is_trial_done === 0 || auth.user?.is_trial_done === '0');
    };

    const isCurrentlySubscribed = (plan: Plan) => {
        if (!isCompanyUser || !auth.user?.active_plan) return false;
        return auth.user.active_plan === plan.id &&
            auth.user.plan_expire_date &&
            new Date(auth.user.plan_expire_date) > new Date();
    };

    const renderPlanMenu = (plan: Plan) => {
        if (isCompanyUser) {
            return null;
        }

        return (
            <div className="absolute right-4 top-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={route('plans.edit', plan.id)} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                {t('Edit')}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(plan)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('Delete')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    };

    const renderCompanyActions = (plan: Plan) => {
        if (!isCompanyUser) {
            return null;
        }

        if (isCurrentlySubscribed(plan)) {
            return (
                <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-center dark:border-green-800 dark:bg-green-900/20">
                    <p className="text-xs text-green-600 dark:text-green-300">
                        {t('Expires on')} {formatDate(auth.user.plan_expire_date)}
                    </p>
                </div>
            );
        }

        if (auth.user?.trial_expire_date && auth.user.active_plan === plan.id) {
            return (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-center dark:border-blue-800 dark:bg-blue-900/20">
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                        {t('Trial expires on')} {formatDate(auth.user.trial_expire_date)}
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-2 border-t pt-4">
                {plan.free_plan ? (
                    <Button className="w-full" size="sm" onClick={() => handleAssignFreePlan(plan)}>
                        {t('Subscribe to Plan')}
                    </Button>
                ) : (
                    <Button className="w-full" size="sm" onClick={() => router.visit(route('plans.subscribe', plan.id))}>
                        {t('Subscribe to Plan')}
                    </Button>
                )}
                {canStartTrial(plan) && (
                    <Button className="w-full" size="sm" variant="outline" onClick={() => handleStartTrial(plan)}>
                        <Clock className="mr-2 h-4 w-4" />
                        {t('Start Trial')} ({plan.trial_days}d)
                    </Button>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[{ label: t('Subscription Setting') }]}
            pageTitle={t('Subscription Setting')}
            pageActions={
                !isCompanyUser ? (
                    <TooltipProvider>
                        {canCreate && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link href={route('plans.create')}>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('Create')}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                ) : null
            }
        >
            <Head title={t('Plans')} />

            <div className="min-w-0 space-y-6 overflow-x-hidden">
                <div className="flex w-full justify-center px-0 sm:px-4">
                    <div className="w-full max-w-xs overflow-hidden rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                        <div className="grid grid-cols-2 gap-1">
                            <button
                                onClick={() => setPricingPeriod('monthly')}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                    pricingPeriod === 'monthly'
                                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                }`}
                            >
                                {t('Monthly')}
                            </button>
                            <button
                                onClick={() => setPricingPeriod('yearly')}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                    pricingPeriod === 'yearly'
                                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                }`}
                            >
                                {t('Yearly')}
                            </button>
                        </div>
                    </div>
                </div>

                {activePlans.length > 0 ? (
                    <div className="space-y-6 overflow-x-hidden pt-8 sm:pt-10">
                        <div className="mx-auto w-full max-w-md space-y-6 xl:hidden">
                            {activePlans.map((plan) => {
                                const enabledFeatures = allModules.filter((module) => hasModule(plan, module));
                                const totalFeatures = allModules.length;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative mx-auto w-full max-w-full overflow-visible rounded-2xl border-2 bg-white p-4 pt-8 sm:p-5 dark:bg-gray-800 ${
                                            plan.id === mostPopularPlanId && activePlans.length > 1
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        {plan.id === mostPopularPlanId && activePlans.length > 1 && (
                                            <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[55%]">
                                                <div className="rounded-md bg-primary px-3 py-2 text-center text-sm font-bold text-white shadow-lg sm:px-4" style={{ minWidth: '140px', maxWidth: 'calc(100vw - 64px)' }}>
                                                    {t('Most Popular')}
                                                </div>
                                            </div>
                                        )}

                                        {renderPlanMenu(plan)}

                                        <div className="space-y-5">
                                            <div className="space-y-3 text-center">
                                                <div>
                                                    <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{plan.description}</p>
                                                </div>

                                                {plan.free_plan ? (
                                                    <div>
                                                        <div className="mb-1 break-words text-4xl font-black text-primary sm:text-5xl">
                                                            {t('Free')}
                                                        </div>
                                                        <div className="font-semibold text-primary">{t('Forever')}</div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-baseline justify-center space-x-1">
                                                        <span className="break-all text-4xl font-normal text-gray-900 dark:text-white sm:text-5xl">
                                                            {formatAdminCurrency(pricingPeriod === 'monthly' ? plan.package_price_monthly : plan.package_price_yearly)}
                                                        </span>
                                                        <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                            /{pricingPeriod === 'monthly' ? t('mo') : t('yr')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {isUnlimitedUsers(plan.number_of_users) ? t('Unlimited users') : `${plan.number_of_users} ${t('users')}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {formatStorage(plan.storage_limit)} {t('storage')}
                                                    </span>
                                                </div>
                                                {plan.trial && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                            {plan.trial_days}d {t('trial')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                                                <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3 dark:border-gray-700">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('Features')}</span>
                                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                        {enabledFeatures.length}/{totalFeatures} {t('Enabled')}
                                                    </span>
                                                </div>
                                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    {allModules.map((module) => {
                                                        const enabled = hasModule(plan, module);

                                                        return (
                                                            <div
                                                                key={module.module}
                                                                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                                                            >
                                                                <span className="min-w-0 truncate text-sm text-gray-700 dark:text-gray-300">{module.alias}</span>
                                                                {enabled ? (
                                                                    <div className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                                                                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                                        <X className="h-4 w-4 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {renderCompanyActions(plan)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hidden overflow-x-auto overflow-y-visible pb-2 pt-4 xl:block">
                            <div
                                className="grid gap-6"
                                style={{
                                    gridTemplateColumns: `300px repeat(${activePlans.length}, 280px)`,
                                    minWidth: `${300 + (activePlans.length * 280) + ((activePlans.length - 1) * 24)}px`
                                }}
                            >
                                <div className="sticky left-0 z-20 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                                    <div className="flex items-center justify-center space-x-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('Features')}</h3>
                                    </div>
                                </div>

                                {activePlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative overflow-visible rounded-2xl border-2 bg-white p-6 pt-10 dark:bg-gray-800 ${
                                            plan.id === mostPopularPlanId && activePlans.length > 1
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        {plan.id === mostPopularPlanId && activePlans.length > 1 && (
                                            <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[55%]">
                                                <div className="rounded-md bg-primary px-3 py-2 text-center text-sm font-bold text-white shadow-lg sm:px-4" style={{ minWidth: '140px', maxWidth: 'calc(100vw - 64px)' }}>
                                                    {t('Most Popular')}
                                                </div>
                                            </div>
                                        )}

                                        {renderPlanMenu(plan)}

                                        <div className="space-y-4 text-center">
                                            <div>
                                                <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-300">{plan.description}</p>
                                            </div>

                                            {plan.free_plan ? (
                                                <div>
                                                    <div className="mb-1 text-5xl font-black text-primary">{t('Free')}</div>
                                                    <div className="font-semibold text-primary">{t('Forever')}</div>
                                                </div>
                                            ) : (
                                                <div className="mb-2 flex items-baseline justify-center space-x-1">
                                                    <span className="text-5xl font-normal text-gray-900 dark:text-white">
                                                        {formatAdminCurrency(pricingPeriod === 'monthly' ? plan.package_price_monthly : plan.package_price_yearly)}
                                                    </span>
                                                    <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                        /{pricingPeriod === 'monthly' ? t('mo') : t('yr')}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="space-y-3 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {isUnlimitedUsers(plan.number_of_users) ? t('Unlimited users') : `${plan.number_of_users} ${t('users')}`}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {formatStorage(plan.storage_limit)} {t('storage')}
                                                    </span>
                                                </div>
                                                {plan.trial && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                            {plan.trial_days}d {t('trial')}
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
                                        gridTemplateColumns: `300px repeat(${activePlans.length}, 280px)`,
                                        minWidth: `${300 + (activePlans.length * 280) + ((activePlans.length - 1) * 24)}px`
                                    }}
                                >
                                    <div className="sticky left-0 z-20 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                        <div className="space-y-3">
                                            <div className="mb-3 flex h-10 items-center justify-center border-b border-gray-200 py-2 dark:border-gray-600">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('Features')}</span>
                                            </div>
                                            {allModules.map((module) => (
                                                <div key={module.module} className="flex h-6 items-center justify-center py-0.5">
                                                    <span className="text-center text-sm capitalize leading-none text-gray-700 dark:text-gray-300">
                                                        {module.alias}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {activePlans.map((plan) => {
                                        const enabledFeatures = allModules.filter((module) => hasModule(plan, module));
                                        const totalFeatures = allModules.length;

                                        return (
                                            <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                                                <div className="space-y-3">
                                                    <div className="mb-3 flex h-10 items-center justify-center border-b border-gray-200 py-2 dark:border-gray-600">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {enabledFeatures.length}/{totalFeatures} {t('Enabled')}
                                                        </span>
                                                    </div>
                                                    {allModules.map((module) => (
                                                        <div key={module.module} className="flex h-6 items-center justify-center py-0.5">
                                                            {hasModule(plan, module) ? (
                                                                <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                                                                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                </div>
                                                            ) : (
                                                                <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                                    <X className="h-3 w-3 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {renderCompanyActions(plan)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            {t('No active plans found')}
                        </h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                            {t('Create your first plan to get started')}
                        </p>
                        {canCreate && (
                            <Link href={route('plans.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('Create Plan')}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <Dialog open={!!deletingPlan} onOpenChange={() => setDeletingPlan(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('Delete Plan')}</DialogTitle>
                        <DialogDescription>
                            {t('Are you sure you want to delete')} "{deletingPlan?.name}"? {t('This action cannot be undone.')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingPlan(null)}>
                            {t('Cancel')}
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            {t('Delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}


