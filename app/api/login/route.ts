import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, senha } = await req.json()

  // 🔐 LOGIN FIXO (simples, depois pode virar banco)
  if (email === 'topfesta@admin.com' && senha === 'topfesta2026') {
    const res = NextResponse.json({ ok: true })

    res.cookies.set('auth', 'logado', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 horas
    })

    return res
  }

  return NextResponse.json(
    { error: 'Credenciais inválidas' },
    { status: 401 }
  )
}