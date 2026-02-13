<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('machine_agricoles', function (Blueprint $table) {
            $table->string('statut')->default('disponible')
                  ->after('etat');
        });
    }

    public function down(): void
    {
        Schema::table('machine_agricoles', function (Blueprint $table) {
            $table->dropColumn('statut');
        });
    }
};
