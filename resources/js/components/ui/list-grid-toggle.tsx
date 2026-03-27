import { Button } from '@/components/ui/button';
import { List, Grid3X3 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface ListGridToggleProps {
    currentView: 'list' | 'grid';
    routeName: string;
    routeParams?: any[];
    filters?: Record<string, any>;
    onViewChange?: (view: 'list' | 'grid') => void;
    className?: string;
}

export function ListGridToggle({ currentView, routeName, routeParams = [], filters = {}, onViewChange, className }: ListGridToggleProps) {
    const handleViewChange = (view: 'list' | 'grid') => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = { ...filters, view, page: urlParams.get('page') || '1' };
        
        if (onViewChange) {
            onViewChange(view);
        }
        
        router.get(route(routeName, ...routeParams), params, {
            preserveState: false,
            replace: true
        });
    };

    return (
        <div className={cn("grid w-full grid-cols-2 overflow-hidden rounded-md border sm:w-auto", className)}>
            <Button
                variant={currentView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('list')}
                className="h-10 rounded-none border-r"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant={currentView === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewChange('grid')}
                className="h-10 rounded-none"
            >
                <Grid3X3 className="h-4 w-4" />
            </Button>
        </div>
    );
}
