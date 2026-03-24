<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name' => ['required', 'string', 'max:27', 'regex:/.*\S.*/'],
            'email' => 'required|email|unique:users,email,' . $userId,
            'mobile_no' => ['required', 'string', 'regex:/^\+\d{1,3}\d{9,13}$/'],
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
        ];
    }
}
