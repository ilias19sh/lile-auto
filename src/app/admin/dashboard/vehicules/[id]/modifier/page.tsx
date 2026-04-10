import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditVehicleForm } from './EditVehicleForm'

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/admin')

    const { data: vehicle } = await supabase.from('vehicles').select('*').eq('id', id).single()
    if (!vehicle) notFound()

    return (
        <main className="flex flex-col flex-grow bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto w-full">
                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition mb-8 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <ArrowLeft size={16} /> Retour
                </Link>
                <div className="bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-2 uppercase">Modifier</h1>
                    <p className="text-gray-500 font-medium mb-8">{vehicle.make} {vehicle.model} · {vehicle.year}</p>
                    <EditVehicleForm vehicle={vehicle} />
                </div>
            </div>
        </main>
    )
}
