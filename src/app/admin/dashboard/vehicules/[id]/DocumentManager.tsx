'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addDocument, deleteDocument } from './actions'
import { Loader2, Trash2, FileText, Download, AlertCircle, Upload } from 'lucide-react'

const DOC_TYPES = [
    { value: 'carte_grise', label: '🪪 Carte Grise' },
    { value: 'historique', label: '📋 Historique Véhicule' },
    { value: 'controle_technique', label: '🔧 Contrôle Technique' },
    { value: 'facture', label: '🧾 Facture' },
    { value: 'autre', label: '📎 Autre' },
]

interface Doc {
    id: string
    name: string
    url: string
    doc_type: string
    uploaded_at: string
}

export function DocumentManager({ vehicleId, initialDocs }: { vehicleId: string, initialDocs: Doc[] }) {
    const supabase = createClient()
    const [docs, setDocs] = useState<Doc[]>(initialDocs)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [docName, setDocName] = useState('')
    const [docType, setDocType] = useState('carte_grise')
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        setUploadError(null)
        const ext = file.name.split('.').pop() || 'pdf'
        const fileName = `${vehicleId}_${Date.now()}.${ext}`

        const { data, error } = await supabase.storage
            .from('vehicle_documents')
            .upload(fileName, file, { contentType: file.type, upsert: false })

        if (error) {
            setUploadError(`Erreur upload: ${error.message}`)
            setIsUploading(false)
            return
        }

        const { data: urlData } = supabase.storage.from('vehicle_documents').getPublicUrl(data.path)
        const formData = new FormData()
        formData.set('vehicle_id', vehicleId)
        formData.set('name', docName || file.name)
        formData.set('doc_type', docType)
        formData.set('url', urlData.publicUrl)

        const err = await addDocument(formData)
        if (err) {
            setUploadError(err)
        } else {
            // Optimistic local update
            setDocs(prev => [...prev, {
                id: Date.now().toString(),
                name: docName || file.name,
                url: urlData.publicUrl,
                doc_type: docType,
                uploaded_at: new Date().toISOString(),
            }])
            setDocName('')
        }
        setIsUploading(false)
        e.target.value = ''
    }

    const handleDelete = async (doc: Doc) => {
        setDeletingId(doc.id)
        await deleteDocument(doc.id, vehicleId)
        setDocs(prev => prev.filter(d => d.id !== doc.id))
        setDeletingId(null)
    }

    return (
        <div className="space-y-8">
            {/* Upload Form */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                <h3 className="font-black text-black uppercase tracking-widest text-sm mb-5 flex items-center gap-2">
                    <Upload size={16} /> Ajouter un document
                </h3>
                {uploadError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-sm font-bold text-red-600">
                        <AlertCircle size={18} className="shrink-0" /> {uploadError}
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Nom du document</label>
                        <input
                            type="text"
                            value={docName}
                            onChange={e => setDocName(e.target.value)}
                            placeholder="Ex: CT Octobre 2024"
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-black font-medium text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Type</label>
                        <select
                            value={docType}
                            onChange={e => setDocType(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-black font-medium text-sm appearance-none"
                        >
                            {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>
                <label
                    htmlFor="doc-file-input"
                    className={`w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center gap-2 text-gray-500 hover:border-black hover:text-black transition-all cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    {isUploading ? <Loader2 size={24} className="animate-spin" /> : <FileText size={24} />}
                    <span className="font-bold text-sm">{isUploading ? 'Envoi en cours...' : 'Appuyer pour sélectionner un fichier (PDF, image…)'}</span>
                </label>
                <input id="doc-file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFileUpload} disabled={isUploading} className="sr-only" />
            </div>

            {/* Document List */}
            <div>
                <h3 className="font-black text-black uppercase tracking-widest text-sm mb-4">Documents ({docs.length})</h3>
                {docs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
                        <FileText size={36} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium text-sm">Aucun document pour l'instant.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {docs.map(doc => {
                            const typeLabel = DOC_TYPES.find(t => t.value === doc.doc_type)?.label || doc.doc_type
                            return (
                                <div key={doc.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition">
                                    <div className="p-2.5 bg-gray-50 rounded-xl">
                                        <FileText size={20} className="text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-black text-sm truncate">{doc.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{typeLabel} · {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Télécharger">
                                            <Download size={17} />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc)}
                                            disabled={deletingId === doc.id}
                                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                                            title="Supprimer"
                                        >
                                            {deletingId === doc.id ? <Loader2 size={17} className="animate-spin" /> : <Trash2 size={17} />}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
