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
        Schema::create('machine_agricoles', function (Blueprint $table) {
            $table->id('id_machine');
            $table->foreignId('id_cooperative_user')->constrained('users', 'id')->onDelete('cascade');
            $table->string('type_machine');
            $table->string('marque');
            $table->string('modele');
            $table->string('numero_serie')->unique();
            $table->string('etat');
            $table->text('caracteristiques')->nullable();
            $table->decimal('tarif_jour', 10, 2)->nullable();
            $table->decimal('tarif_semaine', 10, 2)->nullable();
            $table->decimal('tarif_mois', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('machine_agricoles');
    }
};
