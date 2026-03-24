  "use client"
  import { useTranslation } from 'react-i18next';
  import * as React from "react"
  import {
    Home,
    LayoutGrid,
    LifeBuoy,
    Send,
    SquareTerminal,
    Search,
  } from "lucide-react"

  import { NavMain } from "@/components/nav-main"
  import { NavSecondary } from "@/components/nav-secondary"
  import { NavUser } from "@/components/nav-user"
  import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarInput,
  } from "@/components/ui/sidebar"
  import { Link, usePage } from "@inertiajs/react";
  import { PageProps } from "@/types";
  import { allMenuItems } from "@/utils/menu";
  import { useBrand } from "@/contexts/brand-context";


  export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

      const { t } = useTranslation();

      const page = usePage<PageProps>();
      const { auth } = page.props;

      const { settings, getCompleteSidebarProps, getPreviewUrl } = useBrand();
      const [searchQuery, setSearchQuery] = React.useState("");

      const sidebarProps = getCompleteSidebarProps();
      const menuItems = allMenuItems();

      const accountDashboardRoles = ['staff', 'client', 'vendor', 'auditor'];
      const normalizedUserType = String(auth?.user?.type || '').toLowerCase();
      const normalizedUserRoles = ((auth?.user as any)?.roles || [])
        .map((role: any) => String(typeof role === 'string' ? role : role?.name || '').toLowerCase())

        .filter(Boolean);
      const isAccountDashboardRole = accountDashboardRoles.includes(normalizedUserType)
        || normalizedUserRoles.some((role: string) => accountDashboardRoles.includes(role));
      const isInAccountSection = page.url?.startsWith('/account');
      const shouldShowDashboardButton = isAccountDashboardRole || isInAccountSection;
      const isDashboardActive = route().current('dashboard');

      const sidebarItems = menuItems.filter((item) => item.name !== 'dashboard' && item.href !== route('dashboard'));
      const dashboardItem = {
        title: t('Dashboard'),
        href: route('dashboard'),
        icon: LayoutGrid,
        name: 'dashboard',
        order: 1,
      };

      const navItems = shouldShowDashboardButton
        ? [dashboardItem, ...sidebarItems]
        : sidebarItems;


      return (
      <Sidebar
          variant={settings.sidebarVariant as any}
          side={settings.layoutDirection === 'rtl' ? 'right' : 'left'}
          collapsible="icon"
          className={sidebarProps.className}
          style={sidebarProps.style}
          {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={route('dashboard')} className="flex items-center justify-center">
                  {/* Logo for expanded sidebar */}
                  <div className="group-data-[collapsible=icon]:hidden flex items-center">
                    {(() => {
                      const isDark = settings.themeMode === 'dark';
                      const currentLogo = isDark ? settings.logo_light : settings.logo_dark;
                      const displayUrl = currentLogo ? getPreviewUrl(currentLogo) : '';
                      
                      return displayUrl ? (
                        <img
                          src={displayUrl}
                          alt="Logo"
                          className="w-auto max-w-[180px] transition-all duration-200"
                        />
                      ) : (
                        <div className="h-12 text-inherit font-semibold flex items-center text-lg tracking-tight">
                          {settings.titleText || 'WorkDo'}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Icon for collapsed sidebar */}
                  <div className="h-8 w-8 hidden group-data-[collapsible=icon]:block">
                    {(() => {
                      
                      const displayFavicon = settings.favicon ? getPreviewUrl(settings.favicon) : '';

                      return displayFavicon ? (
                        <img
                          src={displayFavicon}
                          alt="Icon"
                          className="h-8 w-8 transition-all duration-200"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-primary text-white rounded flex items-center justify-center font-bold shadow-sm">
                          W
                        </div>
                      );
                    })()}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="px-2 group-data-[collapsible=icon]:px-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              <SidebarInput
                placeholder={`${t('Search')}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 group-data-[collapsible=icon]:hidden border-sidebar-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems} searchQuery={searchQuery} />
        </SidebarContent>
      </Sidebar>
    )
  }
