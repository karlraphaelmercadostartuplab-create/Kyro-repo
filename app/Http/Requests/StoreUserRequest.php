<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $typeRule = auth()->user()->type === 'superadmin' ? 'nullable' : 'required|exists:roles,id';
        
        return [
            'name' => ['required', 'string', 'max:27', 'regex:/.*\S.*/'],
            'email' => 'required|email|unique:users,email',
            'mobile_no' => ['required', 'string', 'regex:/^\+\d{1,3}\d{9,13}$/'],
            'password' => ['required', 'confirmed', 'min:6', 'regex:/.*\S.*/'],
            'type' => $typeRule,
            'is_enable_login' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => __('Name must not exceed 27 characters.'),
            'name.regex' => __('Name cannot be blank.'),
            'mobile_no.required' => __('Mobile number is required.'),
            'mobile_no.regex' => __('Mobile number format must be +[country code][phone number].'),
            'password.regex' => __('Password cannot be blank.'),
            'type.required' => __('Role is required.'),
        ];
    }
}
