'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Tipos
type Cabine = {
  id: number
  numero: number
  status: string
}

type Turno = {
  id: number
  nome: string
  hora_inicio: number
  hora_fim: number
}

type Plano = {
  id: number
  nome: string
  duracao_meses: number
}

type Preco = {
  id: number
  quantidade_turnos: number
  plano_id: number
  valor: number
}

export default function ReservarPage() {
  const searchParams = useSearchParams()
  const planoParam = searchParams.get('plano')
  
  // Estados
  const [cabines, setCabines] = useState<Cabine[]>([])
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [precos, setPrecos] = useState<Preco[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Seleções do usuário
  const [cabineSelecionada, setCabineSelecionada] = useState<number | null>(null)
  const [turnosSelecionados, setTurnosSelecionados] = useState<number[]>([])
  const [planoSelecionado, setPlanoSelecionado] = useState<number | null>(null)
  const [dataInicio, setDataInicio] = useState<string>('')
  const [step, setStep] = useState(1)
  
  // Dados do usuário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cpf, setCpf] = useState('')
  
  // Dados de pagamento
  const [numeroCartao, setNumeroCartao] = useState('')
  const [nomeCartao, setNomeCartao] = useState('')
  const [validadeCartao, setValidadeCartao] = useState('')
  const [cvvCartao, setCvvCartao] = useState('')
  
  // Carregamento de dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Carregar cabines
        const cabinesRes = await fetch('/api/cabines')
        const cabinesData = await cabinesRes.json()
        
        // Carregar turnos
        const turnosRes = await fetch('/api/turnos')
        const turnosData = await turnosRes.json()
        
        // Carregar planos
        const planosRes = await fetch('/api/planos')
        const planosData = await planosRes.json()
        
        // Carregar preços
        const precosRes = await fetch('/api/precos')
        const precosData = await precosRes.json()
        
        setCabines(cabinesData.cabines)
        setTurnos(turnosData.turnos)
        setPlanos(planosData.planos)
        setPrecos(precosData.precos)
        
        // Se um plano foi passado como parâmetro, seleciona-o
        if (planoParam) {
          const planoMap: Record<string, number> = {
            'mensal': 1,
            'trimestral': 2,
            'semestral': 3
          }
          if (planoMap[planoParam]) {
            setPlanoSelecionado(planoMap[planoParam])
          }
        }
        
        // Define a data de início como o dia atual
        const hoje = new Date()
        const dataFormatada = hoje.toISOString().split('T')[0]
        setDataInicio(dataFormatada)
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [planoParam])
  
  // Funções auxiliares
  const toggleTurno = (turnoId: number) => {
    if (turnosSelecionados.includes(turnoId)) {
      setTurnosSelecionados(turnosSelecionados.filter(id => id !== turnoId))
    } else {
      setTurnosSelecionados([...turnosSelecionados, turnoId])
    }
  }
  
  const calcularPreco = () => {
    if (!planoSelecionado) return 0
    
    const quantidadeTurnos = turnosSelecionados.length
    if (quantidadeTurnos === 0) return 0
    
    const preco = precos.find(
      p => p.plano_id === planoSelecionado && p.quantidade_turnos === quantidadeTurnos
    )
    
    return preco ? preco.valor : 0
  }
  
  const calcularDataFim = () => {
    if (!dataInicio || !planoSelecionado) return ''
    
    const plano = planos.find(p => p.id === planoSelecionado)
    if (!plano) return ''
    
    const inicio = new Date(dataInicio)
    const fim = new Date(inicio)
    fim.setMonth(inicio.getMonth() + plano.duracao_meses)
    
    return fim.toISOString().split('T')[0]
  }
  
  const avancarStep = () => {
    if (step === 1 && cabineSelecionada) {
      setStep(2)
    } else if (step === 2 && turnosSelecionados.length > 0) {
      setStep(3)
    } else if (step === 3 && planoSelecionado) {
      setStep(4)
    }
  }
  
  const voltarStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  
  const finalizarReserva = async () => {
    try {
      setLoading(true)
      
      // Validar dados
      if (!nome || !email || !telefone || !cpf || !numeroCartao || !nomeCartao || !validadeCartao || !cvvCartao) {
        setError('Por favor, preencha todos os campos obrigatórios.')
        setLoading(false)
        return
      }
      
      // Preparar dados para envio
      const reservaData = {
        nome,
        email,
        telefone,
        senha: cpf.substring(0, 6), // Senha temporária baseada nos primeiros 6 dígitos do CPF
        cabine_id: cabineSelecionada,
        plano_id: planoSelecionado,
        turnos_ids: turnosSelecionados,
        data_inicio: dataInicio,
        data_fim: calcularDataFim(),
        valor_total: calcularPreco()
      }
      
      // Enviar requisição para API
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservaData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar a reserva')
      }
      
      // Redirecionar para página de confirmação ou mostrar mensagem de sucesso
      alert('Reserva realizada com sucesso! Número da reserva: ' + result.reserva_id)
      
      // Redirecionar para página inicial
      window.location.href = '/'
      
    } catch (err: any) {
      console.error('Erro ao finalizar reserva:', err)
      setError(err.message || 'Ocorreu um erro ao processar sua reserva. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading && !cabines.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-900 text-white p-4 rounded-lg mb-8">
        <p>{error}</p>
        <button 
          onClick={() => setError(null)}
          className="mt-2 bg-white text-red-900 px-4 py-2 rounded font-bold"
        >
          Tentar novamente
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Reservar Cabine de Estudos</h1>
      
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-500'}`}>
              1
            </div>
            <span className="mt-2">Cabine</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-500'}`}>
              2
            </div>
            <span className="mt-2">Turnos</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 3 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-500'}`}>
              3
            </div>
            <span className="mt-2">Plano</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 4 ? 'text-blue-500' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${step >= 4 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-500'}`}>
              4
            </div>
            <span className="mt-2">Confirmação</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Seleção de Cabine */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Escolha uma cabine</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {cabines.map(cabine => (
              <button
                key={cabine.id}
                onClick={() => setCabineSelecionada(cabine.id)}
                disabled={cabine.status !== 'disponivel'}
                className={`
                  p-4 rounded-lg text-center font-bold transition-colors
                  ${cabine.status === 'disponivel' 
                    ? cabineSelecionada === cabine.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-900 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {cabine.numero}
                {cabine.status !== 'disponivel' && (
                  <div className="text-xs font-normal mt-1">Ocupada</div>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={avancarStep}
              disabled={!cabineSelecionada}
              className={`
                py-2 px-6 rounded-lg font-bold
                ${cabineSelecionada
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Seleção de Turnos */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Escolha os turnos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {turnos.map(turno => (
              <button
                key={turno.id}
                onClick={() => toggleTurno(turno.id)}
                className={`
                  p-4 rounded-lg text-center transition-colors
                  ${turnosSelecionados.includes(turno.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                  }
                `}
              >
                <div className="font-bold">{turno.nome}</div>
                <div className="text-sm">{turno.hora_inicio}h - {turno.hora_fim}h</div>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={voltarStep}
              className="py-2 px-6 rounded-lg font-bold bg-gray-700 hover:bg-gray-600"
            >
              Voltar
            </button>
            <button
              onClick={avancarStep}
              disabled={turnosSelecionados.length === 0}
              className={`
                py-2 px-6 rounded-lg font-bold
                ${turnosSelecionados.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Seleção de Plano */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Escolha o plano</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {planos.map(plano => (
              <button
                key={plano.id}
                onClick={() => setPlanoSelecionado(plano.id)}
                className={`
                  p-6 rounded-lg text-center transition-colors
                  ${planoSelecionado === plano.id
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                  }
                `}
              >
                <div className="font-bold text-xl mb-2">{plano.nome}</div>
                <div className="text-sm mb-4">{plano.duracao_meses} {plano.duracao_meses === 1 ? 'mês' : 'meses'}</div>
                <div className="font-bold text-2xl">
                  {precos.find(p => p.plano_id === plano.id && p.quantidade_turnos === turnosSelecionados.length)?.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }) || 'N/A'}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={voltarStep}
              className="py-2 px-6 rounded-lg font-bold bg-gray-700 hover:bg-gray-600"
            >
              Voltar
            </button>
            <button
              onClick={avancarStep}
              disabled={!planoSelecionado}
              className={`
                py-2 px-6 rounded-lg font-bold
                ${planoSelecionado
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Confirmação */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Confirme sua reserva</h2>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Detalhes da Reserva</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cabine:</span>
                    <span className="font-bold">Cabine {cabines.find(c => c.id === cabineSelecionada)?.numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Turnos:</span>
                    <span className="font-bold">
                      {turnosSelecionados.map(id => 
                        turnos.find(t => t.id === id)?.nome
                      ).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plano:</span>
                    <span className="font-bold">
                      {planos.find(p => p.id === planoSelecionado)?.nome}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2">Período e Valor</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data de início:</span>
                    <span className="font-bold">
                      {new Date(dataInicio).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Data de término:</span>
                    <span className="font-bold">
                      {calcularDataFim() ? new Date(calcularDataFim()).toLocaleDateString('pt-BR') : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor total:</span>
                    <span className="font-bold text-xl text-blue-400">
                      {calcularPreco().toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome completo</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">CPF</label>
                <input 
                  type="text" 
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Número do cartão</label>
                <input 
                  type="text" 
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome no cartão</label>
                <input 
                  type="text" 
                  value={nomeCartao}
                  onChange={(e) => setNomeCartao(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Validade</label>
                <input 
                  type="text" 
                  value={validadeCartao}
                  onChange={(e) => setValidadeCartao(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">CVV</label>
                <input 
                  type="text" 
                  value={cvvCartao}
                  onChange={(e) => setCvvCartao(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={voltarStep}
              className="py-2 px-6 rounded-lg font-bold bg-gray-700 hover:bg-gray-600"
            >
              Voltar
            </button>
            <button
              onClick={finalizarReserva}
              disabled={loading}
              className={`
                py-3 px-8 rounded-lg font-bold 
                ${loading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {loading ? 'Processando...' : 'Finalizar Reserva'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
