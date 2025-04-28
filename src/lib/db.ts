// Implementação alternativa do módulo de banco de dados para ambiente de desenvolvimento
// Simula as operações de banco de dados usando dados em memória

// Tipos
export type Cabine = {
  id: number
  numero: number
  descricao: string
  status: string
}

export type Turno = {
  id: number
  nome: string
  hora_inicio: number
  hora_fim: number
}

export type Plano = {
  id: number
  nome: string
  duracao_meses: number
  descricao: string
}

export type Preco = {
  id: number
  quantidade_turnos: number
  plano_id: number
  valor: number
  custo_retido: number // Adicionado custo retido
}

export type Usuario = {
  id: number
  nome: string
  email: string
  telefone?: string
  tipo: string // aluno, gestor
}

export type Reserva = {
  id: number
  usuario_id: number
  cabine_id: number
  plano_id: number
  data_inicio: string
  data_fim: string
  valor_total: number
  custo_retido_total: number // Adicionado custo retido total
  status: string
}

export type TurnoReservado = {
  id: number
  reserva_id: number
  turno_id: number
}

// Dados mockados para desenvolvimento
const cabinesMock: Cabine[] = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  numero: i + 1,
  descricao: `Cabine ${i + 1}`,
  status: Math.random() > 0.3 ? 'disponivel' : 'manutencao'
}))

const turnosMock: Turno[] = [
  { id: 1, nome: 'Manhã', hora_inicio: 6, hora_fim: 10 },
  { id: 2, nome: 'Meio-dia', hora_inicio: 11, hora_fim: 15 },
  { id: 3, nome: 'Tarde', hora_inicio: 15, hora_fim: 19 },
  { id: 4, nome: 'Noite', hora_inicio: 19, hora_fim: 23 }
]

const planosMock: Plano[] = [
  { id: 1, nome: 'Mensal', duracao_meses: 1, descricao: 'Plano com duração de 1 mês' },
  { id: 2, nome: 'Trimestral', duracao_meses: 3, descricao: 'Plano com duração de 3 meses' },
  { id: 3, nome: 'Semestral', duracao_meses: 6, descricao: 'Plano com duração de 6 meses' }
]

const precosMock: Preco[] = [
  // Plano Mensal
  { id: 1, quantidade_turnos: 1, plano_id: 1, valor: 200.00, custo_retido: 70.00 },
  { id: 2, quantidade_turnos: 2, plano_id: 1, valor: 300.00, custo_retido: 140.00 },
  { id: 3, quantidade_turnos: 3, plano_id: 1, valor: 400.00, custo_retido: 210.00 },
  { id: 4, quantidade_turnos: 4, plano_id: 1, valor: 450.00, custo_retido: 280.00 },
  // Plano Trimestral
  { id: 5, quantidade_turnos: 1, plano_id: 2, valor: 570.00, custo_retido: 210.00 },
  { id: 6, quantidade_turnos: 2, plano_id: 2, valor: 870.00, custo_retido: 420.00 },
  { id: 7, quantidade_turnos: 3, plano_id: 2, valor: 1170.00, custo_retido: 630.00 },
  { id: 8, quantidade_turnos: 4, plano_id: 2, valor: 1320.00, custo_retido: 840.00 },
  // Plano Semestral
  { id: 9, quantidade_turnos: 1, plano_id: 3, valor: 1080.00, custo_retido: 420.00 },
  { id: 10, quantidade_turnos: 2, plano_id: 3, valor: 1680.00, custo_retido: 840.00 },
  { id: 11, quantidade_turnos: 3, plano_id: 3, valor: 2280.00, custo_retido: 1260.00 },
  { id: 12, quantidade_turnos: 4, plano_id: 3, valor: 2580.00, custo_retido: 1680.00 }
]

// Dados dinâmicos
let usuariosMock: Usuario[] = []
let reservasMock: Reserva[] = []
let turnosReservadosMock: TurnoReservado[] = []
let nextUsuarioId = 1
let nextReservaId = 1
let nextTurnoReservadoId = 1

// Funções de acesso aos dados
export async function getCabines() {
  return cabinesMock
}

