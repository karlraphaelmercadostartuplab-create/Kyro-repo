<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChMessage extends Model
{
    protected $fillable = ['from_id', 'to_id', 'body', 'attachment', 'seen', 'deleted_by_sender', 'deleted_by_receiver'];

    protected $casts = [
        'from_id' => 'integer',
        'to_id' => 'integer',
        'seen' => 'boolean',
        'deleted_by_sender' => 'boolean',
        'deleted_by_receiver' => 'boolean',
    ];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_id');
    }
}
