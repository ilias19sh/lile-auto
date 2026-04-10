import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CarFront, Pencil } from 'lucide-react'
import { DocumentManager } from './DocumentManager'

export default async function VehicleDossierPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin')

    const { data: vehicle } = await supabase.from('vehicles').select('*').eq('id', id).single()
    if (!vehicle) notFound()

    const { data: docs } = await supabase
        .from('vehicle_documents')
        .select('*')
        .eq('vehicle_id', id)
        .order('uploaded_at', { ascending: false })

    return (
        <main className="flex flex-col flex-grow bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                    <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                        <ArrowLeft size={16} /> Retour
                    </Link>
                    <Link href={`/admin/dashboard/vehicules/${id}/modifier`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition px-4 py-2 rounded-xl shadow-sm">
                        <Pencil size={16} /> Modifier l'annonce
                    </Link>
                </div>

                {/* Vehicle Summary */}
                <div className="bg-white rounded-[2rem] border border-gray-200 p-6 sm:p-8 mb-8 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                        {vehicle.image_urls?.[0] ? (
                            <img src={vehicle.image_urls[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <CarFront size={32} className="text-gray-300" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">{vehicle.make} {vehicle.model}</h1>
                        <p className="text-gray-500 font-medium">{vehicle.year} · {vehicle.mileage?.toLocaleString('fr-FR')} km · {vehicle.price?.toLocaleString('fr-FR')} €</p>
                        <span className={`inline-block mt-2 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${vehicle.status === 'sold' ? 'bg-gray-200 text-gray-500' : vehicle.status === 'reserved' ? 'bg-amber-100 text-amber-700' : 'bg-black text-white'}`}>
                            {vehicle.status === 'sold' ? 'Vendu' : vehicle.status === 'reserved' ? 'Réservé' : 'En vente'}
                        </span>
                        {vehicle.purchase_price && (
                            <span className="inline-block mt-2 ml-2 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                                Achat: {vehicle.purchase_price.toLocaleString('fr-FR')} €
                            </span>
                        )}
                    </div>
                </div>

                {/* Document Manager */}
                <div className="bg-white rounded-[2rem] border border-gray-200 p-6 sm:p-8">
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-6">📁 Dossier du Véhicule</h2>
                    <DocumentManager vehicleId={id} initialDocs={docs || []} />
                </div>
            </div>
        </main>
    )
}
