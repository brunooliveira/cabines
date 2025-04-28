
// Dados dos centros de custo (baseado na imagem IMG_1181.jpeg)
const centrosDeCusto = [
  { nome: 'Manutenção Predial', mediaMensal: 500.00 },
  { nome: 'Administrativa', mediaMensal: 5.00 },
  { nome: 'Patrimônio', mediaMensal: 200.00 },
  { nome: 'Instalação', mediaMensal: 500.00 },
  { nome: 'Locação', mediaMensal: 3000.00 },
  { nome: 'Contabilidade', mediaMensal: 380.00 },
  { nome: 'Recarga Celular', mediaMensal: 0.00 },
  { nome: 'Energia', mediaMensal: 1400.00 },
  { nome: 'Internet', mediaMensal: 139.00 },
  { nome: 'Tarifa Banco', mediaMensal: 0.00 },
  { nome: 'Marketing', mediaMensal: 40.00 },
  { nome: 'Depreciação', mediaMensal: 1000.00 },
  { nome: 'Material de Limpeza', mediaMensal: 200.00 },
  { nome: 'Água', mediaMensal: 210.00 },
  { nome: 'Impostos', mediaMensal: 500.00 },
  { nome: 'Copa', mediaMensal: 220.00 },
]

// Calcular previsão de custo retido (exemplo simples: potencial máximo)
const calcularPrevisaoCustoRetido = () => {
  // Assumindo 34 cabines, 4 turnos por dia, 30 dias no mês
  // E usando o custo retido médio por turno/plano (simplificação)
  // Custo retido médio mensal por cabine (4 turnos) = 280 (mensal) / 1 = 280
  // Custo retido médio trimestral por cabine (4 turnos) = 840 / 3 = 280
  // Custo retido médio semestral por cabine (4 turnos) = 1680 / 6 = 280
  // Custo retido médio por cabine/mês = R$ 280
  const potencialMaximo = 34 * 280 // 34 cabines * custo retido médio mensal (4 turnos)
  return potencialMaximo
}

