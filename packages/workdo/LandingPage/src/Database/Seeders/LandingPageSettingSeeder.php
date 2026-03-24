<?php

namespace Workdo\LandingPage\Database\Seeders;

use Illuminate\Database\Seeder;
use Workdo\LandingPage\Models\LandingPageSetting;
use Illuminate\Support\Facades\Log;

class LandingPageSettingSeeder extends Seeder
{
    public function run()
    {
        if (LandingPageSetting::exists()) {
            return;
        }

        try {
            LandingPageSetting::create($this->getDefaultSettings());
        } catch (\Exception $e) {
            Log::error('Failed to seed landing page settings: ' . $e->getMessage());
            throw $e;
        }
    }

    private function getDefaultSettings(): array
    {
        return [
            'company_name' => 'AccountGo SaaS',
            'contact_email' => 'support@accountgosaas.com',
            'contact_phone' => '+1 (555) 123-4567',
            'contact_address' => '123 Business Ave, City, State 12345',
            'config_sections' => $this->getDefaultConfigSections()
        ];
    }

    private function getDefaultConfigSections(): array
    {
        return [
            'sections' => $this->getDefaultSections(),
            'section_visibility' => $this->getDefaultVisibility(),
            'section_order' => $this->getDefaultOrder(),
            'colors' => $this->getDefaultColors()
        ];
    }

    private function getDefaultSections(): array
    {
        return [
            'hero' => [
                'variant' => 'hero1',
                'title' => 'Integrated Accounting & Business Management',
                'subtitle' => 'Effortlessly manage your finances, inventory, and operations with AccountGo SaaS. The complete solution for modern enterprises.',
                'primary_button_text' => 'Start Free Trial',
                'primary_button_link' => route('register'),
                'secondary_button_text' => 'Login',
                'secondary_button_link' => route('login'),
                'highlight_text' => 'AccountGo SaaS',
                'image' => 'packages/workdo/LandingPage/src/Resources/assets/img/hero.png'
            ],
            'header' => [
                'variant' => 'header1',
                'company_name' => 'AccountGo SaaS',
                'cta_text' => 'Get Started',
                'enable_pricing_link' => true,
                'navigation_items' => [
                    ['text' => 'Home', 'href' => route('landing.page')]
                ]
            ],
            'stats' => [
                'variant' => 'stats1',
                'stats' => [
                    ['label' => 'Businesses Trust Us', 'value' => '12,000+'],
                    ['label' => 'Uptime Guarantee', 'value' => '99.9%'],
                    ['label' => 'Customer Support', 'value' => '24/7'],
                    ['label' => 'Countries Worldwide', 'value' => '60+']
                ]
            ],
            'features' => [
                'variant' => 'features1',
                'title' => 'Powerful Financial Features',
                'subtitle' => 'Everything your business needs to manage finances, inventory, and growth in one integrated platform',
                'features' => $this->getDefaultFeatures()
            ],
            'modules' => [
                'variant' => 'modules1',
                'title' => 'Complete Business Modules',
                'subtitle' => 'Discover our comprehensive modules designed to streamline every aspect of your business operations',
                'modules' => [
                    [
                        'key' => 'account',
                        'label' => 'Accounting',
                        'title' => 'Comprehensive Financial Management',
                        'description' => 'Experience the power of double-entry accounting with our robust platform. Automate your daily bookkeeping, manage accounts payable and receivable, and generate real-time financial reports. From balance sheets to profit and loss statements, get a 360-degree view of your business health. Our intuitive interface ensures that even complex financial transactions are handled with ease and precision.',
                        'image' => 'packages/workdo/LandingPage/src/Resources/assets/img/accounting.png'
                    ],
                    [
                        'key' => 'retainer',
                        'label' => 'Retainer',
                        'title' => 'Advanced Retainer Management',
                        'description' => 'Streamline your client relationships with our specialized retainer module. Easily track advanced payments, manage recurring billing cycles, and monitor retainer balances in real-time. Whether you are a marketing agency or a consultancy firm, our system handles the complexity of retainer agreements, ensuring transparent invoices and satisfied long-term clients.',
                        'image' => 'packages/workdo/LandingPage/src/Resources/assets/img/retainer.png'
                    ],
                    [
                        'key' => 'contract',
                        'label' => 'Contract',
                        'title' => 'Digital Contract Lifecycle',
                        'description' => 'Take control of your business agreements with our end-to-end contract management solution. Create professional contracts using customizable templates, track their status from drafting to signing, and set automated reminders for renewals. Securely store all your legal documents in one place and ensure compliance with every deal you make.',
                        'image' => 'packages/workdo/LandingPage/src/Resources/assets/img/contracts.png'
                    ],
                    [
                        'key' => 'asset',
                        'label' => 'Assets',
                        'title' => 'Strategic Asset Tracking',
                        'description' => 'Maximize the value of your company resources with our intelligent asset management tool. Monitor the entire lifecycle of your functional and physical assets—from acquisition to disposal. Automatically calculate depreciation, schedule maintenance checks, and track locations to prevent loss and optimize resource utilization across your organization.',
                        'image' => 'packages/workdo/LandingPage/src/Resources/assets/img/assets.png'
                    ],
                    [
                        'key' => 'budget',
                        'label' => 'Budget',
                        'title' => 'Precision Budget Planning',
                        'description' => 'Plan for success with our dynamic budgeting module. Set clear financial targets for every department and project. Compare actual spending against your budget in real-time, receive variance alerts, and adjust your strategies on the fly. Empower your team to make cost-effective decisions without compromising on growth and operational efficiency.',
                        'image' => 'packages/workdo/LandingPage/src/Resources/assets/img/budget.png'
                    ]
                ]
            ],
            'benefits' => [
                'variant' => 'benefits1',
                'title' => 'Why Choose AccountGo SaaS?',
                'benefits' => [
                    ['title' => 'Professional Double-Entry Precision', 'description' => 'Ensure absolute accuracy in your financial records with our robust double-entry system. Every transaction is automatically balanced across assets, liabilities, and equity, providing a bulletproof audit trail for your business compliance and tax preparation.'],
                    ['title' => 'Strategic Asset Life-Cycle Management', 'description' => 'Maximize the value of your company investments. Track acquisitions, calculate multiple depreciation methods, and schedule proactive maintenance for all physical and functional assets.'],
                    ['title' => 'Dynamic Budget Planning & Analysis', 'description' => 'Take control of your fiscal future. Set granular budgets for diverse departments or specific projects and monitor spending in real-time. Compare actuals vs targets and receive variance alerts to stay profitable.'],
                    ['title' => 'Unified Business Module Ecosystem', 'description' => 'Breakdown silos between your business functions. Our integrated modules for Accounting, Retainer billing, Contract management, and Goal tracking work in perfect harmony to provide a unified data source.'],
                    ['title' => 'Seamless Payment Gateway Integration', 'description' => 'Accept payments effortlessly with built-in support for multiple payment gateways including Bank Transfers, Stripe, PayPal, etc. Automate payment collection, send smart reminders, and reconcile transactions automatically for faster cash flow.'],
                    ['title' => 'Powerful Reporting & Analytics Dashboard', 'description' => 'Make informed decisions with comprehensive financial reports at your fingertips. Generate Balance Sheets, Profit & Loss statements, Cash Flow reports, and custom analytics with just a few clicks. Visualize your business performance through intuitive charts and graphs.']
                ]
            ],
            'gallery' => [
                'variant' => 'gallery1',
                'title' => 'Interface Gallery',
                'subtitle' => 'Explore our sleek and intuitive dashboard',
                'images' => [
                    'packages/workdo/LandingPage/src/Resources/assets/img/gallery1.jpeg',
                    'packages/workdo/LandingPage/src/Resources/assets/img/gallery2.jpeg',
                    'packages/workdo/LandingPage/src/Resources/assets/img/gallery3.jpeg',
                    'packages/workdo/LandingPage/src/Resources/assets/img/gallery4.jpeg'
                ]
            ],
            'cta' => [
                'variant' => 'cta1',
                'title' => 'Ready to Transform Your Finances?',
                'subtitle' => 'Join thousands of businesses already using AccountGo SaaS to streamline their accounting.',
                'primary_button' => 'Start Free Trial',
                'secondary_button' => 'Contact Sales'
            ],
            'pricing' => [
                'title' => 'Flexible Pricing Plans',
                'subtitle' => 'Choose the perfect subscription plan for your business needs',
                'default_subscription_type' => 'pre-package',
                'default_price_type' => 'monthly',
                'show_pre_package' => true,
                'show_monthly_yearly_toggle' => true,
                'empty_message' => 'No plans available. Check back later for new pricing plans.'
            ],
            'footer' => [
                'variant' => 'footer1',
                'description' => 'The complete financial management solution for modern enterprises.',
                'email' => 'support@accountgosaas.com',
                'phone' => '+1 (555) 123-4567',
                'newsletter_title' => 'Stay Updated',
                'newsletter_description' => 'Subscribe to our newsletter for the latest accounting tips and updates.',
                'newsletter_button_text' => 'Subscribe',
                'copyright_text' => '',
                'navigation_sections' => [
                    [
                        'title' => 'Product',
                        'links' => [
                            ['text' => 'Features', 'href' => '#features'],
                            ['text' => 'Pricing', 'href' => '#pricing'],
                            ['text' => 'Demo', 'href' => '#demo']
                        ]
                    ],
                    [
                        'title' => 'Company',
                        'links' => [
                            ['text' => 'About', 'href' => '#about'],
                            ['text' => 'Contact', 'href' => '#contact'],
                            ['text' => 'Support', 'href' => '#support']
                        ]
                    ]
                ]
            ]
        ];
    }