export async function getCabinesDisponiveis(data_inicio: string, data_fim: string, turnos_ids: number[]) {
  // Se não houver turnos selecionados, retornamos todas as cabines disponíveis
  if (!turnos_ids.length) {
    return cabinesMock.filter(cabine => cabine.status === 'disponivel')
  }
  
  // Obtemos as cabines que já estão reservadas no período e turnos especificados
  const cabinesReservadasIds = reservasMock
    .filter(r => 
      r.status === 'confirmada' && 
      new Date(r.data_inicio) <= new Date(data_fim) && 
      new Date(r.data_fim) >= new Date(data_inicio)
    )
    .map(r => {
      // Verificamos se algum dos turnos reservados coincide com os turnos solicitados
      const turnosReservados = turnosReservadosMock
        .filter(tr => tr.reserva_id === r.id)
        .map(tr => tr.turno_id)
      
      return turnos_ids.some(id => turnosReservados.includes(id)) ? r.cabine_id : null
    })
    .filter(Boolean) as number[]
  
  // Filtramos as cabines disponíveis
  return cabinesMock.filter(cabine => 
    cabine.status === 'disponivel' && !cabinesReservadasIds.includes(cabine.id)
  )
}

export async function getTurnos() {
  return turnosMock
}

export async function getPlanos() {
  return planosMock
}

export async function getPrecos() {
  return precosMock
}

export async function getPreco(plano_id: number, quantidade_turnos: number) {
  return precosMock.find(
    p => p.plano_id === plano_id && p.quantidade_turnos === quantidade_turnos
  ) || null
}

export async function criarUsuario(nome: string, email: string, senha: string, telefone?: string) {
  // Verificar se o usuário já existe
  const usuarioExistente = usuariosMock.find(u => u.email === email)
  
  if (usuarioExistente) {
    throw new Error('Usuário com este e-mail já existe')
  }
  
  // Criar novo usuário
  const novoUsuario: Usuario = {
    id: nextUsuarioId++,
    nome,
    email,
    telefone,
    tipo: 'aluno' // Por padrão, cria como aluno
  }
  
  usuariosMock.push(novoUsuario)
  
  return { id: novoUsuario.id }
}

export async function criarReserva(
  usuario_id: number,
  cabine_id: number,
  plano_id: number,
  turnos_ids: number[],
  data_inicio: string,
  data_fim: string,
  valor_total: number
) {
  // Calcular custo retido total
  const precoInfo = await getPreco(plano_id, turnos_ids.length)
  const custo_retido_total = precoInfo ? precoInfo.custo_retido : 0

  // Criar reserva
  const novaReserva: Reserva = {
    id: nextReservaId++,
    usuario_id,
    cabine_id,
    plano_id,
    data_inicio,
    data_fim,
    valor_total,
    custo_retido_total, // Adicionado
    status: 'confirmada'
  }
  
  reservasMock.push(novaReserva)
  
  // Inserir turnos reservados
  for (const turno_id of turnos_ids) {
    const novoTurnoReservado: TurnoReservado = {
      id: nextTurnoReservadoId++,
      reserva_id: novaReserva.id,
      turno_id
    }
    
    turnosReservadosMock.push(novoTurnoReservado)
  }
  
  return { id: novaReserva.id }
}

export async function getReservasPorUsuario(usuario_id: number) {
  return reservasMock
    .filter(r => r.usuario_id === usuario_id)
    .map(r => {
      const cabine = cabinesMock.find(c => c.id === r.cabine_id)
      return {
        ...r,
        cabine_numero: cabine ? cabine.numero : 0
      }
    })
}

export async function getTurnosReservadosPorReserva(reserva_id: number) {
  const turnosIds = turnosReservadosMock
    .filter(tr => tr.reserva_id === reserva_id)
    .map(tr => tr.turno_id)
  
  return turnosMock.filter(t => turnosIds.includes(t.id))
}

// Funções para a área administrativa (exemplo)
export async function getTodasReservas() {
  return reservasMock.map(r => {
    const usuario = usuariosMock.find(u => u.id === r.usuario_id)
    const cabine = cabinesMock.find(c => c.id === r.cabine_id)
    const plano = planosMock.find(p => p.id === r.plano_id)
    return {
      ...r,
      usuario_nome: usuario ? usuario.nome : 'Desconhecido',
      cabine_numero: cabine ? cabine.numero : 0,
      plano_nome: plano ? plano.nome : 'Desconhecido',
      lucro: r.valor_total - r.custo_retido_total
    }
  })
}
