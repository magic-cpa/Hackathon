import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
        

            {/* Formulaire / contenu */}
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
