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
        Schema::create('profil_agriculteurs', function (Blueprint $table) {
            $table->foreignId('id_user')->primary()->constrained('users', 'id')->onDelete('cascade');
            $table->string('identifiant')->unique();
            $table->string('raison_sociale');
            $table->string('telephone_exploitation')->nullable();
            $table->string('fax')->nullable();
            $table->string('site_web')->nullable();
            $table->text('lien_google_maps')->nullable();
            $table->string('adresse_ligne');
            $table->string('wilaya');
            $table->string('commune');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_agriculteurs');
    }
};
