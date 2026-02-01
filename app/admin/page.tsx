'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Agendamento {
    id: string
    nome: string
    telefone: string
    data_evento: string
}

function handleLogout() {
    fetch('/api/logout', { method: 'POST' })
        .finally(() => {
            window.location.href = '/login'
        })
}

export default function Admin() {
    const router = useRouter()

    const [dataFiltro, setDataFiltro] = useState('')
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function buscarAgendamentos() {
        if (!dataFiltro) return

        setLoading(true)
        setError('')

        try {
            const res = await fetch(`/api/agendamentos?data=${dataFiltro}`)
            const data = await res.json()

            if (res.ok) {
                setAgendamentos(data)
            } else {
                setError(data.error || 'Erro ao buscar agendamentos')
                setAgendamentos([])
            }
        } catch {
            setError('Erro ao buscar agendamentos')
            setAgendamentos([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                Painel de Agendamentos
            </h1>

            <div className="flex flex-col md:flex-row gap-4 mb-6 text-gray-900 justify-center">
                <input
                    type="date"
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={dataFiltro}
                    onChange={(e) => setDataFiltro(e.target.value)}
                />
                <button
                    onClick={buscarAgendamentos}
                    className="
    flex items-center gap-2
    bg-green-600 text-white
    px-4 py-2
    rounded-lg
    font-semibold
    shadow-md
    hover:bg-green-700
    hover:shadow-lg
    transition
  "
                >
                    🔍 Buscar
                </button>
                <button
                    onClick={handleLogout}
                    className="
    flex items-center gap-2
    bg-red-600 text-white
    px-4 py-2
    rounded-lg
    font-semibold
    shadow-md
    hover:bg-red-700
    hover:shadow-lg
    transition
  "
                >
                    ⏻ Sair
                </button>
            </div>

            {loading && <p className="text-center text-gray-500">Carregando...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && agendamentos.length > 0 && (
                <div className="overflow-x-auto max-w-5xl mx-auto">
                    <table className="w-full border-collapse rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-gray-900 text-gray-100">
                                <th className="p-4 text-left text-sm uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="p-4 text-left text-sm uppercase tracking-wider">
                                    WhatsApp
                                </th>
                                <th className="p-4 text-left text-sm uppercase tracking-wider">
                                    Data
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-gray-800">
                            {agendamentos.map((a) => (
                                <tr
                                    key={a.id}
                                    title="Duplo clique para editar"
                                    onDoubleClick={() =>
                                        router.push(`/admin/agendamentos/${a.id}`)
                                    }
                                    className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition"
                                >
                                    <td className="p-4 font-medium text-gray-100">
                                        {a.nome}
                                    </td>
                                    <td className="p-4 text-green-400 font-semibold">
                                        {a.telefone}
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        {a.data_evento}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && agendamentos.length === 0 && dataFiltro && !error && (
                <p className="text-center text-gray-500">
                    Nenhum agendamento encontrado para essa data.
                </p>
            )}
        </main>
    )
}