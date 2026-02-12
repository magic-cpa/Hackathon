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
        Schema::create('historique_etat_machines', function (Blueprint $table) {
            $table->id('id_hist');
            $table->foreignId('id_machine')->constrained('machine_agricoles', 'id_machine')->onDelete('cascade');
            $table->string('ancien_etat');
            $table->string('nouvel_etat');
            $table->timestamp('changed_at')->useCurrent();
            $table->foreignId('changed_by_user')->constrained('users', 'id')->onDelete('cascade');
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_etat_machines');
    }
};
