'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDocument(id: string, vehicleId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get url before deleting
    const { data: doc } = await supabase.from('vehicle_documents').select('url').eq('id', id).single()

    await supabase.from('vehicle_documents').delete().eq('id', id)

    // Try to remove from storage (url ending is the filename)
    if (doc?.url) {
        try {
            const urlParts = doc.url.split('/vehicle_documents/')
            if (urlParts[1]) {
                await supabase.storage.from('vehicle_documents').remove([urlParts[1]])
            }
        } catch { /* swallow storage errors */ }
    }

    revalidatePath(`/admin/dashboard/vehicules/${vehicleId}`)
}

export async function addDocument(formData: FormData): Promise<string | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'Non authentifié'

    const vehicleId = formData.get('vehicle_id') as string
    const name = formData.get('name') as string
    const doc_type = formData.get('doc_type') as string
    const url = formData.get('url') as string

    if (!vehicleId || !name || !url) return 'Données manquantes'

    const { error } = await supabase.from('vehicle_documents').insert([{ vehicle_id: vehicleId, name, url, doc_type }])
    if (error) return `Erreur: ${error.message}`

    revalidatePath(`/admin/dashboard/vehicules/${vehicleId}`)
    return null
}
