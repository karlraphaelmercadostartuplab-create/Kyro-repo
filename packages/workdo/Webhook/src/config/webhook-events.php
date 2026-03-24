<?php

return [
    'events' => [
        'App\Events\CreateUser' => [
            [
                'action' => 'New User',
                'module' => 'general',
                'type' => 'super admin',
                'extractor' => 'Workdo\Webhook\Extractors\UserDataExtractor'
            ],
            [
                'action' => 'New User',
                'module' => 'general',
                'type' => 'company',
                'extractor' => 'Workdo\Webhook\Extractors\UserDataExtractor'
            ]
        ],

        // event use pending
        // 'App\Events\CreateSubscriber' => [
        //     'action' => 'New Subscriber',
        //     'module' => 'general',
        //     'type' => 'super admin',
        //     'extractor' => 'Workdo\Webhook\Extractors\SubscriberDataExtractor'
        // ],

        'App\Events\CreateSalesInvoice' => [
            'action' => 'New Sales Invoice',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\SalesInvoiceDataExtractor'
        ],
        'App\Events\PostSalesInvoice' => [
            'action' => 'Sales Invoice Status Updated',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\PostSalesInvoiceDataExtractor'
        ],
        'App\Events\CreateSalesProposal' => [
            'action' => 'New Sales Proposal',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\SalesProposalDataExtractor'
        ],
        'App\Events\AcceptSalesProposal' => [
            'action' => 'Sales Proposal Status Updated',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\AcceptSalesProposalDataExtractor'
        ],
        'App\Events\CreatePurchaseInvoice' => [
            'action' => 'New Purchase Invoice',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\PurchaseInvoiceDataExtractor'
        ],
        'App\Events\CreateWarehouse' => [
            'action' => 'New Warehouse',
            'module' => 'general',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\WarehouseDataExtractor'
        ],
        // Add other package wise event and data in this only, and create "Extractors" proper no need to do anything else

        'Workdo\Account\Events\CreateCustomer' => [
            'action' => 'New Customer',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\CustomerDataExtractor'
        ],
        'Workdo\Account\Events\CreateVendor' => [
            'action' => 'New Vendor',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\VendorDataExtractor'
        ],
        'Workdo\Account\Events\CreateRevenue' => [
            'action' => 'New Revenue',
            'module' => 'Account',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\RevenueDataExtractor'
        ],
        'Workdo\Retainer\Events\CreateRetainer' => [
            'action' => 'New Retainer',
            'module' => 'Retainer',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\RetainerDataExtractor'
        ],
        'Workdo\Retainer\Events\CreateRetainerPayment' => [
            'action' => 'New Retainer Payment',
            'module' => 'Retainer',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\RetainerPaymentDataExtractor'
        ],
        'Workdo\Contract\Events\CreateContract' => [
            'action' => 'New Contract',
            'module' => 'Contract',
            'type' => 'company',
            'extractor' => 'Workdo\Webhook\Extractors\ContractDataExtractor'
        ],
    ]
];
