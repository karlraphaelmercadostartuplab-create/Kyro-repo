import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PerPageSelector } from '@/components/ui/per-page-selector';
import { SearchInput } from '@/components/ui/search-input';
import { Pagination } from '@/components/ui/pagination';
import NoRecordsFound from '@/components/no-records-found';
import { History, ArrowLeft } from 'lucide-react';
import { formatDateTime } from '@/utils/helpers';

interface MediaHistoryItem {
    id: number;
    name: string;
    file_name: string;
    mime_type: string | null;
    size: number;
    directory_name: string | null;
    deleted_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface MediaHistoryProps {
    histories: {
        data: MediaHistoryItem[];
        links: any[];
        meta: any;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    [key: string]: unknown;
}

export default function MediaHistory() {
    const { t } = useTranslation();
    const { histories } = usePage<MediaHistoryProps>().props;
    const urlParams = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(urlParams.get('search') || '');
    const [perPage] = useState(urlParams.get('per_page') || '10');
    const [sortField, setSortField] = useState(urlParams.get('sort') || '');
    const [sortDirection, setSortDirection] = useState(urlParams.get('direction') || 'desc');

    const handleFilter = () => {
        router.get(route('media.history'), { search, per_page: perPage, sort: sortField, direction: sortDirection }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('media.history'), { search, per_page: perPage, sort: field, direction }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('media.history'), { per_page: perPage }, {
            preserveState: true,
            replace: true,
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';

        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
        const value = bytes / Math.pow(1024, index);

        return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
    };

    const tableColumns = [
        {
            key: 'file_name',
            header: t('File'),
            sortable: true,
            render: (_: string, item: MediaHistoryItem) => (
                <div>
                    <div className="font-medium">{item.name || item.file_name}</div>
                    <div className="text-sm text-gray-500 break-all">{item.file_name}</div>
                </div>
            ),
        },
        {
            key: 'directory_name',
            header: t('Folder'),
            sortable: true,
            render: (value: string | null) => value || t('All Files'),
        },
        {
            key: 'mime_type',
            header: t('Type'),
            sortable: true,
            render: (value: string | null) => value || '-',
        },
        {
            key: 'size',
            header: t('Size'),
            sortable: true,
            render: (value: number) => formatFileSize(value),
        },
        {
            key: 'user',
            header: t('Deleted By'),
            render: (_: unknown, item: MediaHistoryItem) => (
                <div>
                    <div className="font-medium">{item.user?.name || '-'}</div>
                    <div className="text-sm text-gray-500">{item.user?.email || '-'}</div>
                </div>
            ),
        },
        {
            key: 'deleted_at',
            header: t('Deleted At'),
            sortable: true,
            render: (value: string) => formatDateTime(value),
        },
    ];

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { label: t('Media Library'), url: route('media-library') },
                { label: t('Deletion History') },
            ]}
            pageTitle={t('Media Deletion History')}
            pageActions={
                <Button variant="outline" asChild>
                    <a href={route('media-library')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('Back to Media Library')}
                    </a>
                </Button>
            }
        >
            <Head title={t('Media Deletion History')} />

            <Card className="shadow-sm">
                <CardContent className="p-6 border-b bg-gray-50/50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSearch={handleFilter}
                                placeholder={t('Search by file name or deleted by...')}
                            />
                        </div>
                        <PerPageSelector routeName="media.history" filters={{ search, sort: sortField, direction: sortDirection }} />
                    </div>
                </CardContent>

                <CardContent className="p-0">
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 max-h-[70vh] rounded-none w-full">
                        <div className="min-w-[900px]">
                            <DataTable
                                data={histories.data}
                                columns={tableColumns}
                                onSort={handleSort}
                                sortKey={sortField}
                                sortDirection={sortDirection as 'asc' | 'desc'}
                                className="rounded-none"
                                emptyState={
                                    <NoRecordsFound
                                        icon={History}
                                        title={t('No deletion history found')}
                                        description={t('Deleted media files will appear here.')}
                                        hasFilters={!!search}
                                        onClearFilters={clearFilters}
                                        className="h-auto"
                                    />
                                }
                            />
                        </div>
                    </div>
                </CardContent>

                <CardContent className="px-4 py-2 border-t bg-gray-50/30">
                    <Pagination
                        data={histories}
                        routeName="media.history"
                        filters={{ search, per_page: perPage, sort: sortField, direction: sortDirection }}
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}