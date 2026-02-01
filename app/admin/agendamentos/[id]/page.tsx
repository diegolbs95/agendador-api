'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Agendamento {
  id: string
  nome: string
  telefone: string
  data_evento: string
}

export default function EditarAgendamento() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [agendamento, setAgendamento] = useState<Agendamento | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const res = await fetch(`/api/agendamentos/${id}`)
      const data: Agendamento = await res.json()
      setAgendamento(data)
      setLoading(false)
    }

    carregar()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Carregando...</p>
      </main>
    )
  }

  if (!agendamento) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Agendamento não encontrado.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Editar Agendamento
        </h1>

        {mensagem && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-green-100 text-green-800 px-4 py-2 border border-green-300">
            <span className="text-xl">✅</span>
            <span className="font-medium">{mensagem}</span>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <input
            type="text"
            value={agendamento.nome}
            onChange={(e) =>
              setAgendamento({ ...agendamento, nome: e.target.value })
            }
            className="w-full border border-gray-300 rounded p-2
           text-gray-900 bg-white
           focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            value={agendamento.telefone}
            onChange={(e) =>
              setAgendamento({ ...agendamento, telefone: e.target.value })
            }
            className="w-full border border-gray-300 rounded p-2
           text-gray-900 bg-white
           focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="date"
            value={agendamento.data_evento}
            onChange={(e) =>
              setAgendamento({ ...agendamento, data_evento: e.target.value })
            }
            className="w-full border border-gray-300 rounded p-2
           text-gray-900 bg-white
           focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex justify-between pt-4">
            <button
              onClick={async () => {
                await fetch(`/api/agendamentos/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(agendamento),
                })

                setMensagem('Agendamento atualizado com sucesso!')

                setTimeout(() => {
                  router.push('/admin')
                }, 1500)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Salvar
            </button>

            <button
              onClick={async () => {
                if (!confirm('Deseja realmente excluir este agendamento?')) return

                await fetch(`/api/agendamentos/${id}`, {
                  method: 'DELETE',
                })

                setMensagem('Agendamento deletado com sucesso!')

                setTimeout(() => {
                  router.push('/admin')
                }, 1500)
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}