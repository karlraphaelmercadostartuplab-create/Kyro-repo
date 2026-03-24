<?php

namespace Workdo\Retainer\Database\Seeders;

use Illuminate\Database\Seeder;
use Workdo\LandingPage\Models\MarketplaceSetting;
use Illuminate\Support\Facades\File;

class MarketplaceSettingSeeder extends Seeder
{
    public function run()
    {
        // Get all available screenshots from marketplace directory
        $marketplaceDir = __DIR__ . '/../../marketplace';
        $screenshots = [];
        
        if (File::exists($marketplaceDir)) {
            $files = File::files($marketplaceDir);
            foreach ($files as $file) {
                if (in_array($file->getExtension(), ['png', 'jpg', 'jpeg', 'gif', 'webp'])) {
                    $screenshots[] = '/packages/workdo/Retainer/src/marketplace/' . $file->getFilename();
                }
            }
        }
        
        sort($screenshots);
        
        MarketplaceSetting::firstOrCreate(['module' => 'Retainer'], [
            'module' => 'Retainer',
            'title' => 'Retainer Module Marketplace',
            'subtitle' => 'Comprehensive retainer tools for your applications',
            'config_sections' => [
                'sections' => [
                    'hero' => [
                        'variant' => 'hero1',
                        'title' => 'Retainer Module for AccountGo SaaS',
                        'subtitle' => 'Streamline your retainer workflow with comprehensive tools and automated management.',
                        'primary_button_text' => 'Install Retainer Module',
                        'primary_button_link' => '#install',
                        'secondary_button_text' => 'Learn More',
                        'secondary_button_link' => '#learn',
                        'image' => ''
                    ],
                    'modules' => [
                        'variant' => 'modules1',
                        'title' => 'Retainer Module',
                        'subtitle' => 'Enhance your workflow with powerful retainer tools'
                    ],
                    'dedication' => [
                        'variant' => 'dedication1',
                        'title' => 'Dedicated Retainer Features',
                        'description' => 'Our retainer module provides comprehensive capabilities for modern workflows.',
                        'subSections' => [
                            [
                                'title' => 'Comprehensive Retainer Agreement Management',
                                'description' => 'Create, manage, and track retainer agreements with detailed line items, tax calculations, and professional document generation. Streamline the entire retainer lifecycle from creation to conversion with automated status management, client communication, and comprehensive audit trails.',
                                'keyPoints' => ['Professional retainer creation', 'Automated status management', 'Detailed line item tracking', 'Document generation system'],
                                'screenshot' => '/packages/workdo/Retainer/src/marketplace/image1.png'
                            ],
                            [
                                'title' => 'Advanced Tax & Financial Calculations',
                                'description' => 'Handle complex tax calculations and financial computations with integrated product selection and pricing management for accurate retainer billing. Ensure compliance with automated tax calculations, multi-currency support, and detailed financial breakdowns for transparent client billing.',
                                'keyPoints' => ['Automated tax calculations', 'Multi-currency support', 'Product integration system', 'Financial breakdown reports'],
                                'screenshot' => '/packages/workdo/Retainer/src/marketplace/image2.png'
                            ],
                            [
                                'title' => 'Payment Tracking & Allocation System',
                                'description' => 'Monitor retainer payments with comprehensive allocation tracking and automated payment processing for complete financial oversight. Manage payment schedules, track outstanding balances, and generate detailed payment reports with real-time financial status updates.',
                                'keyPoints' => ['Payment allocation tracking', 'Automated payment processing', 'Outstanding balance monitoring', 'Real-time financial reporting'],
                                'screenshot' => '/packages/workdo/Retainer/src/marketplace/image3.png'
                            ]
                        ]
                    ],
                    'screenshots' => [
                        'variant' => 'screenshots1',
                        'title' => 'Retainer Module in Action',
                        'subtitle' => 'See how our retainer tools improve your workflow',
                        'images' => $screenshots
                    ],
                    'why_choose' => [
                        'variant' => 'whychoose1',
                        'title' => 'Why Choose Retainer Module?',
                        'subtitle' => 'Improve efficiency with comprehensive retainer management',
                        'benefits' => [
                            [
                                'title' => 'Automated Process',
                                'description' => 'Automate your retainer workflow to save time and reduce errors.',
                                'icon' => 'Play',
                                'color' => 'blue'
                            ],
                            [
                                'title' => 'Comprehensive Reports',
                                'description' => 'Get detailed reports with metrics and performance data.',
                                'icon' => 'FileText',
                                'color' => 'green'
                            ],
                            [
                                'title' => 'Team Collaboration',
                                'description' => 'Share results and collaborate effectively with your team.',
                                'icon' => 'Users',
                                'color' => 'purple'
                            ],
                            [
                                'title' => 'Easy Integration',
                                'description' => 'Seamlessly integrate with your existing workflow.',
                                'icon' => 'GitBranch',
                                'color' => 'red'
                            ],
                            [
                                'title' => 'Quality Management',
                                'description' => 'Maintain high quality with comprehensive management tools.',
                                'icon' => 'CheckCircle',
                                'color' => 'yellow'
                            ],
                            [
                                'title' => 'Performance Tracking',
                                'description' => 'Track performance and identify improvements early.',
                                'icon' => 'Activity',
                                'color' => 'indigo'
                            ]
                        ]
                    ]
                ],
                'section_visibility' => [
                    'header' => true,
                    'hero' => true,
                    'modules' => true,
                    'dedication' => true,
                    'screenshots' => true,
                    'why_choose' => true,
                    'cta' => true,
                    'footer' => true
                ],
                'section_order' => ['header', 'hero', 'modules', 'dedication', 'screenshots', 'why_choose', 'cta', 'footer']
            ]
        ]);
    }
}