import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../actions'
import { deleteVehicle } from './actions'
import { Plus, LogOut, CarFront, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import { StatusToggle } from './StatusToggle'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin')
    }

    const { data: vehicles } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })

    const totalVehicles = vehicles?.length || 0;
    const totalValue = vehicles?.reduce((acc, v) => acc + (v.price || 0), 0) || 0;
    const soldThisMonth = vehicles?.filter(v => v.status === 'sold').length || 0;

    return (
        <main className="flex flex-col flex-grow bg-gray-50 pt-20 pb-12">
            {/* Admin Navbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="font-black text-xl text-black hover:opacity-70 transition">L'Île<span className="font-light">Auto</span></Link>
                        <span className="font-bold text-xs uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-1 rounded-md ml-2">Pro</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-gray-400 hidden sm:block">{user.email}</span>
                        <form action={logout}>
                            <button type="submit" className="flex items-center gap-2 text-sm font-bold hover:text-black transition uppercase tracking-widest text-gray-500">
                                <LogOut size={16} /> <span className="hidden sm:inline">Quitter</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-6">
                    <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">Gestion du Parc</h1>
                    <Link href="/admin/dashboard/ajouter" className="inline-flex justify-center items-center gap-2 px-6 py-4 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95 uppercase tracking-widest text-sm">
                        <Plus size={20} /> Ajouter un véhicule
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Total véhicules</div>
                        <div className="text-4xl sm:text-5xl font-black text-black">{totalVehicles}</div>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Vendus / Gérés</div>
                        <div className="text-4xl sm:text-5xl font-black text-black">{soldThisMonth}</div>
                    </div>
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Valeur du parc</div>
                        <div className="text-4xl sm:text-5xl font-black text-black truncate">{totalValue.toLocaleString('fr-FR')} €</div>
                    </div>
                </div>

                {/* Mobile-First Vehicle Cards */}
                <h2 className="text-xl font-black text-black mb-6 uppercase tracking-wider">Inventaire Actuel</h2>

                {vehicles && vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((v) => (
                            <div key={v.id} className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative">
                                    {v.image_urls && v.image_urls.length > 0 ? (
                                        <img src={v.image_urls[0]} alt={`${v.make} ${v.model}`} className="object-cover w-full h-full" />
                                    ) : (
                                        <CarFront size={48} className="text-gray-200" />
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <StatusToggle id={v.id} currentStatus={v.status} />
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-black text-black uppercase tracking-tight leading-none mb-1">{v.make}</h3>
                                        <p className="font-bold text-gray-500 text-lg">{v.model} <span className="font-medium text-sm">({v.year})</span></p>
                                    </div>

                                    <div className="flex justify-between items-end mt-auto pt-6 border-t border-gray-100">
                                        <div className="font-black text-xl">{v.price.toLocaleString('fr-FR')} €</div>

                                        <div className="flex gap-2">
                                            <Link href={`/vehicules/${v.id}`} className="p-3 bg-gray-50 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition" title="Voir l'annonce">
                                                <CarFront size={18} />
                                            </Link>
                                            <form action={deleteVehicle.bind(null, v.id)}>
                                                <DeleteButton />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-[2rem] border border-gray-200 text-center flex flex-col items-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <CarFront size={32} className="text-gray-400" />
                        </div>
                        <p className="font-black text-2xl text-black mb-2">Aucun véhicule</p>
                        <p className="text-gray-500 font-medium mb-8 max-w-sm">Ajoutez votre première voiture depuis votre iPhone pour enrichir l'inventaire public.</p>
                        <Link href="/admin/dashboard/ajouter" className="px-8 py-4 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition uppercase tracking-widest text-sm shadow-md">
                            Ajouter maintenant
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
