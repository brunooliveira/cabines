import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Avante Sala de Estudos - Reserva de Cabines',
  description: 'Reserve sua cabine de estudos online.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
        <header className="bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Logo Avante Sala de Estudos" width={150} height={50} priority />
          </Link>
          <nav>
            {/* Adicionar links de navegação aqui, ex: Login, Minhas Reservas */}
            <Link href="/reservar" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Reservar Cabine</Link>
            <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-gray-800 text-center py-4 mt-auto">
          <div className="text-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Avante Sala de Estudos. Todos os direitos reservados.</p>
            <p className="text-gray-400 text-sm mt-1">Contato: +55 85 98885-4031 | E-mail: avantesaladeestudos@gmail.com</p>
            <p className="text-gray-400 text-sm mt-1">Endereço: Av. Augusto dos Anjos, 1127 - Sala 19 - Parangaba, Fortaleza - CE, 60720-605</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

