import Link from 'next/link';
import { ArrowLeft, Calendar, Settings, Fuel, Gauge, CarFront, Info, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient()

    const { data: vehicle } = await supabase.from('vehicles').select('*').eq('id', id).single()

    if (!vehicle) {
        notFound()
    }

    return (
        <main className="flex-grow pt-24 px-6 max-w-7xl mx-auto w-full pb-20">
            <Link href="/#inventaire" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition mb-8 bg-white pr-5 py-2.5 pl-3 rounded-full shadow-sm border border-slate-200 w-fit hover:shadow-md">
                <ArrowLeft size={18} /> Retour à l'inventaire
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[4/3] bg-slate-50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm p-4">
                        {vehicle.image_urls && vehicle.image_urls.length > 0 ? (
                            <img src={vehicle.image_urls[0]} alt={`${vehicle.make} ${vehicle.model}`} className="object-cover w-full h-full rounded-2xl" />
                        ) : (
                            <CarFront size={80} className="text-slate-200" />
                        )}
                    </div>
                </div>

                {/* Vehicle Details */}
                <div className="flex flex-col bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm">
                    <div className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full w-fit mb-5 uppercase tracking-wide">
                        Réf: {vehicle.id.split('-')[0]}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase mb-2">{vehicle.make}</h1>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-3">{vehicle.model}</h2>
                    {vehicle.finish && <p className="text-lg text-slate-500 mb-8 font-medium">{vehicle.finish}</p>}

                    <div className="text-4xl sm:text-5xl font-black text-emerald-600 mb-10 pb-10 border-b border-slate-100">
                        {vehicle.price.toLocaleString('fr-FR')} €
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-10">
                        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="text-emerald-600 bg-white p-3 rounded-xl shadow-sm border border-slate-100"><Calendar size={22} /></div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Année</div>
                                <div className="font-extrabold text-slate-900 text-lg">{vehicle.year}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="text-emerald-600 bg-white p-3 rounded-xl shadow-sm border border-slate-100"><Gauge size={22} /></div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Km</div>
                                <div className="font-extrabold text-slate-900 text-lg">{vehicle.mileage.toLocaleString('fr-FR')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="text-emerald-600 bg-white p-3 rounded-xl shadow-sm border border-slate-100"><Fuel size={22} /></div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Carburant</div>
                                <div className="font-extrabold text-slate-900 text-lg">{vehicle.fuel_type}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="text-emerald-600 bg-white p-3 rounded-xl shadow-sm border border-slate-100"><Settings size={22} /></div>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Boîte</div>
                                <div className="font-extrabold text-slate-900 text-lg">{vehicle.transmission}</div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="mb-10 flex items-center gap-3 bg-emerald-50 text-emerald-900 p-4 rounded-xl border border-emerald-100">
                        <ShieldCheck className="text-emerald-600" size={24} />
                        <span className="font-semibold text-sm">Véhicule vérifié avec minutie. Prenez rendez-vous dès aujourd'hui.</span>
                    </div>

                    {vehicle.description && (
                        <div className="mb-10">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4 text-xl"><Info size={20} className="text-emerald-600" /> Description</h3>
                            <div className="text-slate-600 text-base leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                                {vehicle.description}
                            </div>
                        </div>
                    )}

                    {/* Action */}
                    <div className="mt-auto p-8 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-inner">
                        <h3 className="font-extrabold text-slate-900 mb-2 text-xl">Ce véhicule vous intéresse ?</h3>
                        <p className="text-slate-600 mb-8 font-medium">Contactez-nous pour réserver un essai, c'est gratuit.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="tel:0300000000" className="flex-1 py-4 bg-emerald-500 text-center text-white font-black rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all active:translate-y-0 tracking-wide text-lg">
                                NOUS APPELER
                            </a>
                            <Link href="/#recherche" className="flex-1 py-4 bg-white text-slate-900 text-center font-black rounded-xl shadow border border-slate-200 hover:bg-slate-50 hover:-translate-y-1 transition-all active:translate-y-0 tracking-wide text-lg">
                                VOS COORDONNÉES
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