export default function AdminPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [senha, setSenha] = useState(")
  
  // Estatísticas
  const [totalReservas, setTotalReservas] = useState(0)
  const [totalValor, setTotalValor] = useState(0)
  const [totalCustoRetido, setTotalCustoRetido] = useState(0)
  const [totalLucro, setTotalLucro] = useState(0)
  const [previsaoCustoRetido, setPrevisaoCustoRetido] = useState(0)
  
  const handleLogin = () => {
    // Senha simples para demonstração - em produção, usar autenticação adequada
    if (senha === 'admin123') {
      setIsAuthenticated(true)
      fetchReservas()
      setPrevisaoCustoRetido(calcularPrevisaoCustoRetido())
    } else {
      setError('Senha incorreta')
    }
  }
  
  const fetchReservas = async () => {
    try {
      setLoading(true)
      
      // Em um ambiente real, isso seria uma chamada de API
      // Aqui estamos simulando com dados mockados
      const response = await fetch('/api/admin/reservas')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar reservas')
      }
      
      setReservas(data.reservas)
      
      // Calcular estatísticas
      const total = data.reservas.length
      const valorTotal = data.reservas.reduce((acc: number, r: Reserva) => acc + r.valor_total, 0)
      const custoRetidoTotal = data.reservas.reduce((acc: number, r: Reserva) => acc + r.custo_retido_total, 0)
      const lucroTotal = data.reservas.reduce((acc: number, r: Reserva) => acc + r.lucro, 0)
      
      setTotalReservas(total)
      setTotalValor(valorTotal)
      setTotalCustoRetido(custoRetidoTotal)
      setTotalLucro(lucroTotal)
      
    } catch (err: any) {
      console.error('Erro ao buscar reservas:', err)
      setError(err.message || 'Ocorreu um erro ao buscar as reservas')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Área Administrativa</h1>
        
        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">Senha de Acesso</label>
          <input 
            type="password" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
        >
          Acessar
        </button>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Link 
          href="/"
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para o Site
        </Link>
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Total de Reservas</h3>
          <p className="text-3xl font-bold">{totalReservas}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Valor Total</h3>
          <p className="text-3xl font-bold text-green-500">
            {totalValor.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Custo Retido Total</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {totalCustoRetido.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Lucro Total</h3>
          <p className="text-3xl font-bold text-blue-500">
            {totalLucro.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-400 mb-2">Previsão Custo Retido (Mês)</h3>
          <p className="text-3xl font-bold text-purple-500">
            {previsaoCustoRetido.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </p>
          <p className="text-xs text-gray-500 mt-1">(Potencial máximo)</p>
        </div>
      </div>
      
      {/* Tabela de Reservas */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
        <h2 className="text-xl font-bold p-4 bg-gray-700">Reservas Realizadas</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Aluno</th>
                <th className="px-4 py-3 text-left">Cabine</th>
                <th className="px-4 py-3 text-left">Plano</th>
                <th className="px-4 py-3 text-left">Período</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-right">Custo Retido</th>
                <th className="px-4 py-3 text-right">Lucro</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {reservas.map(reserva => (
                <tr key={reserva.id} className="hover:bg-gray-700">
                  <td className="px-4 py-3">{reserva.id}</td>
                  <td className="px-4 py-3">{reserva.usuario_nome}</td>
                  <td className="px-4 py-3">{reserva.cabine_numero}</td>
                  <td className="px-4 py-3">{reserva.plano_nome}</td>
                  <td className="px-4 py-3">
                    {new Date(reserva.data_inicio).toLocaleDateString('pt-BR')} a {new Date(reserva.data_fim).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right text-green-500">
                    {reserva.valor_total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-500">
                    {reserva.custo_retido_total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-500">
                    {reserva.lucro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      reserva.status === 'confirmada' 
                        ? 'bg-green-900 text-green-300' 
                        : reserva.status === 'pendente'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                    }`}>
                      {reserva.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              
              {reservas.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                    Nenhuma reserva encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Detalhamento de Gastos */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
        <h2 className="text-xl font-bold p-4 bg-gray-700">Detalhamento de Gastos Possíveis (Média Mensal)</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left">Centro de Custo</th>
                <th className="px-4 py-3 text-right">Média Mensal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {centrosDeCusto.map(centro => (
                <tr key={centro.nome} className="hover:bg-gray-700">
                  <td className="px-4 py-3">{centro.nome}</td>
                  <td className="px-4 py-3 text-right">
                    {centro.mediaMensal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-700 font-bold">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-right">
                  {centrosDeCusto.reduce((acc, c) => acc + c.mediaMensal, 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tabela de Preços e Custos Retidos */}
      <div className="bg-gray-800 rounded-lg overflow-hidden mt-8">
        <h2 className="text-xl font-bold p-4 bg-gray-700">Tabela de Preços e Custos Retidos</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left">Plano</th>
                <th className="px-4 py-3 text-left">Turnos</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-right">Custo Retido</th>
                <th className="px-4 py-3 text-right">Lucro</th>
                <th className="px-4 py-3 text-right">Margem (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {/* Plano Mensal */}
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3" rowSpan={4}>Mensal</td>
                <td className="px-4 py-3">1 Turno</td>
                <td className="px-4 py-3 text-right">R$ 200,00</td>
                <td className="px-4 py-3 text-right">R$ 70,00</td>
                <td className="px-4 py-3 text-right">R$ 130,00</td>
                <td className="px-4 py-3 text-right">65%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">2 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 300,00</td>
                <td className="px-4 py-3 text-right">R$ 140,00</td>
                <td className="px-4 py-3 text-right">R$ 160,00</td>
                <td className="px-4 py-3 text-right">53%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">3 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 400,00</td>
                <td className="px-4 py-3 text-right">R$ 210,00</td>
                <td className="px-4 py-3 text-right">R$ 190,00</td>
                <td className="px-4 py-3 text-right">48%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">4 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 450,00</td>
                <td className="px-4 py-3 text-right">R$ 280,00</td>
                <td className="px-4 py-3 text-right">R$ 170,00</td>
                <td className="px-4 py-3 text-right">38%</td>
              </tr>
              
              {/* Plano Trimestral */}
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3" rowSpan={4}>Trimestral</td>
                <td className="px-4 py-3">1 Turno</td>
                <td className="px-4 py-3 text-right">R$ 570,00</td>
                <td className="px-4 py-3 text-right">R$ 210,00</td>
                <td className="px-4 py-3 text-right">R$ 360,00</td>
                <td className="px-4 py-3 text-right">63%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">2 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 870,00</td>
                <td className="px-4 py-3 text-right">R$ 420,00</td>
                <td className="px-4 py-3 text-right">R$ 450,00</td>
                <td className="px-4 py-3 text-right">52%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">3 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 1.170,00</td>
                <td className="px-4 py-3 text-right">R$ 630,00</td>
                <td className="px-4 py-3 text-right">R$ 540,00</td>
                <td className="px-4 py-3 text-right">46%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">4 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 1.320,00</td>
                <td className="px-4 py-3 text-right">R$ 840,00</td>
                <td className="px-4 py-3 text-right">R$ 480,00</td>
                <td className="px-4 py-3 text-right">36%</td>
              </tr>
              
              {/* Plano Semestral */}
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3" rowSpan={4}>Semestral</td>
                <td className="px-4 py-3">1 Turno</td>
                <td className="px-4 py-3 text-right">R$ 1.080,00</td>
                <td className="px-4 py-3 text-right">R$ 420,00</td>
                <td className="px-4 py-3 text-right">R$ 660,00</td>
                <td className="px-4 py-3 text-right">61%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">2 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 1.680,00</td>
                <td className="px-4 py-3 text-right">R$ 840,00</td>
                <td className="px-4 py-3 text-right">R$ 840,00</td>
                <td className="px-4 py-3 text-right">50%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">3 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 2.280,00</td>
                <td className="px-4 py-3 text-right">R$ 1.260,00</td>
                <td className="px-4 py-3 text-right">R$ 1.020,00</td>
                <td className="px-4 py-3 text-right">45%</td>
              </tr>
              <tr className="hover:bg-gray-700">
                <td className="px-4 py-3">4 Turnos</td>
                <td className="px-4 py-3 text-right">R$ 2.580,00</td>
                <td className="px-4 py-3 text-right">R$ 1.680,00</td>
                <td className="px-4 py-3 text-right">R$ 900,00</td>
                <td className="px-4 py-3 text-right">35%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
