<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHelpdeskCategoryRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->name)) {
            $this->merge([
                'name' => trim($this->name),
            ]);
        }
    }
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $helpdeskCategory = $this->route('helpdesk_category');
        return [
             'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('helpdesk_categories', 'name')
                    ->where(function ($query) {
                        return $query->where('created_by', creatorId());
                    })
                    ->ignore($helpdeskCategory?->id),
            ],
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
        ];
    }
    public function messages(): array
    {
        return [
            'name.unique' => __('A helpdesk category with this name already exists.'),
        ];
    }
}