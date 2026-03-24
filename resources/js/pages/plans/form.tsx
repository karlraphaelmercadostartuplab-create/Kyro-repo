import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { InputError } from '@/components/ui/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubscriptionInfo } from '@/components/ui/subscription-info';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatAdminCurrency, getPackageAlias, getPackageFavicon } from '@/utils/helpers';

interface Plan {
    id?: number;
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
}

interface Module {
    module: string;
    alias: string;
    image: string;
}

interface UserSubscriptionInfo {
    is_superadmin: boolean;
    active_plan_id?: number;
    available_modules_count: number;
}

interface Props {
    plan?: Plan;
    activeModules: Module[];
    isEdit?: boolean;
    userSubscriptionInfo?: UserSubscriptionInfo;
}

function PlanForm({ plan, activeModules, isEdit = false, userSubscriptionInfo }: Props) {
    const { t } = useTranslation();
    const [moduleSearch, setModuleSearch] = useState('');

    const getCurrencySymbol = () => {
        return formatAdminCurrency(1).replace(/[\d\s.,]/g, '').trim();
    };

    const { data, setData, post, put, processing, errors } = useForm({
        name: plan?.name || '',
        description: plan?.description || '',
        number_of_users: plan?.number_of_users || 1,
        storage_limit: plan?.storage_limit || 0,
        total: plan?.storage_limit || 0,
        status: plan?.status ?? true,
        free_plan: plan?.free_plan ?? false,
        modules: plan?.modules || [],
        package_price_yearly: plan?.package_price_yearly || 0,
        package_price_monthly: plan?.package_price_monthly || 0,
        trial: plan?.trial ?? false,
        trial_days: plan?.trial_days || 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit && plan) {
            put(route('plans.update', plan.id));
        } else {
            post(route('plans.store'));
        }
    };

    const handleModuleChange = (moduleName: string, checked: boolean) => {
        if (checked) {
            setData('modules', [...data.modules, moduleName]);
        } else {
            setData('modules', data.modules.filter((m) => m !== moduleName));
        }
    };

    const filteredModules = activeModules.filter((module) =>
        module.alias.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        module.module.toLowerCase().includes(moduleSearch.toLowerCase())
    );

    const allFilteredSelected = filteredModules.length > 0 && filteredModules.every((module) => data.modules.includes(module.module));

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="order-2 space-y-4 xl:order-1 xl:col-span-3">
                    {userSubscriptionInfo && (
                        <SubscriptionInfo
                            userSubscriptionInfo={userSubscriptionInfo}
                            totalModulesCount={activeModules.length}
                        />
                    )}

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{t('Quick Settings')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <Label className="text-xs">{t('Active')}</Label>
                                <Switch checked={data.status} onCheckedChange={(checked) => setData('status', checked)} />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Label className="text-xs">{t('Trial')}</Label>
                                <Switch checked={data.trial} onCheckedChange={(checked) => setData('trial', checked)} />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Label className="text-xs">{t('Free')}</Label>
                                <Switch checked={data.free_plan} onCheckedChange={(checked) => setData('free_plan', checked)} />
                            </div>
                        </CardContent>
                    </Card>

                    {data.trial && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">{t('Trial Settings')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label className="text-xs">{t('Trial Days')}</Label>
                                    <Input
                                        type="number"
                                        placeholder={t('Enter trial days')}
                                        value={data.trial_days || 0}
                                        onChange={(e) => setData('trial_days', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!data.free_plan && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">{t('Pricing')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">{t('Monthly')} ({getCurrencySymbol()})</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder={t('Enter monthly price')}
                                        value={data.package_price_monthly || 0}
                                        onChange={(e) => setData('package_price_monthly', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">{t('Yearly')} ({getCurrencySymbol()})</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder={t('Enter yearly price')}
                                        value={data.package_price_yearly || 0}
                                        onChange={(e) => setData('package_price_yearly', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="order-1 min-w-0 space-y-6 xl:order-2 xl:col-span-9">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl">{t('Plan Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label required>{t('Plan Name')}</Label>
                                    <Input placeholder={t('Enter plan name')} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('Max Users')}</Label>
                                    <Input
                                        type="number"
                                        placeholder={t('Enter max users')}
                                        value={data.number_of_users || ''}
                                        onChange={(e) => setData('number_of_users', parseInt(e.target.value) || 0)}
                                    />
                                    <p className="text-xs text-gray-500">{t('Note: "-1" for Unlimited')}</p>
                                    <InputError message={errors.number_of_users} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('Storage Limit (GB)')}</Label>
                                    <Input
                                        type="number"
                                        placeholder={t('Enter storage limit in GB')}
                                        value={data.storage_limit || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setData('storage_limit', value);
                                            setData('total', value);
                                        }}
                                    />
                                    <InputError message={errors.storage_limit} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('Description')}</Label>
                                <Textarea
                                    placeholder={t('Enter plan description')}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="space-y-4">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <CardTitle className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                                        <span>{t('Features')}</span>
                                        <span className="flex flex-wrap gap-2">
                                            <Badge>{data.modules.length} {t('selected')}</Badge>
                                            {userSubscriptionInfo && !userSubscriptionInfo.is_superadmin && (
                                                <Badge variant="outline" className="text-xs">
                                                    {userSubscriptionInfo.available_modules_count} {t('available')}
                                                </Badge>
                                            )}
                                        </span>
                                    </CardTitle>
                                </div>
                            </div>

                            {userSubscriptionInfo && !userSubscriptionInfo.is_superadmin && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                                    <div className="flex items-start gap-2">
                                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                                {t('Subscription Limited')}
                                            </p>
                                            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                                                {t('Only showing {{count}} modules from your subscription. Contact admin to access more modules.', { count: userSubscriptionInfo.available_modules_count })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="min-w-0 flex-1">
                                    <Input
                                        value={moduleSearch}
                                        onChange={(e) => setModuleSearch(e.target.value)}
                                        placeholder={t('Search...')}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (allFilteredSelected) {
                                            setData('modules', data.modules.filter((module) => !filteredModules.map((filtered) => filtered.module).includes(module)));
                                        } else {
                                            setData('modules', [...new Set([...data.modules, ...filteredModules.map((module) => module.module)])]);
                                        }
                                    }}
                                >
                                    {allFilteredSelected ? t('Uncheck All') : t('Check All')}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[320px] w-full">
                                <div className="grid grid-cols-1 gap-3 pr-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                    {filteredModules.map((module) => (
                                        <div key={module.module} className="flex min-w-0 items-center gap-3 rounded border p-4 hover:bg-muted/50">
                                            <img src={getPackageFavicon(module.module)} alt="" className="h-8 w-8 flex-shrink-0 rounded border" />
                                            <span className="min-w-0 flex-1 truncate text-sm">{getPackageAlias(module.module)}</span>
                                            <Checkbox
                                                checked={data.modules.includes(module.module)}
                                                onCheckedChange={(checked) => handleModuleChange(module.module, !!checked)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <InputError message={errors.modules} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => window.history.back()}>
                    {t('Cancel')}
                </Button>
                <Button type="submit" className="w-full sm:w-auto" disabled={processing}>
                    {processing ? t('Saving...') : (isEdit ? t('Update') : t('Create'))}
                </Button>
            </div>
        </form>
    );
}

export default PlanForm;
export { PlanForm };
