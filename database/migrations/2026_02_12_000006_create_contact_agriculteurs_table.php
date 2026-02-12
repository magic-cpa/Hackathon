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
        Schema::create('contact_agriculteurs', function (Blueprint $table) {
            $table->id('id_contact');
            $table->foreignId('id_user')->constrained('users', 'id')->onDelete('cascade');
            $table->string('nom');
            $table->string('prenom');
            $table->string('telephone_fixe')->nullable();
            $table->string('numero_poste')->nullable();
            $table->string('telephone_mobile')->nullable();
            $table->string('fax')->nullable();
            $table->string('email_contact')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_agriculteurs');
    }
};
