'use client'

import { useState } from 'react'
import { updateVehicleStatus } from './actions'

export function StatusToggle({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [isUpdating, setIsUpdating] = useState(false)

    async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setIsUpdating(true)
        try {
            await updateVehicleStatus(id, e.target.value)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <select
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-widest outline-none border border-transparent appearance-none cursor-pointer text-center transition-colors ${currentStatus === 'available' ? 'bg-black text-white hover:bg-gray-800' :
                    currentStatus === 'sold' ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' :
                        'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
        >
            <option value="available">DISPO</option>
            <option value="reserved">RÉSERVÉ</option>
            <option value="sold">VENDU</option>
        </select>
    )
}
