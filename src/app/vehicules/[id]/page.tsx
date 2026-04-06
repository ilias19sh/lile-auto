import Link from 'next/link';
import { ArrowLeft, Calendar, Settings, Fuel, Gauge, CarFront, Info, ShieldCheck, HeartHandshake } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';

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
                <ImageGallery images={vehicle.image_urls} altText={`${vehicle.make} ${vehicle.model}`} />

                {/* Vehicle Details */}
                <div className="flex flex-col bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-sm relative">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="inline-block bg-black text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
                            Dossier Complet
                        </div>
                        <div className="inline-block bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
                            Réf: {vehicle.id.split('-')[0]}
                        </div>
                        <div className="inline-flex flex-1 justify-end items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:flex">
                            <HeartHandshake size={14} className="text-emerald-500" /> Confiance & Transparence
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase mb-1 sm:mb-2 leading-tight">{vehicle.make}</h1>
                    <h2 className="text-xl sm:text-3xl font-bold text-slate-700 mb-2 sm:mb-3">{vehicle.model}</h2>
                    {vehicle.finish && <p className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 font-medium">{vehicle.finish}</p>}

                    <div className="text-3xl sm:text-5xl font-black text-emerald-600 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-slate-100">
                        {vehicle.price.toLocaleString('fr-FR')} €
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 relative overflow-hidden">
                            <div className="text-emerald-600 bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-slate-100 shrink-0"><Calendar className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                            <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Année</div>
                                <div className="font-extrabold text-slate-900 text-sm sm:text-lg truncate" title={String(vehicle.year)}>{vehicle.year}</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 relative overflow-hidden">
                            <div className="text-emerald-600 bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-slate-100 shrink-0"><Gauge className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                            <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Km</div>
                                <div className="font-extrabold text-slate-900 text-sm sm:text-lg truncate" title={`${vehicle.mileage.toLocaleString('fr-FR')} km`}>{vehicle.mileage.toLocaleString('fr-FR')}</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 relative overflow-hidden">
                            <div className="text-emerald-600 bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-slate-100 shrink-0"><Fuel className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                            <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Carburant</div>
                                <div className="font-extrabold text-slate-900 text-sm sm:text-lg truncate" title={vehicle.fuel_type}>{vehicle.fuel_type}</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 relative overflow-hidden">
                            <div className="text-emerald-600 bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-slate-100 shrink-0"><Settings className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                            <div className="min-w-0">
                                <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Boîte</div>
                                <div className="font-extrabold text-slate-900 text-sm sm:text-lg truncate" title={vehicle.transmission}>{vehicle.transmission}</div>
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
                    <div className="mt-auto p-6 sm:p-8 rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-inner">
                        <h3 className="font-extrabold text-slate-900 mb-2 text-lg sm:text-xl">Ce véhicule vous intéresse ?</h3>
                        <p className="text-slate-600 mb-6 sm:mb-8 font-medium text-sm sm:text-base">Contactez-nous pour l'essayer (gratuit et sans engagement).</p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <a href="tel:0621222755" className="flex-1 py-4 bg-emerald-500 text-center text-white font-black rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all active:translate-y-0 tracking-wide text-sm sm:text-lg">
                                NOUS APPELER
                            </a>
                            <a href={`sms:0621222755?body=${encodeURIComponent("Bonjour, je suis intéressé(e) par le véhicule suivant vu sur L'Île Auto : " + vehicle.make + " " + vehicle.model)}`} className="flex-1 py-4 bg-white text-slate-900 text-center font-black rounded-xl shadow border border-slate-200 hover:bg-slate-50 hover:-translate-y-1 transition-all active:translate-y-0 tracking-wide text-sm sm:text-lg">
                                ENVOYER UN SMS
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
