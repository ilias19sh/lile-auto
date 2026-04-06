'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" onClick={closeMenu} className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                    L'Île<span className="font-light">Auto</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
                    <Link href="/#inventaire" className="hover:text-black transition">Nos Véhicules</Link>
                    <Link href="/#recherche" className="hover:text-black transition">Recherche</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/admin" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition">
                        Espace Pro
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 -mr-2 text-slate-900 hover:bg-gray-50 rounded-lg transition"
                    aria-label="Menu principal"
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col py-6 px-6 gap-6 h-[calc(100vh-64px)] overflow-y-auto">
                    <nav className="flex flex-col gap-6 text-lg font-bold text-slate-900 tracking-wide uppercase">
                        <Link href="/#inventaire" onClick={closeMenu} className="pb-4 border-b border-gray-100 flex items-center justify-between">
                            Nos Véhicules <ArrowRightIcon />
                        </Link>
                        <Link href="/#recherche" onClick={closeMenu} className="pb-4 border-b border-gray-100 flex items-center justify-between">
                            Recherche sur-mesure <ArrowRightIcon />
                        </Link>
                    </nav>

                    <div className="mt-auto pt-6">
                        <Link href="/admin" onClick={closeMenu} className="w-full py-4 bg-slate-100 text-slate-900 text-center font-bold rounded-xl flex items-center justify-center">
                            Accès Professionnel
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

function ArrowRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
