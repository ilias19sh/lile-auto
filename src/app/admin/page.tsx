import { login } from './actions'
import { CarFront } from 'lucide-react';

export default async function AdminLogin({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const { error } = await searchParams;

    return (
        <main className="flex flex-col flex-grow items-center justify-center p-6 bg-white pt-24 pb-12">
            <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
                        <CarFront size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-black">Espace Pro</h1>
                    <p className="text-gray-500 text-sm mt-2 font-medium">Connectez-vous pour gérer votre inventaire L'Île Auto.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <form action={login} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                        <input id="email" name="email" type="email" required placeholder="admin@lile-auto.fr" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Mot de passe</label>
                        <input id="password" name="password" type="password" required placeholder="••••••••" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                    </div>

                    <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-xl shadow-lg hover:bg-gray-800 transition-all active:scale-[0.98] text-lg uppercase tracking-wider mt-4">
                        Se connecter
                    </button>
                </form>
            </div>
        </main>
    );
}
