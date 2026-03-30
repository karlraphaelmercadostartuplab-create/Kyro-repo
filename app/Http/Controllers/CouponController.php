<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use App\Models\UserCoupon;

class CouponController extends Controller
{
    public function index()
    {
        if(Auth::user()->can('manage-coupons')){
            $coupons = Coupon::select('id', 'name', 'description', 'code', 'discount', 'type', 'limit', 'minimum_spend', 'maximum_spend', 'limit_per_user', 'expiry_date', 'included_module', 'excluded_module', 'status', 'created_at')
                ->where('created_by', creatorId())
                ->when(request('name'), fn($q) => $q->where('name', 'like', '%' . request('name') . '%'))
                ->when(request('code'), fn($q) => $q->where('code', 'like', '%' . request('code') . '%'))
                ->when(request('type'), fn($q) => $q->where('type', request('type')))
                ->when(request('status') !== null, fn($q) => $q->where('status', request('status')))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('coupons/index', [
                'coupons' => $coupons,
            ]);
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }

    public function store(StoreCouponRequest $request)
    {
        if(Auth::user()->can('create-coupons')){
            $validated = $request->validated();

            $coupon = new Coupon();
            $this->fillCouponFromRequest($coupon, $validated, $request);
            $coupon->save();

            return redirect()->route('coupons.index')->with('success', __('The coupon has been created successfully.'));
        }
        else{
            return redirect()->route('coupons.index')->with('error', __('Permission denied'));
        }
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon)
    {
        if(Auth::user()->can('edit-coupons')){
            $validated = $request->validated();

            $this->fillCouponFromRequest($coupon, $validated, $request);
            $coupon->save();

            return back()->with('success', __('The coupon details are updated successfully.'));
        }
        else{
            return redirect()->route('coupons.index')->with('error', __('Permission denied'));
        }
    }

    public function destroy(Coupon $coupon)
    {
        if(Auth::user()->can('delete-coupons')){
            $coupon->delete();

            return redirect()->route('coupons.index')->with('success', __('The coupon has been deleted.'));
        }
        else{
            return redirect()->route('coupons.index')->with('error', __('Permission denied'));
        }
    }

    public function show(Coupon $coupon)
    {
        if(Auth::user()->can('view-coupons')){
            $usageRecords = UserCoupon::with(['user:id,name,email', 'coupon:id,name,code'])
                ->where('coupon_id', $coupon->id)
                ->select('id', 'coupon_id', 'user_id', 'order_id', 'created_at')
                ->when(request('user_name'), fn($q) => $q->whereHas('user', fn($query) => $query->where('name', 'like', '%' . request('user_name') . '%')))
                ->when(request('order_id'), fn($q) => $q->where('order_id', 'like', '%' . request('order_id') . '%'))
                ->when(request('sort'), fn($q) => $q->orderBy(request('sort'), request('direction', 'asc')), fn($q) => $q->latest())
                ->paginate(request('per_page', 10))
                ->withQueryString();

            return Inertia::render('coupons/details', [
                'coupon' => $coupon,
                'usageRecords' => $usageRecords,
            ]);
        }
        else{
            return back()->with('error', __('Permission denied'));
        }
    }
    private function fillCouponFromRequest(Coupon $coupon, array $validated, Request $request): void
    {
        $columns = $this->couponColumns();
        $values = [
            'name' => $validated['name'] ?? '',
            'description' => $validated['description'] ?? null,
            'code' => $validated['code'] ?? '',
            'discount' => $validated['discount'] ?? 0,
            'limit' => $validated['limit'] ?? null,
            'type' => $validated['type'] ?? '',
            'minimum_spend' => $validated['minimum_spend'] ?? null,
            'maximum_spend' => $validated['maximum_spend'] ?? null,
            'limit_per_user' => $validated['limit_per_user'] ?? null,
            'expiry_date' => $validated['expiry_date'] ?? null,
            'included_module' => $validated['included_module'] ?? null,
            'excluded_module' => $validated['excluded_module'] ?? null,
            'status' => $request->boolean('status', true),
            'created_by' => creatorId(),
        ];

        foreach ($values as $field => $value) {
            if (in_array($field, $columns, true) && !($field === 'created_by' && $coupon->exists)) {
                $coupon->{$field} = $value;
            }
        }
    }

    private function couponColumns(): array
    {
        static $columns = null;

        if ($columns === null) {
            $columns = Schema::getColumnListing((new Coupon())->getTable());
        }

        return $columns;
    }
}