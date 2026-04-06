import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import { addVehicle } from './actions'

export default async function AddVehiclePage(props: { searchParams?: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams;
    const error = searchParams?.error;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin')

    return (
        <main className="flex flex-col flex-grow bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto w-full">
                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition mb-8 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <ArrowLeft size={16} /> Retour
                </Link>

                <div className="bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-8 uppercase">Ajouter un véhicule</h1>

                    {error && (
                        <div className="mb-8 p-6 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-200 shadow-sm flex items-start gap-3">
                            <div>
                                <h3 className="uppercase tracking-widest text-xs opacity-70 mb-1">Détail de l'erreur</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form action={addVehicle} className="space-y-8">

                        {/* IMAGE UPLOAD SECTION (Mobile First) */}
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 mb-10">
                            <label className="block text-sm font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Upload size={18} /> Photos du véhicule
                            </label>
                            <p className="text-xs text-gray-500 font-medium mb-4">Sélectionnez les photos directement depuis votre galerie (iPhone/Android acceptés).</p>
                            <input
                                name="images"
                                type="file"
                                multiple
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-black file:text-white hover:file:bg-gray-800 transition cursor-pointer"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Marque</label>
                                <input name="make" type="text" required placeholder="Ex: Peugeot" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Modèle</label>
                                <input name="model" type="text" required placeholder="Ex: 208" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Finition / Série</label>
                                <input name="finish" type="text" placeholder="Ex: GT Line" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Année</label>
                                <input name="year" type="number" required min="1990" max="2026" placeholder="2021" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Kilométrage (km)</label>
                                <input name="mileage" type="number" required placeholder="45000" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Prix TTC (€)</label>
                                <input name="price" type="number" required placeholder="8500" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Carburant</label>
                                <select name="fuel_type" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium appearance-none cursor-pointer">
                                    <option value="Essence">Essence</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Hybride">Hybride</option>
                                    <option value="Électrique">Électrique</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Boîte de vitesse</label>
                                <select name="transmission" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium appearance-none cursor-pointer">
                                    <option value="Manuelle">Manuelle</option>
                                    <option value="Automatique">Automatique</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Description & État</label>
                            <textarea name="description" rows={5} placeholder="Décrivez l'état parfait du véhicule, les options..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium"></textarea>
                        </div>

                        <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-xl shadow-xl hover:bg-gray-800 hover:-translate-y-1 transition-all active:translate-y-0 text-xl tracking-widest uppercase mt-4 flex items-center justify-center gap-3">
                            <Save size={24} /> Publier l'annonce
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
