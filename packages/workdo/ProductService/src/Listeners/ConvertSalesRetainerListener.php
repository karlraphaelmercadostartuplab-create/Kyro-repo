<?php

namespace Workdo\ProductService\Listeners;


use Workdo\ProductService\Models\WarehouseStock;
use Workdo\Retainer\Events\ConvertSalesRetainer;

class ConvertSalesRetainerListener
{
    public function handle(ConvertSalesRetainer $event): void
    {
       $retainer = $event->retainer;

        foreach ($retainer->items()->get() as $item) {
            $stock = WarehouseStock::where('warehouse_id', $retainer->warehouse_id)
                ->where('product_id', $item->product_id)
                ->first();
            if ($stock) {
            $stock->decrement('quantity', $item->quantity);
            }
        }
    }
}
