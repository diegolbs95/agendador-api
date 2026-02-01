import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { nome, telefone, data_evento } = await request.json()

  // Conta quantos já existem nessa data
  const { count, error: countError } = await supabase
    .from('agendamentos')
    .select('*', { count: 'exact', head: true })
    .eq('data_evento', data_evento)

  if (countError) {
    return NextResponse.json({ error: 'Erro ao verificar disponibilidade' }, { status: 500 })
  }

  if ((count ?? 0) >= 10) {
    return NextResponse.json({ error: 'Data sem vagas disponíveis' }, { status: 400 })
  }

  // Salva o agendamento
  const { error } = await supabase.from('agendamentos').insert({
    nome,
    telefone,
    data_evento
  })

  if (error) {
    return NextResponse.json({ error: 'Erro ao salvar agendamento' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}