'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteVehicle(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase.from('vehicles').delete().eq('id', id)

    if (error) {
        console.error('Failed to delete', error)
        throw new Error('Deletion failed')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/vehicules')
    revalidatePath('/')
}

export async function updateVehicleStatus(id: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { error } = await supabase.from('vehicles').update({ status }).eq('id', id)

    if (error) {
        console.error('Failed to update status', error)
        throw new Error('Update failed')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/vehicules')
    revalidatePath('/')
}

export async function updateSoldDetails(id: string, soldPrice: number, soldAt: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('vehicles')
        .update({ status: 'sold', sold_price: soldPrice, sold_at: soldAt || new Date().toISOString() })
        .eq('id', id)

    if (error) {
        console.error('Failed to update sold details', error)
        throw new Error('Update failed')
    }

    revalidatePath('/admin/dashboard')
    revalidatePath('/')
}
