import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { FileText, Search, Printer } from "lucide-react";
import { DatePicker } from '@/components/ui/date-picker';
import { formatDate, formatCurrency } from '@/utils/helpers';
import NoRecordsFound from '@/components/no-records-found';

interface TrialBalanceAccount {
    id: number;
    account_code: string;
    account_name: string;
    debit: number;
    credit: number;
}

interface TrialBalanceData {
    accounts: TrialBalanceAccount[];
    total_debit: number;
    total_credit: number;
    is_balanced: boolean;
    from_date: string;
    to_date: string;
}

interface TrialBalanceProps {
    trialBalance: TrialBalanceData;
    auth: {
        user: {
            permissions: string[];
        };
    };
}

export default function Index() {
    const { t } = useTranslation();
    const { trialBalance, auth } = usePage<TrialBalanceProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [fromDate, setFromDate] = useState(urlParams.get('from_date') || trialBalance.from_date);
    const [toDate, setToDate] = useState(urlParams.get('to_date') || trialBalance.to_date);


    const handleGenerate = () => {
        if (!fromDate || !toDate) return;
        router.get(route('double-entry.trial-balance.index'), {
            from_date: fromDate,
            to_date: toDate
        }, {
            preserveState: true,
            replace: true
        });
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {label: t('Double Entry')},
                {label: t('Trial Balance')}
            ]}
            pageTitle={t('Trial Balance')}
        >
            <Head title={t('Trial Balance')} />

            <div className="max-w-7xl mx-auto space-y-6">
                <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-gray-50">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg border flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{t('Trial Balance')}</CardTitle>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(trialBalance.from_date)} - {formatDate(trialBalance.to_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex w-full flex-wrap items-end gap-2 md:gap-3 lg:w-auto">
                                <div className="w-full sm:w-auto">
                                    <Label className="text-xs">{t('From Date')}</Label>
                                    <DatePicker
                                        value={fromDate}
                                        onChange={(value) => setFromDate(value)}
                                        placeholder={t('Select from date')}
                                    />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <Label className="text-xs">{t('To Date')}</Label>
                                    <DatePicker
                                        value={toDate}
                                        onChange={(value) => setToDate(value)}
                                        placeholder={t('Select to date')}
                                    />
                                </div>
                                <Button onClick={handleGenerate} disabled={!fromDate || !toDate} size="sm" className="w-full sm:w-auto">
                                    <Search className="h-4 w-4 mr-2" />
                                    {t('Generate')}
                                </Button>
                                {auth.user?.permissions?.includes('print-trial-balance') && (
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => {
                                        const printUrl = route('double-entry.trial-balance.print') + `?from_date=${fromDate}&to_date=${toDate}&download=pdf`;
                                        window.open(printUrl, '_blank');
                                    }}>
                                        <Printer className="h-4 w-4 mr-2" />
                                        {t('Download PDF')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-semibold text-green-700 mb-2">{t('Total Debit')}</h4>
                                <p className="text-3xl font-bold text-green-900 tabular-nums">
                                    {formatCurrency(trialBalance.total_debit)}
                                </p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-semibold text-blue-700 mb-2">{t('Total Credit')}</h4>
                                <p className="text-3xl font-bold text-blue-900 tabular-nums">
                                    {formatCurrency(trialBalance.total_credit)}
                                </p>
                            </div>
                        </div>

                        {!trialBalance.is_balanced && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 font-medium">
                                    ⚠️ {t('Warning: Trial balance is not balanced!')}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        {trialBalance.accounts && trialBalance.accounts.length > 0 ? (
                            <>
                                <div className="space-y-3 md:hidden">
                                    {trialBalance.accounts.map((account) => (
                                        <div key={account.id} className="rounded-lg border border-gray-200 p-3 bg-white">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-gray-500">{t('Account Code')}</p>
                                                    <p className="text-sm font-semibold text-green-600">{account.account_code}</p>
                                                </div>
                                                <div className="text-right min-w-0">
                                                    <p className="text-xs text-gray-500">{t('Account Name')}</p>
                                                    <p className="text-sm font-medium break-words">{account.account_name}</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                <div className="rounded-md bg-gray-50 px-3 py-2">
                                                    <p className="text-xs text-gray-500">{t('Debit')}</p>
                                                    <p className="text-sm font-semibold tabular-nums whitespace-nowrap">
                                                        {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                                                    </p>
                                                </div>
                                                <div className="rounded-md bg-gray-50 px-3 py-2">
                                                    <p className="text-xs text-gray-500">{t('Credit')}</p>
                                                    <p className="text-sm font-semibold tabular-nums whitespace-nowrap text-right">
                                                        {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-3 mt-1 border-t-2 border-gray-400 space-y-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-bold">{t('Total Debit')}</span>
                                            <span className="font-bold tabular-nums whitespace-nowrap">{formatCurrency(trialBalance.total_debit)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-bold">{t('Total Credit')}</span>
                                            <span className="font-bold tabular-nums whitespace-nowrap">{formatCurrency(trialBalance.total_credit)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block overflow-x-auto">
                                    <div className="space-y-1 pr-1" style={{ minWidth: '720px' }}>
                                        <div
                                            className="grid gap-4 py-2 border-b-2 border-gray-300 font-bold text-sm"
                                            style={{ gridTemplateColumns: '100px minmax(220px, 1fr) 140px 140px' }}
                                        >
                                            <div className="whitespace-nowrap">{t('Account Code')}</div>
                                            <div className="whitespace-nowrap">{t('Account Name')}</div>
                                            <div className="text-right whitespace-nowrap">{t('Debit')}</div>
                                            <div className="text-right whitespace-nowrap">{t('Credit')}</div>
                                        </div>
                                        {trialBalance.accounts.map((account) => (
                                            <div
                                                key={account.id}
                                                className="grid gap-4 py-1.5 border-b border-gray-100"
                                                style={{ gridTemplateColumns: '100px minmax(220px, 1fr) 140px 140px' }}
                                            >
                                                <div className="text-sm">
                                                    <span className="text-green-600">{account.account_code}</span>
                                                </div>
                                                <div className="text-sm font-medium break-words">{account.account_name}</div>
                                                <div className="text-right text-sm font-semibold tabular-nums whitespace-nowrap">
                                                    {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                                                </div>
                                                <div className="text-right text-sm font-semibold tabular-nums whitespace-nowrap">
                                                    {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                                                </div>
                                            </div>
                                        ))}

                                        <div
                                            className="grid gap-4 pt-3 mt-3 border-t-2 border-gray-400 font-bold"
                                            style={{ gridTemplateColumns: '100px minmax(220px, 1fr) 140px 140px' }}
                                        >
                                            <div style={{ gridColumn: '1 / 3' }}>{t('TOTAL')}</div>
                                            <div className="text-right tabular-nums whitespace-nowrap">{formatCurrency(trialBalance.total_debit)}</div>
                                            <div className="text-right tabular-nums whitespace-nowrap">{formatCurrency(trialBalance.total_credit)}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <NoRecordsFound
                                icon={FileText}
                                title={t('No accounts found')}
                                description={t('No account transactions found for the selected date range.')}
                                className="h-auto py-12"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
