'use client'

import { useState } from 'react'
import { updateVehicleStatus, updateSoldDetails } from './actions'
import { Loader2 } from 'lucide-react'

export function StatusToggle({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus)
    const [showSoldForm, setShowSoldForm] = useState(false)
    const [soldPrice, setSoldPrice] = useState('')
    const [soldAt, setSoldAt] = useState(new Date().toISOString().split('T')[0])
    const [isUpdating, setIsUpdating] = useState(false)

    const statusColors: Record<string, string> = {
        available: 'bg-black text-white',
        reserved: 'bg-amber-100 text-amber-700',
        sold: 'bg-gray-200 text-gray-500',
    }

    async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value
        if (newStatus === 'sold') {
            setShowSoldForm(true)
            return
        }
        setIsUpdating(true)
        setStatus(newStatus)
        await updateVehicleStatus(id, newStatus)
        setIsUpdating(false)
    }

    async function confirmSold() {
        if (!soldPrice) {
            setShowSoldForm(false)
            setIsUpdating(true)
            setStatus('sold')
            await updateVehicleStatus(id, 'sold')
            setIsUpdating(false)
            return
        }
        setIsUpdating(true)
        setShowSoldForm(false)
        setStatus('sold')
        await updateSoldDetails(id, parseInt(soldPrice, 10), soldAt)
        setIsUpdating(false)
    }

    return (
        <div className="relative">
            {isUpdating ? (
                <div className="px-4 py-1.5 rounded-full bg-gray-100 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-gray-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase">...</span>
                </div>
            ) : (
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-widest outline-none border border-transparent appearance-none cursor-pointer text-center transition-colors ${statusColors[status] || 'bg-gray-100 text-gray-500'}`}
                >
                    <option value="available">DISPO</option>
                    <option value="reserved">RÉSERVÉ</option>
                    <option value="sold">VENDU</option>
                </select>
            )}

            {/* Sold detail form overlay */}
            {showSoldForm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowSoldForm(false)}>
                    <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="font-black text-xl text-black uppercase tracking-tight mb-1">Marquer comme Vendu</h3>
                        <p className="text-sm text-gray-500 font-medium mb-6">Saisissez le prix de vente réel pour calculer vos bénéfices.</p>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Prix de vente réel (€)</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={soldPrice}
                                    onChange={e => setSoldPrice(e.target.value)}
                                    placeholder="Ex: 7800"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-black font-bold"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Date de vente</label>
                                <input
                                    type="date"
                                    value={soldAt}
                                    onChange={e => setSoldAt(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none text-black font-bold"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSoldForm(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-black rounded-xl text-sm uppercase tracking-wider hover:bg-gray-200 transition">
                                Annuler
                            </button>
                            <button onClick={confirmSold} className="flex-1 py-3 bg-black text-white font-black rounded-xl text-sm uppercase tracking-wider hover:bg-gray-800 transition">
                                Confirmer
                            </button>
                        </div>
                        <button onClick={confirmSold} className="mt-3 w-full text-xs text-gray-400 hover:text-gray-600 transition underline text-center">
                            Marquer vendu sans prix de vente
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
