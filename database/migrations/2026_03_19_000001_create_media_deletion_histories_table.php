<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('media_deletion_histories')) {
            Schema::create('media_deletion_histories', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('media_id')->nullable()->index();
                $table->foreignId('user_id')->nullable()->index();
                $table->foreignId('created_by')->nullable()->index();
                $table->foreignId('directory_id')->nullable()->index();
                $table->string('directory_name')->nullable();
                $table->string('name');
                $table->string('file_name');
                $table->string('mime_type')->nullable();
                $table->string('disk')->nullable();
                $table->unsignedBigInteger('size')->default(0);
                $table->timestamp('deleted_at')->nullable()->index();
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
                $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
                $table->foreign('directory_id')->references('id')->on('media_directories')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_deletion_histories');
    }
};