import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>
        <div className="flex min-h-screen flex-col items-center justify-center">
        

            {/* Formulaire / contenu */}
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    </div>

    );
}
