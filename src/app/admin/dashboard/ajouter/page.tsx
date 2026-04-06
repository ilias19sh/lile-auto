import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AddVehicleForm } from './AddVehicleForm'

export default async function AddVehiclePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin')

    return (
        <main className="flex flex-col flex-grow bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto w-full">
                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition mb-8 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <ArrowLeft size={16} /> Retour
                </Link>

                <div className="bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-8 uppercase">Ajouter un véhicule</h1>
                    <AddVehicleForm />
                </div>
            </div>
        </main>
    )
}
