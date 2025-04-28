import { NextRequest, NextResponse } from 'next/server'
import { getPlanos } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const planos = await getPlanos()
    return NextResponse.json({ planos })
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar planos' },
      { status: 500 }
    )
  }
}
