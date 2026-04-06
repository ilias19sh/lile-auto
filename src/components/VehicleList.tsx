'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Settings, Fuel, Gauge, CarFront, Info, ShieldCheck, X, Phone, HeartHandshake } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type Vehicle = {
    id: string;
    make: string;
    model: string;
    finish: string | null;
    year: number;
    mileage: number;
    price: number;
    fuel_type: string;
    transmission: string;
    description: string | null;
    image_urls: string[] | null;
    status: string;
};

export default function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // Accessible modal body locking
    useEffect(() => {
        if (selectedVehicle) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedVehicle]);

    return (
        <>
            {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((v) => (
                        <article
                            key={v.id}
                            onClick={() => setSelectedVehicle(v)}
                            className="group bg-white border border-gray-200 hover:border-gray-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden flex items-center justify-center text-gray-300">
                                {v.image_urls && v.image_urls.length > 0 ? (
                                    <img src={v.image_urls[0]} alt={`${v.make} ${v.model}`} loading="lazy" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="bg-white rounded-2xl w-full h-full border border-gray-100 flex flex-col items-center justify-center">
                                        <CarFront size={48} className="opacity-10 mb-2 text-black" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300">L'Île Auto</span>
                                    </div>
                                )}
                                {/* Visual badge for low price / great deal perspective */}
                                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    Petit Prix
                                </div>
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                                    {v.year}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow relative">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight">{v.make}</h3>
                                    <p className="text-lg text-slate-500 font-bold">{v.model}</p>
                                </div>

                                <div className="flex items-center gap-2 text-slate-600 text-[10px] sm:text-xs font-bold mb-6 mt-1 flex-wrap uppercase tracking-wider">
                                    <span className="bg-gray-100 px-2.5 py-1.5 rounded-lg text-black">{v.mileage.toLocaleString('fr-FR')} km</span>
                                    <span className="bg-gray-100 px-2.5 py-1.5 rounded-lg text-black">{v.fuel_type}</span>
                                    <span className="bg-gray-100 px-2.5 py-1.5 rounded-lg text-black">{v.transmission}</span>
                                </div>

                                <div className="mt-auto flex items-end justify-between pt-5 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-bold uppercase mb-0.5">Prix TTC</span>
                                        <span className="text-2xl font-black text-black leading-none">{v.price.toLocaleString('fr-FR')} €</span>
                                    </div>
                                    <span className="text-xs font-bold text-black border-b border-black pb-0.5 group-hover:text-gray-500 transition-colors">
                                        Voir détails
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
                    <CarFront size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-bold text-gray-500">Aucun véhicule actuellement.</p>
                </div>
            )}

            {/* Modal / Dialog */}
            <AnimatePresence>
                {selectedVehicle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSelectedVehicle(null)}
                    >
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    <HeartHandshake size={18} className="text-black" /> La qualité au meilleur prix
                                </div>
                                <button
                                    onClick={() => setSelectedVehicle(null)}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors"
                                    aria-label="Fermer les détails"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Scrollable Content */}
                            <div className="overflow-y-auto p-4 sm:p-8 flex-grow">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                                    {/* Image Gallery */}
                                    <div className="space-y-4">
                                        <div className="aspect-[4/3] bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200">
                                            {selectedVehicle.image_urls && selectedVehicle.image_urls.length > 0 ? (
                                                <img src={selectedVehicle.image_urls[0]} alt={`${selectedVehicle.make} ${selectedVehicle.model}`} className="object-cover w-full h-full" />
                                            ) : (
                                                <CarFront size={80} className="text-gray-200" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Complete Specs */}
                                    <div className="flex flex-col relative">
                                        <div className="inline-block bg-black text-white text-xs font-black px-3 py-1.5 rounded-full w-fit mb-5 uppercase tracking-widest shadow-sm">
                                            Dossier Complet
                                        </div>

                                        <h2 className="text-4xl font-black text-black tracking-tight uppercase mb-1">{selectedVehicle.make}</h2>
                                        <h3 className="text-2xl font-bold text-gray-500 mb-3">{selectedVehicle.model}</h3>
                                        {selectedVehicle.finish && <p className="text-lg text-gray-400 mb-8 font-medium">{selectedVehicle.finish}</p>}

                                        <div className="text-5xl font-black text-black mb-8 pb-8 border-b border-gray-100">
                                            {selectedVehicle.price.toLocaleString('fr-FR')} € <span className="text-sm font-medium text-gray-400 align-middle">TTC</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <div className="text-black bg-white p-2 sm:p-3 rounded-xl shadow-sm"><Calendar size={20} /></div>
                                                <div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mb-0.5">Année</div>
                                                    <div className="font-extrabold text-black text-sm sm:text-lg">{selectedVehicle.year}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <div className="text-black bg-white p-2 sm:p-3 rounded-xl shadow-sm"><Gauge size={20} /></div>
                                                <div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mb-0.5">Km</div>
                                                    <div className="font-extrabold text-black text-sm sm:text-lg">{selectedVehicle.mileage.toLocaleString('fr-FR')}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <div className="text-black bg-white p-2 sm:p-3 rounded-xl shadow-sm"><Fuel size={20} /></div>
                                                <div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mb-0.5">Carb.</div>
                                                    <div className="font-extrabold text-black text-sm sm:text-lg">{selectedVehicle.fuel_type}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                <div className="text-black bg-white p-2 sm:p-3 rounded-xl shadow-sm"><Settings size={20} /></div>
                                                <div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-widest mb-0.5">Boîte</div>
                                                    <div className="font-extrabold text-black text-sm sm:text-lg">{selectedVehicle.transmission}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-8 flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                            <ShieldCheck className="text-black shrink-0 mt-0.5" size={20} />
                                            <p className="font-medium text-sm text-gray-600">Garanti sans vice caché. Véhicule scrupuleusement vérifié par nous-même avant la remise des clés.</p>
                                        </div>

                                        {selectedVehicle.description && (
                                            <div className="mb-4">
                                                <h4 className="font-bold text-black flex items-center gap-2 mb-3"><Info size={16} /> Description</h4>
                                                <div className="text-gray-600 text-sm leading-relaxed p-5 bg-gray-50 rounded-2xl border border-gray-100 whitespace-pre-wrap">
                                                    {selectedVehicle.description}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Sticky Footer Action */}
                            <div className="p-4 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                <a href="tel:0621222755" className="flex-1 py-4 bg-black text-center text-white font-black rounded-xl shadow-lg hover:bg-gray-800 transition-all text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Phone size={18} /> Appeler pour ce véhicule
                                </a>
                                <button onClick={() => setSelectedVehicle(null)} className="sm:hidden flex-1 py-4 bg-gray-100 text-center text-black font-black rounded-xl text-sm uppercase tracking-widest">
                                    Fermer
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
