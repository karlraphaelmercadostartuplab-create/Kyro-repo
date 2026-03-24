<?php

namespace Workdo\Twilio\Database\Seeders;

use App\Models\Notification;
use App\Models\NotificationTemplateLang;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $modules = [
            'general'                 => ['New User', 'New Sales Invoice', 'Sales Invoice Status Updated', 'New Proposal', 'Proposal Status Updated', 'Bank Transfer Payment Status Updated', 'New Purchase Invoice', 'New Warehouse'],
            'Account'                 => ['New Customer', 'New Vendor', 'New Revenue'],            
            'Contract'                => ['New Contract'],
        ];

        $defaultTemplate = [
            'New User'                    => [
                'variables' => '{"Company Name": "company_name","User Name": "user_name" }',
                'lang'      => [
                    'ar' => 'مستخدم جديد {user_name} تم تكوينه بواسطة {company_name}',
                    'da' => 'En ny bruger {user_name} er oprettet af {company_name}',
                    'de' => 'Ein neuer Benutzer {user_name} wurde erstellt von {company_name}',
                    'en' => 'A New User {user_name} has been created by {company_name}',
                    'es' => 'Un nuevo usuario {user_name} ha sido creado por {company_name}',
                    'fr' => 'Un nouvel utilisateur {user_name} a été créé par {company_name}',
                    'it' => 'Un Nuovo utente {user_name} è stato creato da {company_name}',
                    'ja' => '新規ユーザー {user_name} が {company_name} によって作成されました。',
                    'nl' => 'Een nieuwe gebruiker {user_name} is gemaakt door {company_name}',
                    'pl' => 'Nowy użytkownik {user_name} został utworzony przez {company_name}',
                    'ru' => 'Новый пользователь {user_name} создано в {company_name}',
                    'pt' => 'Um Novo Usuário {user_name} foi criado por {company_name}',
                ],
            ],
            'New Sales Invoice'           => [
                'variables' => '{"Sales Invoice Id" : "sales_invoice_id" , "Company Name":"company_name"}',
                'lang'      => [
                    'ar' => 'فاتورة مبيعات جديدة {sales_invoice_id} تكوين بواسطة {company_name}',
                    'da' => 'Ny salgsfaktura {sales_invoice_id} oprettet af {company_name}',
                    'de' => 'Neue Verkaufsrechnung {sales_invoice_id} erstellt von {company_name}',
                    'en' => 'New Sales Invoice {sales_invoice_id} created by {company_name}',
                    'es' => 'Nueva factura de ventas {sales_invoice_id} creada por {nombre_empresa}',
                    'fr' => 'Nouvelle facture de vente {sales_invoice_id} Créé par {company_name}',
                    'it' => 'Nuova Fattura di vendita {sales_invoice_id} creata da {company_name}',
                    'ja' => ' 新規販売請求 {sales_invoice_id} 作成者 {company_name}',
                    'nl' => 'Nieuwe verkoopfactuur {sales_invoice_id} gemaakt door {company_name}',
                    'pl' => 'Nowa faktura sprzedaży {sales_invoice_id} utworzone przez {company_name}',
                    'ru' => 'Новая накладная продаж {sales_invoice_id} кем создано {company_name}',
                    'pt' => 'Nova Fatura De Vendas {sales_invoice_id} criado por {company_name}',
                ],
            ],
            'Sales Invoice Status Updated' => [
                'variables' => '{"Company Name" : "company_name" }',
                'lang' => [
                    'ar' => 'تم تعديل حالة الفاتورة بواسطة {company_name}',
                    'da' => 'Fakturastatus opdateret af {company_name}',
                    'de' => 'Rechnungsstatus aktualisiert von {company_name}',
                    'en' => 'Invoice status updated by {company_name}',
                    'es' => 'Estado de factura actualizado por {company_name}',
                    'fr' => 'Etat de la facture mis à jour par {company_name}',
                    'it' => 'Stato della fattura aggiornato da {company_name}',
                    'ja' => '請求書ステータスの更新者 {company_name}',
                    'nl' => 'Factuurstatus bijgewerkt door {company_name}',
                    'pl' => 'Status faktury zaktualizowany przez {company_name}',
                    'ru' => 'Состояние счета-фактуры изменено {company_name}',
                    'pt' => 'Status da fatura atualizado por {company_name}',
                ],
            ],
            'New Proposal' => [
                'variables' => '{"company Name": "company_name"}',
                'lang' => [
                    'ar' => 'اقتراح جديد تم تكوينه بواسطة {company_name}',
                    'da' => 'Ny Forslag til oprettet af {company_name}',
                    'de' => 'Neuer Vorschlag erstellt von {company_name}',
                    'en' => 'New Proposal created by {company_name}',
                    'es' => 'Nueva propuesta creada por {company_name}',
                    'fr' => 'Nouvelle proposition créée par {company_name}',
                    'it' => 'Nuova Proposta creata da {company_name}',
                    'ja' => '作成者の新規提案 {company_name}',
                    'nl' => 'Nieuw voorstel gemaakt door {company_name}',
                    'pl' => 'Nowa propozycja utworzona przez {company_name}',
                    'ru' => 'Новое предложение, созданное {company_name}',
                    'pt' => 'Nova Proposta criada por {company_name}',
                ],
            ],
            'Proposal Status Updated' => [
                'variables' => '{"Company Name" : "company_name" }',
                'lang' => [
                    'ar' => 'تم تحديث حالة المقترح بواسطة {company_name}',
                    'da' => 'Forslag til status opdateret af {company_name}',
                    'de' => 'Vorschlag für Status aktualisiert von {company_name}',
                    'en' => 'Proposal status updated by {company_name}',
                    'es' => 'Estado de la propuesta actualizado por {company_name}',
                    'fr' => 'Etat de la proposition mis à jour par {company_name}',
                    'it' => 'Stato di proposta aggiornato da {company_name}',
                    'ja' => 'プロポーザル状況の更新者 {company_name}',
                    'nl' => 'Status van voorstel bijgewerkt door {company_name}',
                    'pl' => 'Status propozycji został zaktualizowany przez {company_name}',
                    'ru' => 'Состояние предложения обновлено {company_name}',
                    'pt' => 'Status da proposta atualizado por {company_name}',
                ],
            ],
            'Bank Transfer Payment Status Updated' => [
                'variables' => '{"Company Name" : "company_name" ,"Invoice Id": "invoice_id"}',
                'lang' => [
                    'ar' => 'تمت الموافقة على طلب التحويل المصرفي بواسطة {company_name} للفاتورة {invoice_id}',
                    'da' => 'Bankoverførselsanmodning godkendt af {company_name} for faktura {invoice_id}',
                    'de' => 'Bank-Transfer-Anfrage genehmigt von {company_name} für Rechnung {invoice_id}',
                    'en' => 'Bank Transfer Request Approved by {company_name} for invoice {invoice_id}',
                    'es' => 'Solicitud de transferencia bancaria aprobada por {company_name} para la factura {invoice_id}',
                    'fr' => 'Demande de transfert bancaire approuvée par {company_name} Pour la facture {invoice_id}',
                    'it' => 'Richiesta Di Trasferimento Bancario Approvata da {company_name} per fattura {invoice_id}',
                    'ja' => '銀行振替要求承認済み {company_name} 請求書の {invoice_id}',
                    'nl' => 'Aanvraag bankoverdracht goedgekeurd door {company_name} voor factuur {invoice_id}',
                    'pl' => 'Zlecenie przelewu bankowego zatwierdzone przez {company_name} dla faktury {invoice_id}',
                    'ru' => 'Заявка на банковский перевод, утвержденная {company_name} для накладной {invoice_id}',
                    'pt' => 'Pedido De Transferência Bancária Aprovado por {company_name} para fatura {invoice_id}',
                ],
            ],
            'New Customer' => [
                'variables' => '{"Company Name": "company_name"}',
                'lang' => [
                    'ar' => 'تم تكوين عميل جديد بواسطة {company_name}',
                    'da' => 'Ny kunde oprettet af {company_name}',
                    'de' => 'Neuer Kunde erstellt von {company_name}',
                    'en' => 'New Customer created by {company_name}',
                    'es' => 'Nuevo creado por creado por {company_name}',
                    'fr' => 'Nouveau client créé par {company_name}',
                    'it' => 'Nuovo Cliente creato da {company_name}',
                    'ja' => '新規顧客が作成者 {company_name}',
                    'nl' => 'Nieuwe klant gemaakt door {company_name}',
                    'pl' => 'Nowy klient utworzony przez {company_name}',
                    'ru' => 'Новый заказчик, созданный {company_name}',
                    'pt' => 'Novo Cliente criado por {company_name}',
                ],
            ],
            'New Bill' => [
                'variables' => '{"Company Name": "company_name" , "Bill Id" : "bill_id"}',
                'lang' => [
                    'ar' => 'مشروع قانون جديد {bill_id} تكوين بواسطة {company_name}',
                    'da' => 'Ny faktura {bill_id} oprettet af {company_name}',
                    'de' => 'Neue Bill {bill_id} erstellt von {company_name}',
                    'en' => 'New Bill {bill_id} created by {company_name}',
                    'es' => 'Nueva factura {bill_id} creada por {company_name}',
                    'fr' => 'Nouvelle facture {bill_id} créée par {company_name}',
                    'it' => 'Nuovo Bill {bill_id} creato da {company_name}',
                    'ja' => '新規請求書 {bill_id} の作成者 {company_name}',
                    'nl' => 'Nieuwe factuur {bill_id} gemaakt door {company_name}',
                    'pl' => 'Nowy rachunek {bill_id} utworzone przez {company_name}',
                    'ru' => 'Новый законопроект {bill_id} кем создано {company_name}',
                    'pt' => 'Novo Bill {bill_id} criado por {company_name}',
                ],
            ],
            'New Vendor' => [
                'variables' => '{"Company Name": "company_name"}',
                'lang' => [
                    'ar' => 'تم تكوين مورد جديد بواسطة {company_name}',
                    'da' => 'Ny leverandør oprettet af {company_name}',
                    'de' => 'Neuer Anbieter erstellt von {company_name}',
                    'en' => 'New Vendor created by {company_name}',
                    'es' => 'Nuevo proveedor creado por {company_name}',
                    'fr' => 'Nouveau fournisseur créé par {company_name}',
                    'it' => 'Nuovo Fornitore creato da {company_name}',
                    'ja' => '新規ベンダーの作成者 {company_name}',
                    'nl' => 'Nieuwe leverancier gemaakt door {company_name}',
                    'pl' => 'Nowy dostawca utworzony przez {company_name}',
                    'ru' => 'Новый поставщик, созданный {company_name}',
                    'pt' => 'Novo Fornecedor criado por {company_name}',
                ],
            ],
            'New Revenue' => [
                'variables' => '{"Company Name": "company_name" , "User Name" : "user_name" , "Amount": "amount"}',
                'lang' => [
                    'ar' => 'عائد جديد {amount} تم التكوين الى {user_name} بواسطة {company_name}',
                    'da' => 'Ny indtægt for {amount} oprettet for {user_name} af {company_name}',
                    'de' => 'Neuer Umsatz von {amount} erstellt für {user_name} von {company_name}',
                    'en' => 'New Revenue of {amount} created for {user_name} by {company_name}',
                    'es' => 'Nuevos ingresos de {amount} creados para {user_name} por {company_name}',
                    'fr' => 'Nouveau chiffre daffaires de {amount} créé pour {user_name} par {company_name}',
                    'it' => 'Nuove Entrate di {amount} create per {user_name} da {company_name}',
                    'ja' => '新規収益 {amount} 作成対象 {user_name} による {company_name}',
                    'nl' => 'Nieuwe ontvangsten van {amount} gemaakt voor {user_name} door {company_name}',
                    'pl' => 'Nowy przychód z {amount} utworzone dla {user_name} przez użytkownika {company_name}',
                    'ru' => 'Новый доход от {amount} создано для {user_name} по {company_name}',
                    'pt' => 'Nova Receita de {amount} criado para {user_name} por {company_name}',
                ],
            ],
            'New Payment' => [
                'variables' => '{"Vender Name" : "vender_name" , "Amount": "amount"}',
                'lang' => [
                    'ar' => 'دفعة جديدة {amount} تم التكوين الى {vender_name} بواسطة السداد',
                    'da' => 'Ny betaling af {amount} oprettet for {vender_name} efter betaling',
                    'de' => 'Neue Zahlung von {amount} erstellt für {vender_name} durch Zahlung',
                    'en' => 'New payment of {amount} created for {vender_name} by payment',
                    'es' => 'Se ha creado un nuevo pago de {amount} para {vender_name} por pago',
                    'fr' => 'Nouveau paiement de {amount} créé pour {vender_name} par paiement',
                    'it' => 'Nuovo pagamento di {amount} creato per {vender_name} a pagamento',
                    'ja' => '新規支払い {amount} 作成対象 {vender_name} 支払いによって',
                    'nl' => 'Nieuwe betaling van {amount} gemaakt voor {vender_name} door betaling',
                    'pl' => 'Nowa płatność {amount} utworzone dla {vender_name} Według płatności',
                    'ru' => 'Новая выплата {amount} создано для {vender_name} по платежным',
                    'pt' => 'Novo pagamento de {amount} criado para {vender_name} por pagamento',
                ],
            ],
            'New Contract'                => [
                'variables' => '{"Company Name": "company_name" , "Contract Number" : "contract_number"}',
                'lang'      => [
                    'ar' => 'عقد جديد {contract_number} تم التكوين بواسطة {company_name}',
                    'da' => 'Ny kontrakt {contract_number} Oprettet af {company_name}',
                    'de' => 'Neuer Vertrag {contract_number} Erstellt von {company_name}',
                    'en' => 'New Contract {contract_number} Created By {company_name}',
                    'es' => 'Se ha creado el nuevo contrato {contract_number} por {company_name}',
                    'fr' => 'Nouveau contrat {contract_number} Créé par {company_name}',
                    'it' => 'Nuovo Contratto {contract_number} Creato da {company_name}',
                    'ja' => '新規契約 {contract_number} 作成者 {company_name}',
                    'nl' => 'Nieuw contract {contract_number} Gemaakt door {company_name}',
                    'pl' => 'Nowa umowa {contract_number} Utworzone przez {company_name}',
                    'ru' => 'Новый договор {contract_number} Кем создано {company_name}',
                    'pt' => 'Novo Contrato {contract_number} Criado Por {company_name}',
                ],
            ],
            'New Purchase Invoice'                => [
                'variables' => '{"Purchase Id" : "purchase_id", "Company Name" : "company_name"}',
                'lang'      => [
                    'ar' => 'شراء جديد {purchase_id} تكوين بواسطة الى {company_name}',
                    'da' => 'Nyt indkøb {purchase_id} oprettet af til {company_name}',
                    'de' => 'Neuer Kauf {purchase_id} erstellt von nach {company_name}',
                    'en' => 'New Purchase {purchase_id} created by to {company_name}',
                    'es' => 'Nueva compra {purchase_id} creada por {company_name}',
                    'fr' => 'Nouvel achat {purchase_id} Créé par pour {company_name}',
                    'it' => 'Nuovo Acquisto {purchase_id} creato da a {company_name}',
                    'ja' => '新規購入 {purchase_id} 作成者 {company_name}',
                    'nl' => 'Nieuwe aankoop {purchase_id} skabt af til {company_name}',
                    'pl' => 'Nowy zakup {purchase_id} utworzone przez {company_name}',
                    'ru' => 'Новая покупка {purchase_id} создано в {company_name}',
                    'pt' => 'Nova Compra {purchase_id} criado por para {company_name}',
                ],
            ],
            'New Warehouse'               => [
                'variables' => '{"Company Name": "company_name" , "Warehouse Name":"warehouse_name"}',
                'lang'      => [
                    'ar' => 'مخزن جديد {warehouse_name} تكوين بواسطة {company_name}',
                    'da' => 'Nyt lager {warehouse_name} oprettet af {company_name}',
                    'de' => 'Neues Lager {warehouse_name} erstellt von {company_name}',
                    'en' => 'New Warehouse {warehouse_name} created by {company_name}',
                    'es' => 'Nuevo almacén {warehouse_name} creado por {company_name}',
                    'fr' => 'Nouvel entrepôt {warehouse_name} Créé par {company_name}',
                    'it' => 'Nuovo Magazzino {warehouse_name} creato da {company_name}',
                    'ja' => '新規ウェアハウス {warehouse_name} 作成者 {company_name}',
                    'nl' => 'Nieuw magazijn {warehouse_name} gemaakt door {company_name}',
                    'pl' => 'Nowy magazyn {warehouse_name} utworzone przez {company_name}',
                    'ru' => 'Новый склад {warehouse_name} кем создано {company_name}',
                    'pt' => 'Novo Armazém {warehouse_name} criado por {company_name}',
                ],
            ],
        ];

        foreach ($modules as $module_name => $actions) {
            foreach ($actions as $action) {
                $ntfy = Notification::where('action', $action)->where('type', 'Twilio')->where('module', $module_name)->count();

                if ($ntfy == 0) {
                    $new         = new Notification();
                    $new->action = $action;
                    $new->status = 'on';
                    $new->module = $module_name;
                    $new->type   = 'Twilio';
                    $new->save();

                    foreach ($defaultTemplate[$action]['lang'] as $lang => $content) {
                        NotificationTemplateLang::create([
                            'parent_id' => $new->id,
                            'lang'      => $lang,
                            'module'    => $new->module,
                            'variables' => $defaultTemplate[$action]['variables'],
                            'content'   => $content,
                        ]);
                    }
                }
            }
        }
    }
}
