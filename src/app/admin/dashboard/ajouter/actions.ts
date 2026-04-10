'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * addVehicleWithUrls - receives text fields + pre-uploaded image URLs from client.
 * Images are uploaded client-side to Supabase Storage to bypass Vercel's 4.5MB body limit.
 * Returns an error string on failure, or null on success.
 */
export async function addVehicleWithUrls(formData: FormData): Promise<string | null> {
    const supabase = await createClient()

    // Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'Non authentifié'

    // Extract text fields
    const make = formData.get('make') as string
    const model = formData.get('model') as string
    const finish = (formData.get('finish') as string) || ''
    const year = parseInt(formData.get('year') as string, 10)
    const mileage = parseInt(formData.get('mileage') as string, 10)
    const price = parseInt(formData.get('price') as string, 10)
    const fuel_type = formData.get('fuel_type') as string
    const transmission = formData.get('transmission') as string
    const description = (formData.get('description') as string) || ''
    const purchasePriceRaw = formData.get('purchase_price') as string
    const purchase_price = purchasePriceRaw ? parseInt(purchasePriceRaw, 10) : null

    // Parse image URLs already uploaded client-side
    let image_urls: string[] = []
    try {
        const raw = formData.get('image_urls_json') as string
        if (raw) image_urls = JSON.parse(raw)
    } catch {
        return 'Format des URLs d\'images invalide.'
    }

    const { error } = await supabase
        .from('vehicles')
        .insert([{ make, model, finish, year, mileage, price, fuel_type, transmission, description, status: 'available', image_urls, purchase_price }])
        .select()

    if (error) {
        console.error('Error inserting vehicle:', error)
        return `Erreur BDD: ${error.message}`
    }

    revalidatePath('/')
    revalidatePath('/admin/dashboard')
    return null
}

export async function updateVehicle(id: string, formData: FormData): Promise<string | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'Non authentifié'

    const make = formData.get('make') as string
    const model = formData.get('model') as string
    const finish = (formData.get('finish') as string) || ''
    const year = parseInt(formData.get('year') as string, 10)
    const mileage = parseInt(formData.get('mileage') as string, 10)
    const price = parseInt(formData.get('price') as string, 10)
    const fuel_type = formData.get('fuel_type') as string
    const transmission = formData.get('transmission') as string
    const description = (formData.get('description') as string) || ''
    const purchasePriceRaw = formData.get('purchase_price') as string
    const purchase_price = purchasePriceRaw ? parseInt(purchasePriceRaw, 10) : null

    let image_urls: string[] = []
    try {
        const raw = formData.get('image_urls_json') as string
        if (raw) image_urls = JSON.parse(raw)
    } catch {
        return 'Format des URLs d\'images invalide.'
    }

    const { error } = await supabase
        .from('vehicles')
        .update({ make, model, finish, year, mileage, price, fuel_type, transmission, description, image_urls, purchase_price })
        .eq('id', id)

    if (error) return `Erreur BDD: ${error.message}`

    revalidatePath('/')
    revalidatePath('/admin/dashboard')
    revalidatePath(`/vehicules/${id}`)
    return null
}

