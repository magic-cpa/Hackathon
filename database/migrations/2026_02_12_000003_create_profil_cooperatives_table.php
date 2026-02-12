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
        Schema::create('profil_cooperatives', function (Blueprint $table) {
            $table->foreignId('id_user')->primary()->constrained('users', 'id')->onDelete('cascade');
            $table->string('raison_sociale');
            $table->string('telephone_standard')->nullable();
            $table->string('fax')->nullable();
            $table->string('site_web')->nullable();
            $table->text('lien_google_maps')->nullable();
            $table->string('adresse_ligne');
            $table->string('wilaya');
            $table->string('commune');
            $table->string('rib_code_banque')->nullable();
            $table->string('rib_code_agence')->nullable();
            $table->string('rib_numero_compte')->nullable();
            $table->string('rib_cle')->nullable();
            $table->string('rib_banque')->nullable();
            $table->string('rib_agence')->nullable();
            $table->string('rib_adresse_banque')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_cooperatives');
    }
};
