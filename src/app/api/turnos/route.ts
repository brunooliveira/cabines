import { NextRequest, NextResponse } from 'next/server'
import { getTurnos } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const turnos = await getTurnos()
    return NextResponse.json({ turnos })
  } catch (error) {
    console.error('Erro ao buscar turnos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar turnos' },
      { status: 500 }
    )
  }
}
