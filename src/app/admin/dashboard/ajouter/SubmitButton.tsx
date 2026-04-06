'use client'

import { useFormStatus } from 'react-dom'
import { Save, Loader2 } from 'lucide-react'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-5 font-black rounded-xl shadow-xl transition-all text-xl tracking-widest uppercase mt-4 flex items-center justify-center gap-3 ${pending
                    ? 'bg-gray-400 text-gray-100 cursor-not-allowed border border-gray-400'
                    : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1 active:translate-y-0'
                }`}
        >
            {pending ? (
                <>
                    <Loader2 size={24} className="animate-spin" />
                    Publication en cours...
                </>
            ) : (
                <>
                    <Save size={24} />
                    Publier l'annonce
                </>
            )}
        </button>
    )
}
