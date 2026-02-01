import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('data_evento')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const contagem: Record<string, number> = {}

  data.forEach(item => {
    const dataStr = item.data_evento
    contagem[dataStr] = (contagem[dataStr] || 0) + 1
  })

  const resultado = Object.entries(contagem).map(([data, total]) => ({
    data,
    total
  }))

  return NextResponse.json(resultado)
}