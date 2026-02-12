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
        Schema::create('plage_calendriers', function (Blueprint $table) {
            $table->id('id_plage');
            $table->foreignId('id_machine')->constrained('machine_agricoles', 'id_machine')->onDelete('cascade');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('etat_plage');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plage_calendriers');
    }
};
