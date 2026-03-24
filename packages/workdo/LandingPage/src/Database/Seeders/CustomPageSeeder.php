<?php

namespace Workdo\LandingPage\Database\Seeders;

use Illuminate\Database\Seeder;
use Workdo\LandingPage\Models\CustomPage;

class CustomPageSeeder extends Seeder
{
    public function run()
    {
        $pages = [
            [
                'title' => 'About Us',
                'slug' => 'about-us',
                'content' => '<div class="space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">Empowering Business Finances</h2>
                        <p class="text-lg text-gray-600 max-w-3xl mx-auto">AccountGo SaaS is dedicated to providing robust accounting solutions that help businesses streamline their financial operations and achieve growth.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                            <p class="text-gray-600 leading-relaxed">To democratize access to enterprise-grade financial tools, enabling businesses of all sizes to manage their accounting with precision and ease.</p>
                        </div>
                        <div class="rounded-lg p-8 border border-white/10" style="background-color: color-mix(in srgb, var(--color-primary) 10%, #020617);">
                            <h3 class="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                            <p class="text-gray-600 leading-relaxed">To be the global standard for cloud-based business management, where every transaction is transparent, secure, and insightful.</p>
                        </div>
                    </div>
                    
                    <div class="rounded-lg p-8" style="background-color: color-mix(in srgb, var(--color-primary) 10%, #020617); border: 1px solid rgba(148, 163, 184, 0.25);">
                        <h3 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose AccountGo?</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: var(--color-primary);">
                                    <span class="text-white font-bold text-xl">1</span>
                                </div>
                                <h4 class="font-semibold text-gray-900 mb-2">Financial Accuracy</h4>
                                <p class="text-gray-600 text-sm">Double-entry accounting ensuring 100% accurate books.</p>
                            </div>
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: var(--color-primary);">
                                    <span class="text-white font-bold text-xl">2</span>
                                </div>
                                <h4 class="font-semibold text-gray-900 mb-2">Bank-Grade Security</h4>
                                <p class="text-gray-600 text-sm">Your financial data is protected with state-of-the-art encryption.</p>
                            </div>
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style="background-color: var(--color-primary);">
                                    <span class="text-white font-bold text-xl">3</span>
                                </div>
                                <h4 class="font-semibold text-gray-900 mb-2">Scalable Platform</h4>
                                <p class="text-gray-600 text-sm">From startup to enterprise, we grow with your business.</p>
                            </div>
                        </div>
                    </div>
                </div>',
                'meta_title' => 'About Us - AccountGo SaaS',
                'meta_description' => 'Learn about AccountGo SaaS, the leading cloud accounting platform for modern businesses.',
                'is_active' => true,
                'is_disabled' => false
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'content' => '<div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Data Privacy & Security</h2>
                        <p class="text-gray-600 mb-4">Last updated: ' . date('F d, Y') . '</p>
                        <p class="text-gray-600 leading-relaxed">At AccountGo SaaS, we take the security of your financial data seriously. This policy outlines how we protect your sensitive business information.</p>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Financial Data Protection</h3>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>All financial transactions are encrypted using SSL/TLS protocols.</li>
                            <li>We do not store your credit card details on our servers; they are handled by secure payment gateways.</li>
                            <li>Regular backups are performed to prevent data loss.</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Information Usage</h3>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>To provide accounting and invoicing services.</li>
                            <li>To generate financial reports and insights for your business.</li>
                            <li>To comply with legal and tax obligations.</li>
                        </ul>
                    </div>
                    
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Contact Data Officer</h3>
                        <p class="text-gray-600">For privacy concerns, contact our Data Protection Officer at privacy@accountgosaas.com</p>
                    </div>
                </div>',
                'meta_title' => 'Privacy Policy - AccountGo Data Protection',
                'meta_description' => 'How AccountGo SaaS protects your financial data and personal information.',
                'is_active' => true,
                'is_disabled' => true
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms-of-service',
                'content' => '<div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
                        <p class="text-gray-600 mb-4">Last updated: ' . date('F d, Y') . '</p>
                        <p class="text-gray-600 leading-relaxed">These Terms govern your use of the AccountGo SaaS accounting platform.</p>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Service Usage</h3>
                        <ul class="list-disc list-inside text-gray-600 space-y-2">
                            <li>You agree to use the platform for lawful business purposes only.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>We reserve the right to terminate accounts that violate these terms.</li>
                        </ul>
                    </div>
                    
                    <div class="rounded-lg p-6" style="background-color: color-mix(in srgb, var(--color-primary) 10%, #020617); border: 1px solid rgba(148, 163, 184, 0.25);">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Legal Contact</h3>
                        <p class="text-gray-600">For legal inquiries, contact legal@accountgosaas.com</p>
                    </div>
                </div>',
                'meta_title' => 'Terms of Service - AccountGo SaaS',
                'meta_description' => 'Read the terms and conditions for using the AccountGo SaaS platform.',
                'is_active' => true,
                'is_disabled' => true
            ],
            [
                'title' => 'FAQ',
                'slug' => 'faq',
                'content' => '<div class="space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">Common Questions</h2>
                        <p class="text-lg text-gray-600">Answers to your questions about AccountGo features and pricing.</p>
                    </div>
                    
                    <div class="space-y-6">
                        <div class="bg-white border rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Is Kyro built for Philippine businesses and compliance?</h3>
                            <p class="text-gray-600 leading-relaxed">Yes. Kyro is designed with Philippine startups and MSMEs in mind, including common reporting and documentation workflows used locally. The platform supports structured record-keeping that helps businesses stay organized for BIR requirements and external audits. For specific compliance needs, your accountant can easily review and export the necessary reports.</p>
                        </div>
                    
                        <div class="bg-white border rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Can my accountant access Kyro?</h3>
                            <p class="text-gray-600 leading-relaxed">Yes. You can import historical data from spreadsheets and gradually transition your records into Kyro without disrupting operations. Many founders start by migrating key balances first, then move ongoing transactions into the platform. If needed, your accountant can assist to ensure a clean and accurate setup.</p>
                        </div>
                        
                        
                        <div class="bg-white border rounded-lg p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Does Kyro support double-entry accounting?</h3>
                            <p class="text-gray-600 leading-relaxed">Yes. Kyro is built on double-entry accounting principles to ensure accurate financial records and reliable reporting. Every transaction maintains balance across accounts, making your books consistent and audit-ready. This also allows accountants to work within familiar accounting structures.</p>
                        </div>
                    </div>
                    
                    <div class="text-center rounded-lg p-8" style="background-color: color-mix(in srgb, var(--color-primary) 10%, #020617); border: 1px solid rgba(148, 163, 184, 0.25);">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">How does budgeting and variance tracking work?</h3>
                        <p class="text-gray-600 mb-4">Kyro lets you create structured budgets by category, project, or department and compare them against actual spending in real time. Variance insights help founders quickly spot overspending, savings, or unexpected changes. This supports better cash discipline and more confident decision-making.</p>
                        <button class="px-6 py-3 text-white rounded-md font-medium" style="background-color: var(--color-primary);">Contact Support</button>
                        
                    </div>
                    <div class="text-center rounded-lg p-8" style="background-color: color-mix(in srgb, var(--color-primary) 10%, #020617); border: 1px solid rgba(148, 163, 184, 0.25);">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">What is included in support?</h3>
                        <p class="text-gray-600 mb-4">Kyro provides email support, onboarding guidance, and access to help resources inside the Founder Support Hub. Founders can get assistance with setup, feature usage, and troubleshooting as they grow. You can contact support anytime at support@kyro.ph and expect a response within 24 hours.</p>
                        <button class="px-6 py-3 text-white rounded-md font-medium" style="background-color: var(--color-primary);">Contact Support</button>
                        
                    </div>
                    <div class="text-center rounded-lg p-8" style="background-color: color-mix(in srgb, var(--color-primary) 10%, #020617); border: 1px solid rgba(148, 163, 184, 0.25);">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Is my data secure and backed up?</h3>
                        <p class="text-gray-600 mb-4">Yes. Kyro uses secure infrastructure, controlled access permissions, and regular backups to protect your financial data. Your information remains private and accessible only to authorized users. These safeguards help ensure business continuity and peace of mind.</p>
                        <button class="px-6 py-3 text-white rounded-md font-medium" style="background-color: var(--color-primary);">Contact Support</button>
                        
                    </div>
                </div>',
                'meta_title' => 'FAQ - AccountGo SaaS Support',
                'meta_description' => 'Find answers to common questions about AccountGo SaaS accounting features.',
                'is_active' => true,
                'is_disabled' => false
            ],
            [
                'title' => 'Help Center',
                'slug' => 'help-center',
                'content' => '<div class="space-y-8">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">Founder Support Hub</h2>
                        <p class="text-lg text-gray-600">Guides and tutorials to help you master Kyro.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: var(--color-primary);">
                                <span class="text-white font-bold">📚</span>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Accounting Basics</h3>
                            <p class="text-gray-600 mb-4">Learn how to set up your Chart of Accounts and Opening Balances.</p>
                            <a href="#" class="font-medium" style="color: var(--color-primary);">Read Guide →</a>
                        </div>
                        
                        <div class="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: var(--color-primary);">
                                <span class="text-white font-bold">🎥</span>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Video Walkthroughs</h3>
                            <p class="text-gray-600 mb-4">Watch how to create specific invoices, bills, and reports.</p>
                            <a href="#" class="font-medium" style="color: var(--color-primary);">Watch Now →</a>
                        </div>
                        
                        <div class="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style="background-color: var(--color-primary);">
                                <span class="text-white font-bold">💬</span>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">User Community</h3>
                            <p class="text-gray-600 mb-4">Join other accountants and business owners in our forum.</p>
                            <a href="#" class="font-medium" style="color: var(--color-primary);">Visit Community →</a>
                        </div>
                    </div>
                </div>',
                'meta_title' => 'Help Center - AccountGo Resources',
                'meta_description' => 'Access documentation and guides for AccountGo SaaS.',
                'is_active' => true,
                'is_disabled' => false
            ]
        ];

        foreach ($pages as $pageData) {
            CustomPage::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }
    }
}