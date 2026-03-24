<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', $page['props']['auth']['lang'] ?? substr(app()->getLocale(), 0, 2)) }}" class="{{ ($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light') === 'dark' ? 'dark' : 'light' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'AccountGo SaaS') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <script src="{{ asset('js/jquery.min.js') }}"></script>

        <!-- Scripts -->
        @routes
        <script>
            window.auth = @json($page['props']['auth'] ?? null);
            // Set theme immediately to prevent flash
            (function() {
                const themeMode = @json($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light');
                const root = document.documentElement;
                if (themeMode === 'dark') {
                    root.classList.add('dark');
                    root.classList.remove('light');
                } else {
                    root.classList.add('light');
                    root.classList.remove('dark');
                }
            })();
        </script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
        <style>
            html,
            body {
                max-width: 100%;
                overflow-x: hidden;
            }

            .kyro-chat-reveal-tab {
                position: fixed;
                right: 0.75rem;
                bottom: 0.75rem;
                max-width: calc(100vw - 1.5rem);
            }

            .kyro-chat-launcher,
            iframe[src*="helpdesk.startuplab.cc"] {
                max-width: calc(100vw - 1rem) !important;
            }

            @media (max-width: 640px) {
                .kyro-chat-launcher,
                iframe[src*="helpdesk.startuplab.cc"] {
                    right: 0.75rem !important;
                    left: auto !important;
                    transform: none !important;
                }
            }
        </style>
    </head>
    <body class="font-sans antialiased {{ ($page['props']['adminAllSetting']['themeMode'] ?? $page['props']['companyAllSetting']['themeMode'] ?? 'light') === 'dark' ? 'dark' : 'light' }}">
        @inertia
        <script src="https://helpdesk.startuplab.cc/livechat-loader.js"></script>
        <script>
            (function () {
                const idleDelayMs = 30000;
                const launcherSelectors = [
                    '.kyro-chat-launcher',
                    'iframe[src*="helpdesk.startuplab.cc"]',
                    '[id*="chat"]',
                    '[class*="chat"]',
                    '[aria-label*="chat" i]',
                    '[title*="chat" i]'
                ];

                let launcher = null;
                let idleTimer = null;
                let revealTab = null;

                const hideRevealTab = () => {
                    if (!revealTab) return;
                    revealTab.classList.add('kyro-chat-reveal-tab-hidden');
                };

                const showRevealTab = () => {
                    if (!revealTab) return;
                    revealTab.classList.remove('kyro-chat-reveal-tab-hidden');
                };

                const ensureRevealTab = () => {
                    if (revealTab && document.body.contains(revealTab)) {
                        return revealTab;
                    }

                    revealTab = document.createElement('button');
                    revealTab.type = 'button';
                    revealTab.className = 'kyro-chat-reveal-tab kyro-chat-reveal-tab-hidden';
                    revealTab.setAttribute('aria-label', 'Show chat launcher');
                    revealTab.innerHTML = `
                        <span class="kyro-chat-reveal-tab-label">Show chat</span>
                        <svg class="kyro-chat-reveal-tab-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                            <path d="M6.5 5.5H17.5C18.6 5.5 19.5 6.4 19.5 7.5V14.5C19.5 15.6 18.6 16.5 17.5 16.5H10.2L6 20.5V16.5H6.5C5.4 16.5 4.5 15.6 4.5 14.5V7.5C4.5 6.4 5.4 5.5 6.5 5.5Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`;

                    revealTab.addEventListener('click', () => {
                        const el = resolveLauncher();
                        if (!el) return;

                        el.classList.remove('kyro-chat-docked');
                        hideRevealTab();
                        scheduleDock();
                    });

                    document.body.appendChild(revealTab);
                    return revealTab;
                };

                const scheduleDock = () => {
                    if (idleTimer) {
                        clearTimeout(idleTimer);
                    }

                    idleTimer = window.setTimeout(() => {
                        const el = resolveLauncher();
                        if (!el) return;

                        el.classList.add('kyro-chat-docked');
                        showRevealTab();
                    }, idleDelayMs);
                };

                const handleLauncherInteraction = () => {
                    const el = resolveLauncher();
                    if (!el) return;

                    el.classList.remove('kyro-chat-docked');
                    hideRevealTab();
                    scheduleDock();
                };

                const bindLauncherEvents = (el) => {
                    if (!el || el.dataset.kyroDockBound === '1') {
                        return;
                    }

                    el.dataset.kyroDockBound = '1';
                    ['click', 'touchstart', 'focus'].forEach((eventName) => {
                        el.addEventListener(eventName, handleLauncherInteraction, { passive: true });
                    });
                };

                const resolveLauncher = () => {
                    if (launcher && document.body.contains(launcher)) {
                        return launcher;
                    }

                    for (const selector of launcherSelectors) {
                        const elements = Array.from(document.querySelectorAll(selector));
                        const candidate = elements.find((el) => {
                            const style = window.getComputedStyle(el);
                            const rect = el.getBoundingClientRect();
                            const fixedLike = style.position === 'fixed' || style.position === 'sticky';
                            const bottomAnchored = rect.bottom >= window.innerHeight - 32;
                            const rightAnchored = rect.right >= window.innerWidth - 80;

                            return fixedLike && bottomAnchored && rightAnchored && rect.width > 24 && rect.height > 24;
                        });

                        if (candidate) {
                            candidate.classList.add('kyro-chat-launcher');
                            bindLauncherEvents(candidate);
                            launcher = candidate;
                            return launcher;
                        }
                    }

                    return null;
                };

                const setup = () => {
                    const el = resolveLauncher();
                    ensureRevealTab();
                    if (!el) return;

                    el.classList.remove('kyro-chat-docked');
                    hideRevealTab();
                    scheduleDock();
                };

                const observer = new MutationObserver(() => {
                    const el = resolveLauncher();
                    ensureRevealTab();
                    if (!el) return;

                    bindLauncherEvents(el);

                    if (!idleTimer) {
                        scheduleDock();
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                window.addEventListener('load', () => {
                    setup();
                    window.setTimeout(setup, 1200);
                    window.setTimeout(setup, 3000);
                });
            })();
        </script>
    </body>
</html>
