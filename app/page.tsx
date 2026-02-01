import Calendar from '@/components/Calendar'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
        Agendamento de Topo de Bolo 🎂
      </h1>

      {/* Legenda */}
      <div className="flex gap-4 mb-4 text-gray-900 font-medium">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-green-400 rounded"></div>
          <span className="text-gray-900">Disponível</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-red-400 rounded"></div>
          <span className="text-gray-900">Lotado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <span className="text-gray-700">Passado</span>
        </div>
      </div>
      <Calendar />
    </main>
  )
}