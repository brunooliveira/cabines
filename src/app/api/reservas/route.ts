import { NextRequest, NextResponse } from 'next/server'
import { criarReserva, criarUsuario } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      nome, 
      email, 
      telefone, 
      senha,
      cabine_id, 
      plano_id, 
      turnos_ids, 
      data_inicio, 
      data_fim, 
      valor_total 
    } = body
    
    // Validar dados obrigatórios
    if (!nome || !email || !senha || !cabine_id || !plano_id || !turnos_ids || !data_inicio || !data_fim || !valor_total) {
      return NextResponse.json(
        { error: 'Dados incompletos para realizar a reserva' },
        { status: 400 }
      )
    }
    
    // Criar ou obter usuário
    let usuario_id
    try {
      const usuario = await criarUsuario(nome, email, senha, telefone)
      usuario_id = usuario.id
    } catch (error: any) {
      // Se o usuário já existe, retornar erro específico
      if (error.message.includes('já existe')) {
        return NextResponse.json(
          { error: 'Usuário com este e-mail já existe. Por favor, faça login.' },
          { status: 409 }
        )
      }
      throw error
    }
    
    // Criar reserva
    const reserva = await criarReserva(
      usuario_id,
      cabine_id,
      plano_id,
      turnos_ids,
      data_inicio,
      data_fim,
      valor_total
    )
    
    return NextResponse.json({ 
      success: true, 
      message: 'Reserva realizada com sucesso',
      reserva_id: reserva.id 
    })
  } catch (error) {
    console.error('Erro ao criar reserva:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a reserva' },
      { status: 500 }
    )
  }
}
