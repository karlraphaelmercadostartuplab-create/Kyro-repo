export const getStatusBadgeClasses = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    const colors = {
        draft: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
        posted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
        partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200',
        paid: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200',
        overdue: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
    };
    const badgeClasses = colors[normalizedStatus as keyof typeof colors] || 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100';

    return `px-2 py-1 rounded-full text-sm ${badgeClasses}`;
};