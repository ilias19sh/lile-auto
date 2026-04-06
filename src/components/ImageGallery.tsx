'use client'

import { useState } from 'react'
import { CarFront } from 'lucide-react'

export function ImageGallery({ images, altText }: { images: string[] | null, altText: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] bg-slate-50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm p-4">
                <CarFront size={80} className="text-slate-200" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative flex items-center justify-center">
                <img
                    src={images[currentIndex]}
                    alt={`${altText} - Vue ${currentIndex + 1}`}
                    className="object-cover w-full h-full rounded-[2rem] transition-all duration-300"
                />
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                    {images.map((url, i) => (
                        <button
                            key={url}
                            onClick={() => setCurrentIndex(i)}
                            className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all bg-gray-100 ${i === currentIndex ? 'border-emerald-500 opacity-100 shadow-sm ring-2 ring-emerald-500/20' : 'border-transparent opacity-50 hover:opacity-100'
                                }`}
                        >
                            <img src={url} alt={`Aperçu ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
