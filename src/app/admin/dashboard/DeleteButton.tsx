'use client'

import { Trash2 } from 'lucide-react'

export function DeleteButton() {
    return (
        <button
            type="submit"
            className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition"
            title="Supprimer (Définitif)"
            onClick={(e) => {
                if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce véhicule ?')) {
                    e.preventDefault()
                }
            }}
        >
            <Trash2 size={18} />
        </button>
    )
}
