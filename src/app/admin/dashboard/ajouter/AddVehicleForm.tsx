'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Loader2, Save, ImagePlus, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { addVehicleWithUrls } from './actions'

interface FilePreview {
    file: File
    localUrl: string
    status: 'pending' | 'uploading' | 'done' | 'error'
    remoteUrl?: string
}

export function AddVehicleForm() {
    const router = useRouter()
    const supabase = createClient()

    const [previews, setPreviews] = useState<FilePreview[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        if (selectedFiles.length === 0) return
        const newPreviews: FilePreview[] = selectedFiles.map(file => ({
            file,
            localUrl: URL.createObjectURL(file),
            status: 'pending' as const,
        }))
        setPreviews(prev => [...prev, ...newPreviews])
        // Reset input value so the same file can be re-selected
        e.target.value = ''
    }

    const removeFile = (index: number) => {
        setPreviews(prev => {
            const updated = [...prev]
            URL.revokeObjectURL(updated[index].localUrl)
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

        // Mark all pending as uploading
        setPreviews(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'uploading' } : p))

        const uploadedUrls: string[] = []

        // Upload images directly from browser to Supabase (bypasses Vercel 4.5MB limit)
        const uploadResults = await Promise.allSettled(
            previews.map(async (preview, idx) => {
                // Skip already uploaded
                if (preview.status === 'done' && preview.remoteUrl) {
                    return preview.remoteUrl
                }
                const file = preview.file
                const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
                const fileName = `img_${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${ext}`

                const { data, error } = await supabase.storage
                    .from('vehicles_images')
                    .upload(fileName, file, { contentType: file.type || 'image/jpeg', upsert: false })

                if (error) {
                    setPreviews(prev => prev.map((p, i) => i === idx ? { ...p, status: 'error' } : p))
                    throw new Error(error.message)
                }

                const { data: urlData } = supabase.storage.from('vehicles_images').getPublicUrl(data.path)
                setPreviews(prev => prev.map((p, i) => i === idx ? { ...p, status: 'done', remoteUrl: urlData.publicUrl } : p))
                return urlData.publicUrl
            })
        )

        let hasError = false
        uploadResults.forEach(result => {
            if (result.status === 'fulfilled') {
                uploadedUrls.push(result.value)
            } else {
                hasError = true
            }
        })

        if (hasError) {
            setSubmitError("Certaines photos n'ont pas pu être envoyées. Retirez-les et réessayez.")
            setIsSubmitting(false)
            return
        }

        // Only text + URLs sent to server (tiny payload)
        formData.set('image_urls_json', JSON.stringify(uploadedUrls))

        try {
            const error = await addVehicleWithUrls(formData)
            if (error) {
                setSubmitError(error)
                setIsSubmitting(false)
            } else {
                router.push('/admin/dashboard')
                router.refresh()
            }
        } catch (err) {
            setSubmitError('Erreur inattendue. Réessayez.')
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Banner */}
            {submitError && (
                <div className="p-5 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-200 flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm">{submitError}</p>
                </div>
            )}

            {/* IMAGE UPLOAD SECTION - Using <label> for iOS Safari compatibility */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
                <p className="text-sm font-black text-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Upload size={18} /> Photos du véhicule
                </p>
                <p className="text-xs text-gray-500 font-medium mb-5">
                    Photos uploadées <strong>directement</strong> depuis votre appareil — pas de limite de taille.
                </p>

                {/* Previews Grid */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
                        {previews.map((p, i) => (
                            <div key={p.localUrl} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                                <img src={p.localUrl} alt="" className="w-full h-full object-cover" />
                                {p.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 size={22} className="text-white animate-spin" />
                                    </div>
                                )}
                                {p.status === 'done' && (
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">✓</div>
                                )}
                                {p.status === 'error' && (
                                    <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center">
                                        <AlertCircle size={22} className="text-white" />
                                    </div>
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

                {/* 
                  KEY FIX: Use <label htmlFor> instead of button.onClick() to trigger file input.
                  iOS Safari blocks programmatic .click() on file inputs — but respects native <label>.
                */}
                <label
                    htmlFor="image-upload-input"
                    className={`w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center gap-2 text-gray-500 hover:border-black hover:text-black transition-all cursor-pointer ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <ImagePlus size={28} />
                    <span className="font-bold text-sm">Appuyer pour ajouter des photos</span>
                </label>
                <input
                    id="image-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="sr-only"
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
                    {/* type="text" inputMode="numeric" is more reliable than type="number" on iOS */}
                    <input name="year" type="text" inputMode="numeric" pattern="[0-9]*" required placeholder="2021" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Kilométrage (km)</label>
                    <input name="mileage" type="text" inputMode="numeric" pattern="[0-9]*" required placeholder="45000" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
                </div>
                <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Prix TTC (€)</label>
                    <input name="price" type="text" inputMode="numeric" pattern="[0-9]*" required placeholder="8500" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white outline-none transition text-black font-medium" />
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

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 font-black rounded-xl shadow-xl transition-all text-xl tracking-widest uppercase mt-4 flex items-center justify-center gap-3 ${isSubmitting
                        ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1 active:translate-y-0'
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={24} className="animate-spin" />
                        {previews.some(p => p.status === 'uploading') ? 'Envoi des photos...' : 'Publication en cours...'}
                    </>
                ) : (
                    <>
                        <Save size={24} />
                        Publier l'annonce
                    </>
                )}
            </button>
        </form>
    )
}
