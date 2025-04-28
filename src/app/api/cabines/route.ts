import { NextRequest, NextResponse } from 'next/server'
import { getCabines, getCabinesDisponiveis } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data_inicio = searchParams.get('data_inicio')
    const data_fim = searchParams.get('data_fim')
    const turnos = searchParams.get('turnos')
    
    // Se não houver parâmetros, retorna todas as cabines
    if (!data_inicio || !data_fim || !turnos) {
      const cabines = await getCabines()
      return NextResponse.json({ cabines })
    }
    
    // Converte a string de turnos em array de números
    const turnos_ids = turnos.split(',').map(Number).filter(Boolean)
    
    // Obtém as cabines disponíveis para o período e turnos especificados
    const cabinesDisponiveis = await getCabinesDisponiveis(data_inicio, data_fim, turnos_ids)
    
    return NextResponse.json({ cabines: cabinesDisponiveis })
  } catch (error) {
    console.error('Erro ao buscar cabines:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cabines' },
      { status: 500 }
    )
  }
}
