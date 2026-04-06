import { CarFront } from 'lucide-react';
import Link from 'next/link';

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
    return (
        <>
            {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vehicles.map((v) => (
                        <Link
                            href={`/vehicules/${v.id}`}
                            key={v.id}
                            className="group bg-white border border-gray-200 hover:border-emerald-500/50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-2 cursor-pointer block"
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

                            <div className="p-6 sm:p-8 flex flex-col flex-grow relative">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight group-hover:text-emerald-700 transition-colors">{v.make}</h3>
                                    <p className="text-lg text-slate-500 font-bold">{v.model}</p>
                                </div>

                                <div className="flex items-center gap-2 text-slate-600 text-[10px] sm:text-xs font-bold mb-6 mt-1 flex-wrap uppercase tracking-wider">
                                    <span className="bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg text-black">{v.mileage.toLocaleString('fr-FR')} km</span>
                                    <span className="bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg text-black">{v.fuel_type}</span>
                                    <span className="bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg text-black">{v.transmission}</span>
                                </div>

                                <div className="mt-auto flex items-end justify-between pt-5 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-bold uppercase mb-0.5 tracking-wider">Prix TTC</span>
                                        <span className="text-3xl font-black text-slate-900 leading-none">{v.price.toLocaleString('fr-FR')} €</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-2">
                                        Détails
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
                    <CarFront size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-bold text-gray-500">Aucun véhicule actuellement.</p>
                </div>
            )}
        </>
    );
}
