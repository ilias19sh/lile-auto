import { createClient } from '@/lib/supabase/server';
import VehicleList, { Vehicle } from '@/components/VehicleList';
import { ShieldCheck, Crosshair, Phone, Search, Users, Euro } from 'lucide-react';

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient()

  let { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(6)

  const displayVehicles = vehicles || [];

  return (
    <main className="flex-grow flex flex-col bg-white">
      {/* HERO SECTION - True White Mode */}
      <section className="relative px-6 py-24 md:py-28 lg:py-32 flex flex-col items-center justify-center bg-white border-b border-gray-100">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 text-slate-800 font-extrabold text-xs mb-8 uppercase tracking-widest shadow-sm">
            <Users size={16} className="text-emerald-500" /> Auto pas cher à Lille
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-black">
            Des occasions de qualité, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              à petits prix.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-medium">
            À L'Île Auto, nous sélectionnons des véhicules abordables et révisés. Profitez d'une flexibilité unique et d'un accompagnement 100% transparent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <a href="#inventaire" className="px-8 py-4 bg-black text-white font-black rounded-xl hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-3">
              Nos offres du moment
            </a>
            <a href="#recherche" className="px-8 py-4 bg-white text-black font-black rounded-xl border border-gray-200 shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-all hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-2">
              <Crosshair size={20} className="text-emerald-500" /> Recherche Sur Mesure
            </a>
          </div>
        </div>
      </section>

      {/* INVENTORY SECTION */}
      <section id="inventaire" className="py-24 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4 uppercase">En vitrine actuellement</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Une sélection restreinte pour vous garantir la meilleure qualité possible.</p>
          </div>

          <VehicleList vehicles={displayVehicles} />

        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Euro size={24} /></div>
            <div>
              <h3 className="text-lg font-black text-black mb-2 uppercase tracking-wide">Petits Prix</h3>
              <p className="text-slate-600 font-medium">Nous limitons nos marges pour vous offrir les meilleurs prix pour une qualité fiable.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck size={24} /></div>
            <div>
              <h3 className="text-lg font-black text-black mb-2 uppercase tracking-wide">Véhicules Révisés</h3>
              <p className="text-slate-600 font-medium">Chaque voiture est minutieusement vérifiée, avec kilométrage certifié et historique connu.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={24} /></div>
            <div>
              <h3 className="text-lg font-black text-black mb-2 uppercase tracking-wide">Esprit Familial</h3>
              <p className="text-slate-600 font-medium">Une écoute attentive, des processus flexibles et un accompagnement humain sans pression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM REQUEST SECTION */}
      <section id="recherche" className="py-24 bg-gray-50 border-t border-gray-100 scroll-mt-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white shadow-sm border border-gray-200 text-black rounded-2xl mb-6">
              <Search size={32} />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-6 text-black uppercase">Trouvons votre pépite</h2>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Vous avez un petit budget ou un modèle précis en tête ? Remplissez ce formulaire et nous activons notre réseau local pour vous.
            </p>
          </div>

          <form className="bg-white p-8 sm:p-12 rounded-[2rem] border border-gray-200 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Marque / Modèle</label>
                <input type="text" placeholder="Ex: Clio, 208, Polo..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Budget maximum (€)</label>
                <input type="number" placeholder="Ex: 5000" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Vos critères indispensables</label>
                <textarea rows={3} placeholder="Boîte auto, essence, couleur..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition"></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Prénom et Nom</label>
                <input type="text" placeholder="Jean Dupont" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Numéro de Téléphone *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required placeholder="06 12 34 56 78" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition" />
                </div>
              </div>
            </div>

            <button type="button" className="w-full py-5 bg-black text-white font-black rounded-xl shadow-lg border border-black hover:bg-slate-800 transition-all active:scale-[0.98] text-xl tracking-wide uppercase">
              Confier ma recherche
            </button>
          </form>
        </div>
      </section>

    </main>
  );
}
