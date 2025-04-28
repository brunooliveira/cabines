import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="bg-gray-800 rounded-lg p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Espaço ideal para seus estudos</h1>
          <p className="text-xl text-gray-300 mb-6">
            Reserve sua cabine de estudos de forma rápida e simples, sem intervenção humana.
            Escolha seu turno, plano e comece a estudar hoje mesmo.
          </p>
          <Link 
            href="/reservar" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Reservar Agora
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Image 
            src="/logo.png" 
            alt="Logo Avante Sala de Estudos" 
            width={300} 
            height={300} 
            className="object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Por que escolher a Avante Sala de Estudos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">34 Cabines Disponíveis</h3>
            <p className="text-gray-300">
              Amplo espaço com 34 cabines individuais para garantir seu lugar para estudar.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Flexibilidade de Horários</h3>
            <p className="text-gray-300">
              Escolha entre 4 turnos diferentes: 6-10h, 11-15h, 15-19h e 19-23h.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Planos Personalizados</h3>
            <p className="text-gray-300">
              Opções de planos mensais, trimestrais e semestrais com preços especiais.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Nossos Planos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-2">Plano Mensal</h3>
            <ul className="mb-6 space-y-2">
              <li>1 Turno: <span className="font-bold">R$ 200,00</span></li>
              <li>2 Turnos: <span className="font-bold">R$ 300,00</span></li>
              <li>3 Turnos: <span className="font-bold">R$ 400,00</span></li>
              <li>4 Turnos: <span className="font-bold">R$ 450,00</span></li>
            </ul>
            <Link 
              href="/reservar?plano=mensal" 
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Escolher Plano
            </Link>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-blue-600 transform scale-105">
            <div className="bg-blue-600 text-white text-center py-1 px-4 rounded-full text-sm font-bold mb-4 -mt-9 mx-auto w-fit">
              Mais Popular
            </div>
            <h3 className="text-xl font-bold mb-2">Plano Trimestral</h3>
            <ul className="mb-6 space-y-2">
              <li>1 Turno: <span className="font-bold">R$ 570,00</span></li>
              <li>2 Turnos: <span className="font-bold">R$ 855,00</span></li>
              <li>3 Turnos: <span className="font-bold">R$ 1.140,00</span></li>
              <li>4 Turnos: <span className="font-bold">R$ 1.282,50</span></li>
            </ul>
            <Link 
              href="/reservar?plano=trimestral" 
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Escolher Plano
            </Link>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold mb-2">Plano Semestral</h3>
            <ul className="mb-6 space-y-2">
              <li>1 Turno: <span className="font-bold">R$ 1.080,00</span></li>
              <li>2 Turnos: <span className="font-bold">R$ 1.620,00</span></li>
              <li>3 Turnos: <span className="font-bold">R$ 2.160,00</span></li>
              <li>4 Turnos: <span className="font-bold">R$ 2.430,00</span></li>
            </ul>
            <Link 
              href="/reservar?plano=semestral" 
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Escolher Plano
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Reserve sua cabine agora mesmo e tenha acesso a um ambiente ideal para seus estudos.
        </p>
        <Link 
          href="/reservar" 
          className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors inline-block"
        >
          Reservar Cabine
        </Link>
      </section>
    </div>
  )
}
