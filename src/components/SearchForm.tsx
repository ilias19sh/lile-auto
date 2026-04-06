'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

export function SearchForm() {
    const [model, setModel] = useState('')
    const [budget, setBudget] = useState('')
    const [criteria, setCriteria] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [isTriggered, setIsTriggered] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const body = `Bonjour, suite à ma visite sur L'Île Auto (Site Web), je souhaite vous confier ma recherche :\n\n- Nom : ${name}\n- Tél : ${phone}\n- Véhicule : ${model}\n- Budget max : ${budget} €\n- Critères : ${criteria}\n\nMerci de me recontacter !`

        setIsTriggered(true)

        // Try using an anchor tag to click it programmatically, which is sometimes more reliable across browsers
        const link = document.createElement('a');
        link.href = `sms:0621222755?body=${encodeURIComponent(body)}`;
        link.click();

        setTimeout(() => setIsTriggered(false), 5000)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-12 rounded-[2rem] border border-gray-200 shadow-xl max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Marque / Modèle</label>
                    <input type="text" required value={model} onChange={e => setModel(e.target.value)} placeholder="Ex: Clio, 208, Polo..." className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition text-sm sm:text-base" />
                </div>
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Budget maximum (€)</label>
                    <input type="number" required value={budget} onChange={e => setBudget(e.target.value)} placeholder="Ex: 5000" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition text-sm sm:text-base" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Vos critères indispensables</label>
                    <textarea rows={3} value={criteria} onChange={e => setCriteria(e.target.value)} placeholder="Boîte auto, essence, couleur..." className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition text-sm sm:text-base"></textarea>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Prénom et Nom *</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont" className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition text-sm sm:text-base" />
                </div>
                <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Numéro de Téléphone *</label>
                    <div className="relative">
                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="06 12 34 56 78" className="w-full pl-12 pr-4 sm:pr-5 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-emerald-500 hover:border-gray-300 outline-none transition text-sm sm:text-base" />
                    </div>
                </div>
            </div>

            {isTriggered && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium text-center text-sm sm:text-base">
                    Ouverture de votre application SMS en cours... 📱<br />
                    <span className="text-xs opacity-80">(Si vous êtes sur ordinateur, cela dépend de vos paramètres d'appels liés à votre téléphone)</span>
                </div>
            )}

            <button type="submit" className="w-full py-4 sm:py-5 bg-black text-white font-black rounded-xl shadow-lg border border-black hover:bg-slate-800 transition-all active:scale-[0.98] text-lg sm:text-xl tracking-wide uppercase">
                Confier ma recherche
            </button>
        </form>
    )
}
