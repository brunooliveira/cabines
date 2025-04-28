import { NextRequest, NextResponse } from 'next/server'
import { getPrecos, getPreco } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const plano_id = searchParams.get('plano_id')
    const quantidade_turnos = searchParams.get('quantidade_turnos')
    
    // Se houver parâmetros específicos, retorna apenas o preço solicitado
    if (plano_id && quantidade_turnos) {
      const preco = await getPreco(Number(plano_id), Number(quantidade_turnos))
      return NextResponse.json({ preco })
    }
    
    // Caso contrário, retorna todos os preços
    const precos = await getPrecos()
    return NextResponse.json({ precos })
  } catch (error) {
    console.error('Erro ao buscar preços:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar preços' },
      { status: 500 }
    )
  }
}
