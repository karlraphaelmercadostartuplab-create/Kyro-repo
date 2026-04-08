import { Head, usePage } from '@inertiajs/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from "@/components/cookie-consent";

interface CustomPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
}

interface LandingPageSettings {
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    config_sections?: {
        sections?: any;
        colors?: {
            primary: string;
            secondary: string;
            accent: string;
        };
    };
}

interface ShowProps {
    page: CustomPage;
    landingPageSettings?: LandingPageSettings;
}

export default function Show({ page, landingPageSettings }: ShowProps) {
    const { adminAllSetting } = usePage().props as any;
    // Apply color settings from landing page
    const colorScheme = landingPageSettings?.config_sections?.colors || {
        primary: '#10b77f',
        secondary: '#059669',
        accent: '#065f46'
    };

    const normalizedContent = page.content
        .replace(
            /color-mix\(in\s+srgb,\s*var\(--color-primary\)\s*\d+%,\s*white\)/gi,
            'color-mix(in srgb, var(--color-primary) 10%, #020617)'
        )
        .replace(
            /background-color:\s*#f3f4f6/gi,
            'background-color: color-mix(in srgb, var(--color-primary) 10%, #020617); border: 1px solid rgba(148, 163, 184, 0.25)'
        );

    return (
        <div className="landing-theme min-h-screen bg-background text-foreground" style={{
            '--color-primary': colorScheme.primary,
            '--color-secondary': colorScheme.secondary,
            '--color-accent': colorScheme.accent
        } as React.CSSProperties}>
            <Head 
                title={page.meta_title || page.title}
                description={page.meta_description}
            />
            
            <Header key="header" settings={landingPageSettings} />
            
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            {page.title}
                        </h1>
                    </div>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div 
                           dangerouslySetInnerHTML={{ __html: normalizedContent }}
                            className="landing-content text-gray-700 dark:text-gray-300 leading-relaxed [&_.text-gray-900]:text-gray-900 dark:[&_.text-gray-900]:text-white [&_.text-gray-800]:text-gray-800 dark:[&_.text-gray-800]:text-gray-100 [&_.text-gray-700]:text-gray-700 dark:[&_.text-gray-700]:text-gray-300 [&_.text-gray-600]:text-gray-600 dark:[&_.text-gray-600]:text-gray-400"
                        />
                    </div>
                </div>
            </section>
            
            <Footer key="footer" settings={landingPageSettings} />
            
            <CookieConsent settings={adminAllSetting || {}} />
        </div>
    );
}