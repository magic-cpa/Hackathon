import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn } from 'lucide-react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import BgImage from '@/assets/bglogin.jpg';
import Logo from '@/assets/giz-logo.svg';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
                style={{ backgroundImage: `url(${BgImage})` }}
            >
                {/* Overlay léger pour contraste */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Card formulaire blanc */}
                <div className="relative z-10 w-full max-w-md p-10 rounded-2xl 
                                bg-white shadow-2xl text-gray-800">

                    {/* Logo société */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src={Logo} 
                            alt="Company Logo" 
                            className="h-16 w-auto object-contain"
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-6">
                        Connexion - GIZ Agriculture
                    </h2>

                    {status && (
                        <div className="text-center text-green-600 mb-4 font-medium">
                            {status}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={submit}>

                        {/* EMAIL */}
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Adresse email"
                                    className="pl-10 w-full rounded-lg border border-gray-300 
                                               focus:ring-2 focus:ring-green-500 
                                               text-gray-700 placeholder-gray-400"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-red-500" />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="Mot de passe"
                                    className="pl-10 w-full rounded-lg border border-gray-300 
                                               focus:ring-2 focus:ring-green-500 
                                               text-gray-700 placeholder-gray-400"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1 text-red-500" />
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span>Se souvenir de moi</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-green-600 hover:text-green-800 transition"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 
                                       py-3 rounded-lg font-semibold
                                       bg-gradient-to-r from-green-500 to-lime-500
                                       hover:scale-105 transition-transform duration-300
                                       shadow-md hover:shadow-green-400/50 text-white"
                        >
                            <LogIn className="w-5 h-5" />
                            Se connecter
                        </button>
                    </form>

                    {/* Lien vers l'inscription */}
                    <div className="mt-6 text-center">
                    <span className="text-gray-500 mr-2">Pas encore de compte ?</span>
                    <Link
                        href="/register"
                        className="text-gray-800 font-semibold hover:text-gray-600 transition"
                    >
                        S'inscrire
                    </Link>
                    </div>


                    <p className="mt-6 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} GIZ Agriculture
                    </p>
                </div>
            </div>
        </>
    );
}
