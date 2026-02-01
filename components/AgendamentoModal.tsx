'use client'

import { useState } from 'react'

interface AgendamentoModalProps {
  data: string
  onClose: () => void
  onConfirm: (nome: string, telefone: string) => void
}

export default function AgendamentoModal({ data, onClose, onConfirm }: AgendamentoModalProps) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')

  function formatarData(dataISO: string): string {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}-${mes}-${ano}`
  }

  function handleConfirm() {
    if (!nome.trim()) {
      alert('Por favor, insira seu nome.')
      return
    }
    const telefoneLimpo = telefone.replace(/\D/g, '')
    if (!/^\d{9,11}$/.test(telefoneLimpo)) {
      alert('Por favor, insira um WhatsApp válido (9 ou 11 dígitos).')
      return
    }
    onConfirm(nome, telefoneLimpo)
    setNome('')
    setTelefone('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-5 text-gray-900 text-center">
          Agendamento – {formatarData(data)}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Seu nome"
            className="border border-gray-400 rounded-md p-2
                   text-gray-900 bg-white
                   placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-green-500"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Seu WhatsApp"
            className="border border-gray-400 rounded-md p-2
                   text-gray-900 bg-white
                   placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-green-500"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
