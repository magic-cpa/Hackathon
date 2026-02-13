import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Compass } from "lucide-react";
import logo from "@/assets/giz-logo.svg";
import styled from "styled-components";

const GreenButtonWrapper = styled.div`
  .btn-green {
    --btn-bg-1: #22c55e;
    --btn-bg-2: #16a34a;
    --btn-bg-color: white;

    cursor: pointer;
    padding: 0.9em 1.6em;
    min-width: 120px;
    min-height: 44px;
    font-size: 1rem;
    font-weight: 600;
    transition: 0.8s;
    background-size: 280% auto;
    background-image: linear-gradient(
      325deg,
      var(--btn-bg-2) 0%,
      var(--btn-bg-1) 55%,
      var(--btn-bg-2) 90%
    );
    border: none;
    border-radius: 0.6em;
    color: var(--btn-bg-color);
    box-shadow:
      0px 0px 20px rgba(34, 197, 94, 0.5),
      0px 5px 5px -1px rgba(22, 163, 74, 0.25),
      inset 4px 4px 8px rgba(134, 239, 172, 0.5),
      inset -4px -4px 8px rgba(21, 128, 61, 0.35);
  }

  .btn-green:hover {
    background-position: right top;
  }

  .btn-green:focus {
    outline: none;
  }
`;

export default function Navbar({ auth }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-2 py-2 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img src={logo} alt="Logo" className="h-20 w-auto" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">

                    {/* Explorer avec icône */}
                    <Link
                        href="#products">
                        <button
                        type="submit"
                        class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                        >
                        Explore
                        <svg
                            class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                            viewBox="0 0 16 19"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                            class="fill-gray-800 group-hover:fill-gray-800"
                            ></path>
                        </svg>
                        </button>

                    </Link>


                    {auth?.user ? (
                        <Link
                            href={route("dashboard")}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route("login")}
                                className="group relative text-gray-700 font-medium transition duration-300 hover:text-green-600"
                            >
                                Se connecter
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Bouton vert premium */}
                            <GreenButtonWrapper>
                                <Link href={route("register")}>
                                    <button className="btn-green">
                                        S'inscrire
                                    </button>
                                </Link>
                            </GreenButtonWrapper>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-3xl text-gray-700 focus:outline-none"
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white border-t shadow-md">
                    <div className="flex flex-col px-6 py-6 gap-5">

                        <Link
                            href="#products"
                            className="flex items-center gap-2 text-gray-700 font-medium"
                            onClick={() => setOpen(false)}
                        >
                            <Compass size={18} />
                            Explorer
                        </Link>

                        {!auth?.user && (
                            <>
                                <Link
                                    href={route("login")}
                                    onClick={() => setOpen(false)}
                                >
                                    Se connecter
                                </Link>

                                <GreenButtonWrapper>
                                    <Link href={route("register")}>
                                        <button className="btn-green w-full">
                                            S'inscrire
                                        </button>
                                    </Link>
                                </GreenButtonWrapper>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
