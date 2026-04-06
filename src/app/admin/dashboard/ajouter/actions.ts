'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addVehicle(formData: FormData) {
    const supabase = await createClient()

    // Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    // Extract variables
    const make = formData.get('make') as string
    const model = formData.get('model') as string
    const finish = (formData.get('finish') as string) || ''
    const year = parseInt(formData.get('year') as string, 10)
    const mileage = parseInt(formData.get('mileage') as string, 10)
    const price = parseInt(formData.get('price') as string, 10)
    const fuel_type = formData.get('fuel_type') as string
    const transmission = formData.get('transmission') as string
    const description = (formData.get('description') as string) || ''

    // Handle Images Array 
    const files = formData.getAll('images') as File[];
    const uploadedUrls: string[] = [];

    // Process file uploading synchronously (or via Promise.all) 
    for (const file of files) {
        if (file && file.size > 0 && file.name !== 'undefined') {
            const fileExt = file.name.split('.').pop();
            const fileName = `img_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;

            // Read array buffer server-side to bypass JSON serialization limits and stream directly to Supabase
            const arrayBuffer = await file.arrayBuffer();
            const buffer = new Uint8Array(arrayBuffer);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('vehicles_images')
                .upload(fileName, buffer, {
                    contentType: file.type || 'image/jpeg',
                    upsert: false
                });

            if (uploadError) {
                console.error('Erreur lors de l\'upload de la photo:', uploadError);
                redirect(`/admin/dashboard/ajouter?error=${encodeURIComponent('Erreur Image Supabase: ' + uploadError.message)}`);
            } else if (uploadData?.path) {
                // Fetch public URL to save to DB
                const { data: publicUrlData } = supabase.storage
                    .from('vehicles_images')
                    .getPublicUrl(uploadData.path);

                if (publicUrlData && publicUrlData.publicUrl) {
                    uploadedUrls.push(publicUrlData.publicUrl);
                }
            }
        }
    }

    // Insert into Supabase
    const { data, error } = await supabase
        .from('vehicles')
        .insert([{
            make,
            model,
            finish,
            year,
            mileage,
            price,
            fuel_type,
            transmission,
            description,
            status: 'available',
            image_urls: uploadedUrls
        }])
        .select()

    if (error) {
        console.error('Error inserting vehicle:', error)
        redirect(`/admin/dashboard/ajouter?error=${encodeURIComponent('Erreur BDD: ' + error.message)}`)
    }

    revalidatePath('/')
    redirect('/admin/dashboard')
}
