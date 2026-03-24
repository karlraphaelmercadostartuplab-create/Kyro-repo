<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->where('created_by', creatorId())
            ],
            'label' => 'required|string|max:255',
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'string|exists:permissions,name',
        ];
    }
public function messages(): array
    {
        return [
            'permissions.required' => __('Please select at least one permission.'),
            'permissions.min' => __('Please select at least one permission.'),
        ];
    }

}