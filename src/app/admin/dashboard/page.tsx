import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../actions'
import { deleteVehicle } from './actions'
import { Plus, LogOut, CarFront, FolderOpen, Pencil, TrendingUp, Package, Clock, Euro, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import { StatusToggle } from './StatusToggle'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin')

    const { data: vehicles } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
    const v = vehicles || []

    // ---- Stats Computation ----
    const available = v.filter(x => x.status === 'available')
    const reserved = v.filter(x => x.status === 'reserved')
    const sold = v.filter(x => x.status === 'sold')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const soldWithData = sold.filter(x => x.sold_price && x.purchase_price)

    const beneficeTotal = (arr: typeof soldWithData) =>
        arr.reduce((acc, x) => acc + (x.sold_price - x.purchase_price), 0)

    const soldThisMonth = soldWithData.filter(x => x.sold_at && new Date(x.sold_at) >= startOfMonth)
    const soldThisYear = soldWithData.filter(x => x.sold_at && new Date(x.sold_at) >= startOfYear)

    const beneficeMensuel = beneficeTotal(soldThisMonth)
    const beneficeAnnuel = beneficeTotal(soldThisYear)
    const beneficeMoyen = soldWithData.length > 0
        ? Math.round(beneficeTotal(soldWithData) / soldWithData.length)
        : 0

    // Average days to sell (sold_at - created_at)
    const soldWithDates = sold.filter(x => x.sold_at && x.created_at)
    const avgDays = soldWithDates.length > 0
        ? Math.round(
            soldWithDates.reduce((acc, x) => {
                const days = (new Date(x.sold_at).getTime() - new Date(x.created_at).getTime()) / (1000 * 60 * 60 * 24)
                return acc + days
            }, 0) / soldWithDates.length
        )
        : null

    const valeurParc = available.reduce((acc, x) => acc + (x.price || 0), 0)

    const fmt = (n: number) => n.toLocaleString('fr-FR')
    const fmtEuro = (n: number) => `${n > 0 ? '+' : ''}${fmt(n)} €`

    const stats = [
        { label: 'En vente', value: String(available.length), icon: Package, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
        { label: 'Réservés', value: String(reserved.length), icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
        { label: 'Total vendus', value: String(sold.length), icon: BarChart3, color: 'bg-gray-50 text-gray-500', border: 'border-gray-100' },
        { label: 'Bénéfice mensuel', value: beneficeThisMonth(soldThisMonth) > 0 ? fmtEuro(beneficeMensuel) : soldThisMonth.length === 0 ? '—' : fmtEuro(beneficeMensuel), icon: Euro, color: beneficeMensuel >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500', border: beneficeMensuel >= 0 ? 'border-emerald-100' : 'border-red-100' },
        { label: 'Bénéfice annuel', value: soldThisYear.length > 0 ? fmtEuro(beneficeAnnuel) : '—', icon: TrendingUp, color: beneficeAnnuel >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500', border: beneficeAnnuel >= 0 ? 'border-emerald-100' : 'border-red-100' },
        { label: 'Bénéfice moyen / vente', value: soldWithData.length > 0 ? fmtEuro(beneficeMoyen) : '—', icon: Euro, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
        { label: 'Délai moyen de vente', value: avgDays !== null ? `${avgDays} j` : '—', icon: Clock, color: 'bg-slate-50 text-slate-500', border: 'border-slate-100' },
        { label: 'Valeur du parc dispo', value: `${fmt(valeurParc)} €`, icon: Package, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    ]

    return (
        <main className="flex flex-col flex-grow bg-gray-50 pt-20 pb-12">
            {/* Admin Navbar */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="font-black text-xl text-black hover:opacity-70 transition">L'Île<span className="font-light">Auto</span></Link>
                        <span className="font-bold text-xs uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-1 rounded-md">Pro</span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <span className="text-sm font-bold text-gray-400 hidden sm:block truncate max-w-[150px]">{user.email}</span>
                        <form action={logout}>
                            <button type="submit" className="flex items-center gap-2 text-sm font-bold hover:text-black transition uppercase tracking-widest text-gray-500">
                                <LogOut size={16} /> <span className="hidden sm:inline">Quitter</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">Gestion du Parc</h1>
                    <Link href="/admin/dashboard/ajouter" className="inline-flex justify-center items-center gap-2 px-5 py-3.5 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95 uppercase tracking-widest text-sm">
                        <Plus size={20} /> Ajouter
                    </Link>
                </div>

                {/* Stats Grid — 4 cols on large, 2 on mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
                    {stats.map(s => (
                        <div key={s.label} className={`bg-white p-4 sm:p-6 rounded-2xl border ${s.border} shadow-sm`}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`p-2 rounded-lg ${s.color}`}>
                                    <s.icon size={16} />
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest leading-tight">{s.label}</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-black text-black truncate">{s.value}</div>
                        </div>
                    ))}
                </div>

                <h2 className="text-xl font-black text-black mb-5 uppercase tracking-wider">Inventaire</h2>

                {v.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {v.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center relative">
                                    {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
                                        <img src={vehicle.image_urls[0]} alt={`${vehicle.make} ${vehicle.model}`} className="object-cover w-full h-full" />
                                    ) : (
                                        <CarFront size={48} className="text-gray-200" />
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <StatusToggle id={vehicle.id} currentStatus={vehicle.status} />
                                    </div>
                                    {vehicle.purchase_price && (
                                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                                            Achat: {fmt(vehicle.purchase_price)} €
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="mb-3">
                                        <h3 className="text-xl font-black text-black uppercase tracking-tight leading-none mb-1">{vehicle.make}</h3>
                                        <p className="font-bold text-gray-500">{vehicle.model} <span className="font-medium text-sm">({vehicle.year})</span></p>
                                    </div>

                                    {vehicle.status === 'sold' && vehicle.sold_price && vehicle.purchase_price && (
                                        <div className="mb-3 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-700">
                                            Bénéfice : +{fmt(vehicle.sold_price - vehicle.purchase_price)} €
                                            <span className="font-medium text-emerald-500 ml-1">({fmt(vehicle.sold_price)} € vendu)</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                        <div className="font-black text-xl">{fmt(vehicle.price)} €</div>
                                        <div className="flex gap-2">
                                            <Link href={`/vehicules/${vehicle.id}`} title="Voir l'annonce" className="p-2.5 bg-gray-50 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition">
                                                <CarFront size={17} />
                                            </Link>
                                            <Link href={`/admin/dashboard/vehicules/${vehicle.id}/modifier`} title="Modifier" className="p-2.5 bg-gray-50 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition">
                                                <Pencil size={17} />
                                            </Link>
                                            <Link href={`/admin/dashboard/vehicules/${vehicle.id}`} title="Dossier" className="p-2.5 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                                <FolderOpen size={17} />
                                            </Link>
                                            <form action={deleteVehicle.bind(null, vehicle.id)}>
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
                        <CarFront size={32} className="text-gray-300 mb-4" />
                        <p className="font-black text-xl text-black mb-2">Aucun véhicule</p>
                        <p className="text-gray-500 font-medium mb-6 text-sm">Ajoutez votre premier véhicule.</p>
                        <Link href="/admin/dashboard/ajouter" className="px-6 py-3 bg-black text-white font-black rounded-xl hover:bg-gray-800 transition uppercase tracking-widest text-sm">
                            Ajouter maintenant
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}

function beneficeThisMonth(arr: any[]) {
    return arr.reduce((acc: number, x: any) => acc + ((x.sold_price || 0) - (x.purchase_price || 0)), 0)
}
