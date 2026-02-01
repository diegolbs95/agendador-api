import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const data = searchParams.get('data')

  if (!data) {
    return NextResponse.json(
      { error: 'Data é obrigatória' },
      { status: 400 }
    )
  }

  const { data: agendamentos, error } = await supabase
    .from('agendamentos')
    .select('id, nome, telefone, data_evento')
    .eq('data_evento', data)
    .order('nome')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(agendamentos)
}