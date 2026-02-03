'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import type { DatesSetArg } from '@fullcalendar/core'
import AgendamentoModal from './AgendamentoModal'

type DiaLotado = {
  data: string
  total: number
}

export default function Calendar() {
  const [diasLotados, setDiasLotados] = useState<string[]>([])
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [tituloMes, setTituloMes] = useState('')

  /** 🔄 BUSCA DIAS LOTADOS */
  useEffect(() => {
    fetch('/api/dias-lotados')
      .then(res => res.json())
      .then((data: DiaLotado[]) => {
        const lotados = data
          .filter(d => d.total >= 10)
          .map(d => d.data)

        setDiasLotados(lotados)
      })
  }, [])

  function formatarData(dataISO: string): string {
    const [ano, mes, dia] = dataISO.split('-')
    return `${dia}-${mes}-${ano}`
  }

  /** 📅 CLICK NO DIA */
  function handleDateClick(info: DateClickArg) {
    const hoje = new Date().toISOString().split('T')[0]

    if (info.dateStr < hoje) {
      alert('Não é possível agendar datas passadas.')
      return
    }

    if (diasLotados.includes(info.dateStr)) {
      alert('Essa data já está com a agenda cheia 😔')
      return
    }

    if (info.date.getDay() === 0) {
      alert('Não realizamos agendamentos aos domingos 🙂')
      return
    }


    setDataSelecionada(info.dateStr)
    setMostrarModal(true)
  }

  /** ✅ CONFIRMA AGENDAMENTO */
  async function confirmarAgendamento(nome: string, telefone: string) {
    if (!dataSelecionada) return

    const res = await fetch('/api/agendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        telefone,
        data_evento: dataSelecionada,
      }),
    })

    if (res.ok) {
      const mensagem = encodeURIComponent(
        `Olá! Gostaria de confirmar meu topo de bolo para o dia ${formatarData(dataSelecionada)} \nNome: ${nome}`
      )

      window.open(
        `https://wa.me/5581998739155?text=${mensagem}`,
        '_blank'
      )

      setMostrarModal(false)
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  return (
    <div className="max-w-4xl w-full mx-auto bg-white p-6 rounded-2xl shadow-xl text-gray-900">
      <h2 className="text-2xl font-bold text-center mb-4">
        {tituloMes}
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev',
          center: '',
          right: 'next',
        }}

        /** 🗓️ MÊS CORRETO */
        datesSet={(arg: DatesSetArg) => {
          const texto = new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            year: 'numeric',
          }).format(arg.view.currentStart)

          setTituloMes(texto.charAt(0).toUpperCase() + texto.slice(1))
        }}

        /** 🔴 DIAS LOTADOS / PASSADOS */
        dayCellClassNames={(arg: { date: Date }): string[] => {
          const dataStr = arg.date.toISOString().split('T')[0]
          const hoje = new Date().toISOString().split('T')[0]
          const diaSemana = arg.date.getDay() // 0 = Domingo

          /** 🚫 DOMINGOS */
          if (diaSemana === 0) {
            return [
              'bg-yellow-200',
              'text-gray-600',
              'font-semibold',
              'opacity-70',
              'cursor-not-allowed',
              'pointer-events-none',
              'rounded',
            ]
          }

          /** 🔴 DIAS LOTADOS */
          if (diasLotados.includes(dataStr)) {
            return [
              'bg-red-400',
              'text-white',
              'font-bold',
              'cursor-not-allowed',
              'pointer-events-none',
              'rounded',
            ]
          }

          /** ⏳ DIAS PASSADOS */
          if (dataStr < hoje) {
            return [
              'bg-gray-300',
              'text-gray-700',
              'opacity-60',
              'pointer-events-none',
              'rounded',
            ]
          }

          /** ✅ DISPONÍVEIS */
          return ['cursor-pointer', 'rounded']
        }}
      />

      {mostrarModal && dataSelecionada && (
        <AgendamentoModal
          data={dataSelecionada}
          onClose={() => setMostrarModal(false)}
          onConfirm={confirmarAgendamento}
        />
      )}
    </div>
  )
}