    private function getDefaultFeatures(): array
    {
        return [
            ['title' => 'Double Entry Accounting', 'description' => 'Professional double-entry ledger system for accurate financial reporting and compliance.', 'icon' => 'BookOpen'],
            ['title' => 'Contract Management', 'description' => 'Create, track, and manage business contracts with digital precision.', 'icon' => 'FileText'],
            ['title' => 'Budget Planning', 'description' => 'Plan your financial future with comprehensive budgeting tools and variance analysis.', 'icon' => 'PieChart'],
            ['title' => 'Asset Tracking', 'description' => 'Manage company assets, calculate depreciation, and track maintenance.', 'icon' => 'Monitor'],
            ['title' => 'Goal Tracking', 'description' => 'Set financial goals and track your progress with real-time visual dashboards.', 'icon' => 'Target'],
            ['title' => 'Retainer Invoicing', 'description' => 'Manage long-term client relationships with automated retainer invoicing.', 'icon' => 'Repeat']
        ];
    }

    private function getDefaultVisibility(): array
    {
        return [
            'header' => true,
            'hero' => true,
            'stats' => true,
            'features' => true,
            'modules' => true,
            'benefits' => true,
            'gallery' => true,
            'cta' => true,
            'footer' => true,
            'pricing' => true
        ];
    }

    private function getDefaultOrder(): array
    {
        return ['header', 'hero', 'stats', 'features', 'modules', 'benefits', 'gallery', 'cta', 'footer'];
    }

    private function getDefaultColors(): array
    {
        return [
            'primary' => '#10b77f',
            'secondary' => '#059669',
            'accent' => '#065f46'
        ];
    }
}