<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginHistory;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\ChangePasswordRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Events\CreateUser;
use App\Models\EmailTemplate;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Session;

class UserController extends Controller
{
    public function index()
    {
        if(Auth::user()->can('manage-users')){
            $users = User::query()
                ->where(function($q) {
                    if(Auth::user()->can('manage-any-users')) {
                        $q->where('created_by', creatorId());
                    } elseif(Auth::user()->can('manage-own-users')) {
                        $q->where('creator_id', Auth::id());
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->when(request('name'), fn($q) => $q->where('name', 'like', '%' . request('name') . '%'))
                ->when(request('email'), fn($q) => $q->where('email', 'like', '%' . request('email') . '%'))
                ->when(request('role'), fn($q) => $q->join('model_has_roles', 'users.id', '=', 'model_has_roles.model_id')
                    ->where('model_has_roles.role_id', request('role'))
                    ->where('model_has_roles.model_type', User::class))
                ->when(request('is_enable_login') !== null, fn($q) => $q->where('is_enable_login', request('is_enable_login')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->select('users.*')
                ->paginate(request('per_page', 10))
                ->withQueryString();

            $roles = Role::where('created_by', creatorId())->pluck('label', 'id');

            return Inertia::render('users/index', [
                'users' => $users,
                'roles' => $roles,
            ]);
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreUserRequest $request)
    {
        if(Auth::user()->can('create-users')){
            $checkUser = canCreateUser();
            if (!$checkUser['can_create']) {
                return redirect()->route('users.index')->with('error', $checkUser['message']);
            }

            $validated = $request->validated();
            $validated['is_enable_login'] = filter_var($request->input('is_enable_login', 1), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $validated['is_enable_login'] = $validated['is_enable_login'] ?? in_array((string) $request->input('is_enable_login', '1'), ['1', 'true', 'on'], true);

            $role = Role::find($validated['type']);
            $enableEmailVerification = admin_setting('enableEmailVerification');

            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->mobile_no = $validated['mobile_no'];
            $user->password = Hash::make($validated['password']);
            $user->type = Auth::user()->type == 'superadmin' ? 'company' : ($role->name ?? 'staff');
            $user->is_enable_login = $validated['is_enable_login'];
            $user->is_disable = $validated['is_enable_login'] ? 0 : 1;
            $user->lang = company_setting('defaultLanguage') ?? 'en';
            $user->email_verified_at = $enableEmailVerification === 'on' ? null : now();
            $user->creator_id = Auth::id();
            $user->created_by = creatorId();
            $user->save();

            if(Auth::user()->type == 'superadmin')
            {
                User::CompanySetting($user->id);
                User::MakeRole($user->id);
                $role = Role::findByName('company');
            }

            $user->assignRole($role);

            // Dispatch event for packages to handle their fields
            CreateUser::dispatch($request, $user);

             // Send welcome email
            if(company_setting('New User') == 'on') {
                $emailData = [
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $validated['password'],
                ];

                EmailTemplate::sendEmailTemplate('New User', [$user->email], $emailData);
            }

            if ($enableEmailVerification === 'on') {
                // Apply dynamic mail configuration
                SetConfigEmail(creatorId());
                $user->sendEmailVerificationNotification();
            }

            return redirect()->route('users.index')->with('success', __('The user has been created successfully.'));
        }
        else{
            return redirect()->route('users.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        if(Auth::user()->can('edit-users')){
            $validated = $request->validated();
            $validated['is_enable_login'] = filter_var($request->input('is_enable_login', 1), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $validated['is_enable_login'] = $validated['is_enable_login'] ?? in_array((string) $request->input('is_enable_login', '1'), ['1', 'true', 'on'], true);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->mobile_no = $validated['mobile_no'];
            $user->is_enable_login = $validated['is_enable_login'];
            $user->is_disable = $validated['is_enable_login'] ? 0 : 1;
            $user->save();

            return back()->with('success', __('The user details are updated successfully.'));
        }
        else{
            return redirect()->route('users.index')->with('error', __('Permission denied'));
        }
    }

    public function changePassword(ChangePasswordRequest $request, User $user)
    {
        if(Auth::user()->can('change-password-users') && $user->created_by == creatorId() ){
            $validated = $request->validated();
            $user->password = Hash::make($validated['password']);
            $user->save();

            return redirect()->route('users.index')->with('success', __('The password changed successfully.'));
        }
        else{
            return redirect()->route('users.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(User $user)
    {
        if(Auth::user()->can('delete-users')){
            $user->delete();

            return back()->with('success', __('The user has been deleted.'));
        }
        else{
            return redirect()->route('users.index')->with('error', __('Permission denied'));
        }
    }

    public function impersonate(User $user)
    {
        if (Auth::user()->can('impersonate-users'))
        {
            $impersonator = Auth::user();

            if ($user->id === Auth::id()) {
                return redirect()->route('users.index')->with('error', __('You cannot login as user yourself'));
            }

            if ($impersonator->type !== 'superadmin' && $user->created_by !== creatorId()) {
                return redirect()->route('users.index')->with('error', __('Permission denied'));
            }

            if (!$user->is_enable_login || (int) $user->is_disable === 1) {
                return redirect()->route('users.index')->with('error', __('Your account has been disabled. Please contact the administrator.'));
            }

            // Store the original user ID in session
            Session::put('impersonator_id', Auth::id());

            // Login as the target user
            Auth::login($user);
            $this->logLoginHistory(request(), 'impersonation', [
                'impersonated_by_id' => $impersonator->id,
                'impersonated_by_name' => $impersonator->name,
                'impersonated_by_email' => $impersonator->email,
            ]);
        }
        else
        {
            return redirect()->route('users.index')->with('error', __('Permission denied'));
        }

        return redirect()->route('dashboard')->with('success', __('You are now login as user :name', ['name' => $user->name]));
    }

    public function leaveImpersonation()
    {
        if (!Session::has('impersonator_id')) {
            return redirect()->route('dashboard')->with('error', __('You are not login as user anyone'));
        }

        $originalUserId = Session::get('impersonator_id');
        $originalUser = User::find($originalUserId);

        if (!$originalUser) {
            Session::forget('impersonator_id');
            return redirect()->route('login')->with('error', __('Original user not found'));
        }

        Session::forget('impersonator_id');
        Auth::login($originalUser);

        return redirect()->route('users.index')->with('success', __('You have stopped login as user'));
    }

    public function loginHistory()
    {
        if(Auth::user()->can('view-login-history')){
            $loginHistories = LoginHistory::with('user')
                ->when(Auth::user()->type !== 'superadmin', fn($q) => $q->where('created_by', creatorId()))
                ->when(request('user_name'), function ($q) {
                    $search = request('user_name');
                    $q->where(function ($query) use ($search) {
                        $query->where('details->user_name', 'like', '%' . $search . '%')
                            ->orWhereHas('user', fn($userQuery) => $userQuery->where('name', 'like', '%' . $search . '%'));
                    });
                })
                ->when(request('ip'), fn($q) => $q->where('ip', 'like', '%' . request('ip') . '%'))
                ->when(request('role'), fn($q) => $q->where('type', request('role')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            $roles = Role::where('created_by', creatorId())->pluck('label', 'name');

            return Inertia::render('users/login-history', [
                'loginHistories' => $loginHistories,
                'roles' => $roles,
            ]);
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    private function logLoginHistory($request, string $authMethod = 'login', array $extraDetails = []): void
    {
        $ip = $request->ip();
        $locationData = $this->getLocationData($ip);
        $userAgent = $request->userAgent();
        $browserData = parseBrowserData($userAgent);
        $details = array_merge($locationData, $browserData, [
            'status' => 'success',
            'auth_method' => $authMethod,
            'user_name' => Auth::user()->name,
            'user_email' => Auth::user()->email,
            'user_type' => Auth::user()->type,
            'referrer_host' => $request->headers->get('referer') ? parse_url($request->headers->get('referer'), PHP_URL_HOST) : null,
            'referrer_path' => $request->headers->get('referer') ? parse_url($request->headers->get('referer'), PHP_URL_PATH) : null,
        ], $extraDetails);

        $loginHistory = new LoginHistory();
        $loginHistory->user_id = Auth::id();
        $loginHistory->ip = $ip;
        $loginHistory->date = now()->toDateString();
        $loginHistory->details = $details;
        $loginHistory->type = Auth::user()->type;
        $loginHistory->created_by = creatorId();
        $loginHistory->save();
    }

    private function getLocationData(string $ip): array
    {
        try {
            $response = Http::timeout(5)->get("http://ip-api.com/json/{$ip}");
            if ($response->successful()) {
                $data = $response->json();
                return [
                    'country' => $data['country'] ?? null,
                    'countryCode' => $data['countryCode'] ?? null,
                    'region' => $data['region'] ?? null,
                    'regionName' => $data['regionName'] ?? null,
                    'city' => $data['city'] ?? null,
                    'zip' => $data['zip'] ?? null,
                    'lat' => $data['lat'] ?? null,
                    'lon' => $data['lon'] ?? null,
                    'timezone' => $data['timezone'] ?? null,
                    'isp' => $data['isp'] ?? null,
                    'org' => $data['org'] ?? null,
                    'as' => $data['as'] ?? null,
                    'query' => $data['query'] ?? $ip,
                ];
            }
        } catch (\Exception $e) {
            // Ignore API errors
        }

        return ['query' => $ip];
    }
}
