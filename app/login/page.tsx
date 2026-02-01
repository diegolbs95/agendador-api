'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const router = useRouter()

  async function handleLogin() {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      alert('Login inválido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Login Admin 🔒
        </h1>

        {/* Email */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="
            border border-gray-300
            text-gray-900
            placeholder-gray-400
            p-2 w-full mb-4 rounded-md
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            focus:border-green-500
          "
          placeholder="admin@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {/* Senha */}
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Senha
        </label>
        <input
          type="password"
          className="
            border border-gray-300
            text-gray-900
            placeholder-gray-400
            p-2 w-full mb-6 rounded-md
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            focus:border-green-500
          "
          placeholder="••••••••"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="
            w-full
            bg-green-600
            text-white
            py-2
            rounded-lg
            font-semibold
            shadow-md
            hover:bg-green-700
            hover:shadow-lg
            transition
          "
        >
          Entrar
        </button>
      </div>
    </div>
  )
}