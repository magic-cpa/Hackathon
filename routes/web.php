<?php

use App\Http\Controllers\MachineAgricoleCotroller;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReservationPdfController;
use App\Models\Reservation;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
# agricole-machine api
Route::get('/machines', [MachineAgricoleCotroller::class, 'api']);

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();

    if ($user->hasRole('admin')) {
        return Inertia::render('Dashboard/AdminDashboard');
    } elseif ($user->hasRole('cooperative')) {
        $latestReservations = Reservation::with([
            'machine:id_machine,marque,modele,id_cooperative_user',
            'agriculteur:id,name'
        ])
            ->whereHas('machine', function ($q) use ($user) {
                $q->where('id_cooperative_user', $user->id);
            })
            ->orderByDesc('id_reservation')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard/CooperativeDashboard', [
            'latestReservations' => $latestReservations,
        ]);
    } elseif ($user->hasRole('agriculteur')) {
        $myReservations = Reservation::with([
            'machine:id_machine,marque,modele,type_machine',
        ])
            ->where('id_agriculteur_user', $user->id)
            ->orderByDesc('id_reservation')
            ->paginate(10)
            ->withQueryString();
        // dd($myReservations);

        return Inertia::render('Dashboard/AgriculteurDashboard', [
            'myReservations' => $myReservations,
        ]);
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/products', [MachineAgricoleCotroller::class, 'index'])->name('products.index');
    Route::post('/products', [MachineAgricoleCotroller::class, 'store'])->name('products.store');
    Route::get('/products/create', [MachineAgricoleCotroller::class, 'create'])->name('products.create');
    Route::get('/products/{machine}', [MachineAgricoleCotroller::class, 'show'])->name('products.show');

    Route::get('/products-table', [MachineAgricoleCotroller::class, 'table'])->name('products.table');

    Route::get('/products/{product}/edit', [MachineAgricoleCotroller::class, 'edit'])->name('products.edit');

    Route::post('/products/{machine}', [MachineAgricoleCotroller::class, 'update'])->name('products.update');

    Route::delete('/products/{machine}', [MachineAgricoleCotroller::class, 'destroy'])->name('products.destroy');

    // Page cooperative
    Route::get('/cooperative/reservations', [ReservationController::class, 'index'])
        ->name('cooperative.reservations.index');

    // Update status cooperative
    Route::patch('/cooperative/reservations/{reservation}', [ReservationController::class, 'update'])
        ->name('cooperative.reservations.update');

    // Create reservation agriculteur
    Route::post('/reservations', [ReservationController::class, 'store'])
        ->name('reservations.store');

    Route::get('/reservations/{reservation}/bon', [ReservationPdfController::class, 'show'])
        ->name('reservations.bon')
        ->middleware('signed');
});

require __DIR__ . '/auth.php';
