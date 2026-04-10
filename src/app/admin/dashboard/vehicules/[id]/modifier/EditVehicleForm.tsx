'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Loader2, Save, ImagePlus, AlertCircle, Lock, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateVehicle } from '../../../ajouter/actions'

interface Vehicle {
    id: string
    make: string
    model: string
    finish: string | null
    year: number
    mileage: number
    price: number
    fuel_type: string
    transmission: string
    description: string | null
    image_urls: string[] | null
    purchase_price: number | null
}

interface FilePreview {
    file?: File
    localUrl: string
    remoteUrl?: string
    status: 'existing' | 'pending' | 'uploading' | 'done' | 'error'
}

export function EditVehicleForm({ vehicle }: { vehicle: Vehicle }) {
    const router = useRouter()
    const supabase = createClient()

    const initialPreviews: FilePreview[] = (vehicle.image_urls || []).map(url => ({
        localUrl: url,
        remoteUrl: url,
        status: 'existing',
    }))

    const [previews, setPreviews] = useState<FilePreview[]>(initialPreviews)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || [])
        if (!selected.length) return
        const newPreviews: FilePreview[] = selected.map(file => ({
            file,
            localUrl: URL.createObjectURL(file),
            status: 'pending',
        }))
        setPreviews(prev => [...prev, ...newPreviews])
        e.target.value = ''
    }

    const removeFile = (index: number) => {
        setPreviews(prev => {
            const updated = [...prev]
            if (updated[index].status === 'pending') URL.revokeObjectURL(updated[index].localUrl)
            updated.splice(index, 1)
            return updated
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        const form = e.currentTarget
        const formData = new FormData(form)

        // Upload new files
        const finalUrls: string[] = []
        const updatedPreviews = [...previews]

        await Promise.allSettled(previews.map(async (preview, idx) => {
            if (preview.status === 'existing' && preview.remoteUrl) {
                finalUrls.push(preview.remoteUrl)
                return
            }
            if (preview.file) {
                updatedPreviews[idx] = { ...updatedPreviews[idx], status: 'uploading' }
                setPreviews([...updatedPreviews])
                const ext = (preview.file.name.split('.').pop() || 'jpg').toLowerCase()
                const fileName = `img_${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${ext}`
                const { data, error } = await supabase.storage
                    .from('vehicles_images')
                    .upload(fileName, preview.file, { contentType: preview.file.type || 'image/jpeg', upsert: false })
                if (error) {
                    updatedPreviews[idx] = { ...updatedPreviews[idx], status: 'error' }
                    setPreviews([...updatedPreviews])
                    throw new Error(error.message)
                }
                const { data: urlData } = supabase.storage.from('vehicles_images').getPublicUrl(data.path)
                updatedPreviews[idx] = { ...updatedPreviews[idx], status: 'done', remoteUrl: urlData.publicUrl }
                setPreviews([...updatedPreviews])
                finalUrls.push(urlData.publicUrl)
            }
        }))

        formData.set('image_urls_json', JSON.stringify(finalUrls))

        try {
            const error = await updateVehicle(vehicle.id, formData)
            if (error) {
                setSubmitError(error)
                setIsSubmitting(false)
            } else {
                router.push('/admin/dashboard')
                router.refresh()
            }
        } catch {
            setSubmitError('Erreur inattendue. Réessayez.')
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {submitError && (
                <div className="p-5 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-200 flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm">{submitError}</p>
                </div>
            )}

            {/* IMAGE MANAGEMENT */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
                <p className="text-sm font-black text-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Upload size={18} /> Photos du véhicule
                </p>
                <p className="text-xs text-gray-500 font-medium mb-5">
                    Cliquez sur ✕ pour retirer une photo existante. Ajoutez-en de nouvelles ci-dessous.
                </p>
                {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
                        {previews.map((p, i) => (
                            <div key={`${p.localUrl}-${i}`} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${p.status === 'existing' ? 'border-emerald-300' : p.status === 'error' ? 'border-red-400' : 'border-gray-200'} bg-gray-100`}>
                                <img src={p.localUrl} alt="" className="w-full h-full object-cover" />
                                {p.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 size={22} className="text-white animate-spin" />
                                    </div>
                                )}
                                {p.status === 'existing' && (
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">✓</div>
                                )}
                                {!isSubmitting && (
                                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 left-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <label
                    htmlFor="edit-image-input"
                    className={`w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center gap-2 text-gray-500 hover:border-black hover:text-black transition-all cursor-pointer ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <ImagePlus size={28} />
                    <span className="font-bold text-sm">Ajouter des photos</span>
                </label>
                <input id="edit-image-input" type="file" multiple accept="image/*" onChange={handleFileChange} disabled={isSubmitting} className="sr-only" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Marque</label>
                    <input name="make" type="text" required defaultValue={vehicle.make} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Modèle</label>
                    <input name="model" type="text" required defaultValue={vehicle.model} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Finition / Série</label>
                    <input name="finish" type="text" defaultValue={vehicle.finish || ''} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Année</label>
                    <input name="year" type="text" inputMode="numeric" required defaultValue={String(vehicle.year)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Kilométrage (km)</label>
                    <input name="mileage" type="text" inputMode="numeric" required defaultValue={String(vehicle.mileage)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Prix affiché TTC (€)</label>
                    <input name="price" type="text" inputMode="numeric" required defaultValue={String(vehicle.price)} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Carburant</label>
                    <select name="fuel_type" defaultValue={vehicle.fuel_type} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium appearance-none">
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybride">Hybride</option>
                        <option value="Électrique">Électrique</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Boîte de vitesse</label>
                    <select name="transmission" defaultValue={vehicle.transmission} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium appearance-none">
                        <option value="Manuelle">Manuelle</option>
                        <option value="Automatique">Automatique</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Description & État</label>
                <textarea name="description" rows={4} defaultValue={vehicle.description || ''} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium"></textarea>
            </div>

            {/* FINANCIAL — Internal */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <Lock size={16} className="text-amber-600" />
                    <p className="text-sm font-black text-amber-800 uppercase tracking-widest">Données internes (non publiques)</p>
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-amber-700 mb-2">Prix d'achat (€)</label>
                    <input
                        name="purchase_price"
                        type="text"
                        inputMode="numeric"
                        defaultValue={vehicle.purchase_price ? String(vehicle.purchase_price) : ''}
                        placeholder="Ex: 5000"
                        className="w-full px-5 py-4 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition text-black font-medium"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 font-black rounded-xl shadow-xl transition-all text-xl tracking-widest uppercase mt-4 flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-400 text-gray-100 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1 active:translate-y-0'
                    }`}
            >
                {isSubmitting ? (
                    <><Loader2 size={24} className="animate-spin" /> Sauvegarde en cours...</>
                ) : (
                    <><Save size={24} /> Sauvegarder les modifications</>
                )}
            </button>
        </form>
    )
}
