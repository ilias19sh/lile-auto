import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight"><span className="text-emerald-500">L'Île</span> Auto</h3>
                    <p className="text-slate-500 font-medium">
                        L'excellence automobile à Lille. Achat, revente et sourcing sur-mesure de véhicules d'exception.
                    </p>
                    <p className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-sm">
                        <ShieldCheck size={16} /> Professionnel Agrée
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Navigation</h4>
                    <ul className="space-y-4 text-slate-500 font-medium">
                        <li><Link href="/#inventaire" className="hover:text-emerald-500 transition">Notre vitrine</Link></li>
                        <li><Link href="/#recherche" className="hover:text-emerald-500 transition">Recherche sur-mesure</Link></li>
                        <li><Link href="/admin" className="hover:text-emerald-500 transition">Accès Professionnel</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Nous contacter</h4>
                    <ul className="space-y-4 text-slate-500 font-medium whitespace-nowrap">
                        <li>📍 Métropole Lilloise, France</li>
                        <li>📞 06 21 22 27 55</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 text-center font-bold text-slate-400">
                &copy; {new Date().getFullYear()} L'Île Auto. Tous droits réservés.
            </div>
        </footer>
    );
}
