<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function Dashboard(Request $request)
    {
        if(Auth::user()->type === 'superadmin') {
            return $this->superAdminDashboard();
        }

        return $this->regularDashboard();
    }

    private function superAdminDashboard()
    {
        $orderData = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as count, SUM(price) as payments')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = [
                'month' => $months[$i-1],
                'orders' => $orderData[$i]->count ?? 0,
                'payments' => $orderData[$i]->payments ?? 0
            ];
        }

        return Inertia::render('SuperAdminDashboard', [
            'stats' => [
                'order_payments' => Order::sum('price') ?? 0,
                'total_orders' => Order::count(),
                'total_plans' => Plan::count(),
                'total_companies' => User::where('type', 'company')->count(),
            ],
            'chartData' => $chartData
        ]);
    }

    private function regularDashboard()
    {
        $user = Auth::user();
        
        $canAccessAccountDashboard = $user->can('manage-account-dashboard')
            || $user->can('manage-dashboard');

        if (Module_is_active('Account') && $canAccessAccountDashboard) {
            return redirect()->route('account.index');
        
        }
        return Inertia::render('dashboard');
    }
}   
