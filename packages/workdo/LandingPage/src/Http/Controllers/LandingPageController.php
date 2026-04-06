<?php

namespace Workdo\LandingPage\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use App\Models\AddOn;
use App\Models\Plan;
use App\Models\User;
use Workdo\LandingPage\Models\LandingPageSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Workdo\LandingPage\Models\CustomPage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LandingPageController extends Controller
{
    public function index(Request $request)
    {
        $settings = Cache::remember('landing_page_settings', 3600, function () {
            return LandingPageSetting::first();
        });

        if (!isLandingPageEnabled()) {
            $enableRegistration = admin_setting('enableRegistration');

            return Inertia::render('auth/login', [
                'canResetPassword' => Route::has('password.request'),
                'status' => session('status'),
                'enableRegistration' => $enableRegistration === 'on',
            ]);
        }

        $enableRegistration = admin_setting('enableRegistration');
        $customPages = CustomPage::where('is_active', true)->select('id', 'title', 'slug')->get();

        $settingsData = $settings ? $settings->toArray() : [];
        $settingsData['enable_registration'] = $enableRegistration === 'on';
        $settingsData['is_authenticated'] = $request->user() !== null;
        $settingsData['custom_pages'] = $customPages;

        return Inertia::render('LandingPage/Landing', [
            'auth' => [
                'user' => $request->user(),
                'lang' => app()->getLocale()
            ],
            'settings' => $settingsData
        ]);
    }

    public function pricing(Request $request)
    {
        // Get active plans from the main app
        $plans = Plan::where('status', true)
            ->withCount('orders')
            ->get();

        // Get active modules/addons
        $activeModules = AddOn::where('is_enable', true)
            ->whereNotIn('module', User::$superadmin_activated_module)
            ->select('module', 'name as alias', 'image', 'monthly_price', 'yearly_price')
            ->get();

        $landingPageSettings = LandingPageSetting::first();
        $enableRegistration = admin_setting('enableRegistration');
        $customPages = CustomPage::where('is_active', true)->select('id', 'title', 'slug')->get();

        $settingsData = $landingPageSettings ? $landingPageSettings->toArray() : [];
        $settingsData['enable_registration'] = $enableRegistration === 'on';
        $settingsData['is_authenticated'] = $request->user() !== null;
        $settingsData['custom_pages'] = $customPages;

        return Inertia::render('LandingPage/Pricing', [
            'plans' => $plans->map(function($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'description' => $plan->description,
                    'package_price_monthly' => $plan->package_price_monthly,
                    'package_price_yearly' => $plan->package_price_yearly,
                    'number_of_users' => $plan->number_of_users,
                    'storage_limit' => $plan->storage_limit,
                    'modules' => $plan->modules ?? [],
                    'free_plan' => $plan->free_plan,
                    'trial' => $plan->trial,
                    'trial_days' => $plan->trial_days,
                    'orders_count' => $plan->orders_count
                ];
            }),
            'activeModules' => $activeModules,
            'settings' => $settingsData,

        ]);
    }

    public function settings()
    {
        if(Auth::user()->can('manage-landing-page')){
            $settings = LandingPageSetting::first();
            $customPages = CustomPage::where('is_active', true)->select('id', 'title', 'slug')->get();
            return Inertia::render('LandingPage/Settings', [
                'settings' => $settings ?: [
                    'company_name' => '',
                    'contact_email' => '',
                    'contact_phone' => '',
                    'contact_address' => '',
                    'config_sections' => [
                        'sections' => [],
                        'section_visibility' => [
                            'header' => true,
                            'hero' => true,
                            'stats' => true,
                            'features' => true,
                            'modules' => true,
                            'benefits' => true,
                            'gallery' => true,
                            'cta' => true,
                            'footer' => true
                        ],
                        'section_order' => ['header', 'hero', 'stats', 'features', 'modules', 'benefits', 'gallery', 'cta', 'footer']
                    ]
                ],
                'customPages' => $customPages
            ]);
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(Request $request)
    {
        if(Auth::user()->can('edit-landing-page')){
            $validated = $request->validate([
                'company_name' => 'nullable|string|max:255',
                'contact_email' => 'nullable|email|max:255',
                'contact_phone' => 'nullable|string|max:255',
                'contact_address' => 'nullable|string',
                'config_sections' => 'nullable|array'
            ]);

            // Handle image paths - store only filename
            if (isset($validated['config_sections']['sections'])) {
                $this->processImagePaths($validated['config_sections']['sections']);
                $this->sanitizeNavigationLinks($validated['config_sections']['sections']);
            }

            LandingPageSetting::updateOrCreate(['id' => 1], $validated);

            return back()->with('success', 'Settings saved successfully');
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    private function processImagePaths(&$sections)
    {
        foreach ($sections as $sectionKey => &$sectionData) {
            if (is_array($sectionData)) {
                // Handle single images (hero, cta)
                if (isset($sectionData['image'])) {
                    $sectionData['image'] = $this->processImagePath($sectionData['image']);
                }
                
                // Handle gallery images array
                if (isset($sectionData['images']) && is_array($sectionData['images'])) {
                    $sectionData['images'] = array_map([$this, 'processImagePath'], $sectionData['images']);
                }
            }
        }
    }

    private function processImagePath($imagePath)
    {
        if (strpos($imagePath, 'packages/workdo') !== false) {
            return $imagePath;
        }
        return basename($imagePath);
    }
    private function sanitizeNavigationLinks(array &$sections): void
    {
        $invalidLinks = [];

        if (isset($sections['header']['navigation_items']) && is_array($sections['header']['navigation_items'])) {
            foreach ($sections['header']['navigation_items'] as $index => &$item) {
                if (!is_array($item) || !isset($item['href'])) {
                    continue;
                }

                $item['href'] = $this->validateAndNormalizeHref(
                    $item['href'],
                    "Header navigation item #" . ($index + 1),
                    $invalidLinks
                );
            }
        }

        if (isset($sections['footer']['navigation_sections']) && is_array($sections['footer']['navigation_sections'])) {
            foreach ($sections['footer']['navigation_sections'] as $sectionIndex => &$section) {
                if (!is_array($section) || !isset($section['links']) || !is_array($section['links'])) {
                    continue;
                }

                foreach ($section['links'] as $linkIndex => &$link) {
                    if (!is_array($link) || !isset($link['href'])) {
                        continue;
                    }

                    $link['href'] = $this->validateAndNormalizeHref(
                        $link['href'],
                        "Footer section #" . ($sectionIndex + 1) . " link #" . ($linkIndex + 1),
                        $invalidLinks
                    );
                }
            }
        }

        if (!empty($invalidLinks)) {
            throw ValidationException::withMessages([
                'config_sections' => __('Some links are invalid or unsafe. Allowed formats: #anchor, /path, /page/{slug}, or full https:// URL. Invalid: :links', [
                    'links' => implode(', ', $invalidLinks),
                ]),
            ]);
        }
    }

    private function validateAndNormalizeHref(mixed $href, string $label, array &$invalidLinks): string
    {
        $normalizedHref = trim((string) $href);

        if ($normalizedHref === '') {
            return '';
        }

        if (preg_match('/[\x00-\x1F\x7F]/', $normalizedHref)) {
            $invalidLinks[] = $label;
            return '';
        }

        if (str_starts_with($normalizedHref, '#')) {
            if (preg_match('/^#[A-Za-z0-9\-_:.]+$/', $normalizedHref) !== 1) {
                $invalidLinks[] = $label;
                return '';
            }
            return $normalizedHref;
        }

        if (str_starts_with($normalizedHref, '/')) {
            if (str_starts_with($normalizedHref, '//')) {
                $invalidLinks[] = $label;
                return '';
            }

            return $normalizedHref;
        }

        if (filter_var($normalizedHref, FILTER_VALIDATE_URL) === false) {
            $invalidLinks[] = $label;
            return '';
        }

        $scheme = strtolower((string) parse_url($normalizedHref, PHP_URL_SCHEME));
        if (!in_array($scheme, ['http', 'https'], true)) {
            $invalidLinks[] = $label;
            return '';
        }

        return $normalizedHref;
    }
}