<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachineAgricoleController;

Route::get('/api/machines', [MachineAgricoleController::class, 'index']);