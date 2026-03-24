import { NavItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { getSuperAdminMenu } from './menus/superadmin-menu';
import { getCompanyMenu } from './menus/company-menu';
import * as LucideIcons from 'lucide-react';

// Get role-based core menu items
const getCoreMenuItems = (userRoles: string[], t: (key: string) => string): NavItem[] => {
    if (userRoles.includes('superadmin')) {
        return getSuperAdminMenu(t);
    }
    return getCompanyMenu(t);
};

// Auto-load package menus based on activated packages
const getPackageMenuItems = (userRoles: string[], activatedPackages: string[], t: (key: string) => string): NavItem[] => {
    const menuItems: NavItem[] = [];
    const menuType = userRoles.includes('superadmin') ? 'superadmin-menu' : 'company-menu';

    const allModules = import.meta.glob('../../../packages/workdo/*/src/Resources/js/menus/*.ts', { eager: true });

    // Ensure activatedPackages is an array before iterating
    if (!Array.isArray(activatedPackages)) {
        return menuItems;
    }

    activatedPackages.forEach(packageName => {
        const menuPath = `../../../packages/workdo/${packageName}/src/Resources/js/menus/${menuType}.ts`;
        const module = allModules[menuPath] as any;

        if (module) {
            Object.values(module).forEach((item: any) => {
                const result = typeof item === 'function' ? item(t) : item;
                const items = Array.isArray(result) ? result : [result];
                menuItems.push(...items);
            });
        }
    });

    return menuItems;
};

// Get custom menu items from database
const getCustomMenuItems = (userRoles: string[], t: (key: string) => string): NavItem[] => {
    const { auth } = usePage().props as any;
    const customMenus = auth?.customMenus || [];
    
    return customMenus.map((menu: any) => {
        // Convert string icon to Lucide icon component
        let iconComponent = null;
        if (menu.icon && typeof menu.icon === 'string') {
            const IconComponent = (LucideIcons as any)[menu.icon];
            if (IconComponent) {
                iconComponent = IconComponent;
            }
        }
        
        return {
            ...menu,
            icon: iconComponent,
        };
    });
};

// Group menu items by parent
const groupMenusByParent = (menuItems: NavItem[], packageMenuItems: NavItem[]): NavItem[] => {
    const groupedItems = [...menuItems];

    packageMenuItems.forEach(packageItem => {
        if (packageItem.parent) {
            const parentMenu = groupedItems.find(item =>
                item.name === packageItem.parent
            );

            if (parentMenu) {
                if (!parentMenu.children) {
                    parentMenu.children = [];
                }
                parentMenu.children.push({
                    ...packageItem,
                    parent: undefined
                });

                // Sort children by order
                if (parentMenu.children) {
                    parentMenu.children.sort((a, b) => (a.order || 999) - (b.order || 999));
                }
            } else {
                groupedItems.push(packageItem);
            }
        } else {
            groupedItems.push(packageItem);
        }
    });

    return groupedItems;
};

// Filter menu items based on permissions
const filterByPermission = (items: NavItem[], userPermissions: string[]): NavItem[] => {
    return items.filter(item => {
        const hasSinglePermission = item.permission ? userPermissions.includes(item.permission) : false;
        const hasAnyPermission = item.permissionAny?.some(permission => userPermissions.includes(permission)) ?? false;
        const hasPermissionRules = Boolean(item.permission || item.permissionAny);
        const isAuthorized = !hasPermissionRules || hasSinglePermission || hasAnyPermission;

        if (!isAuthorized) {
            return false;
        }

        if (item.children) {
            item.children = filterByPermission(item.children, userPermissions);
            // Keep clickable parent links even when none of their children are permitted
            if (item.children.length > 0) {
                return true;
            }

            // Keep clickable parent items even when all of their children are filtered out.
            return Boolean(item.href);
        }

        return true;
    });
};

// Main function to get filtered menu items
export const allMenuItems = (): NavItem[] => {
    const page = usePage();
    const { auth } = page.props as any;
    const { t } = useTranslation();
    const userPermissions = auth?.user?.permissions || [];
    const rawUserRoles = auth?.user?.roles || [];
    const userRoles = rawUserRoles
        .map((role: any) => typeof role === 'string' ? role : role?.name)
        .filter(Boolean);
    const activatedPackages = auth?.user?.activatedPackages || [];

    const coreMenuItems = getCoreMenuItems(userRoles, t);

    const packageMenuItems = getPackageMenuItems(userRoles, activatedPackages, t);
    
    const customMenuItems = getCustomMenuItems(userRoles, t);
    
    // Separate custom menus into parents and children
    const customParentMenus = customMenuItems.filter(menu => !menu.parent);
    const customChildMenus = customMenuItems.filter(menu => menu.parent);
    
    // First add custom parent menus to core menus
    const coreWithCustomParents = [...coreMenuItems, ...customParentMenus];
    
    // Then group all children (package + custom children) with their parents
    const allChildMenus = [...packageMenuItems, ...customChildMenus];
    const finalGroupedMenuItems = groupMenusByParent(coreWithCustomParents, allChildMenus);

    const sortedMenuItems = finalGroupedMenuItems.sort((a, b) => (a.order || 999) - (b.order || 999));

    const finalMenuItems = filterByPermission(sortedMenuItems, userPermissions);

    const accountDashboardRoles = ['staff', 'client', 'vendor', 'auditor'];
    const normalizedUserType = String(auth?.user?.type || '').toLowerCase();
    const normalizedUserRoles = userRoles.map((role: string) => String(role).toLowerCase());
    const isAccountDashboardRole = accountDashboardRoles.includes(normalizedUserType)
        || normalizedUserRoles.some((role: string) => accountDashboardRoles.includes(role));
    const isInAccountSection = false;
    const hasDashboardItem = finalMenuItems.some(item => item.href === route('dashboard'));


    if ((isAccountDashboardRole || isInAccountSection) && !hasDashboardItem) {
        const dashboardMenuItem = sortedMenuItems.find(item => item.name === 'dashboard')
            || getCompanyMenu(t).find(item => item.name === 'dashboard');

        if (dashboardMenuItem) {
            finalMenuItems.unshift(dashboardMenuItem);
        }
    }

    return finalMenuItems;

};