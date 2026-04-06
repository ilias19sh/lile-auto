'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return redirect('/admin?error=Veuillez remplir tous les champs')
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/admin?error=Email ou mot de passe incorrect')
    }

    revalidatePath('/', 'layout')
    redirect('/admin/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin')
}
