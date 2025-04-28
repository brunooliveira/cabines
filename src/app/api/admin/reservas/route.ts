import { NextRequest, NextResponse } from 'next/server'
import { getTodasReservas } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const reservas = await getTodasReservas()
    return NextResponse.json({ reservas })
  } catch (error) {
    console.error('Erro ao buscar reservas para admin:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar reservas' },
      { status: 500 }
    )
  }
}
