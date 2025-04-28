# Sistema de Reservas - Avante Sala de Estudos

Este é o código-fonte do sistema de reservas de cabines de estudo desenvolvido para a Avante Sala de Estudos.

## Visão Geral

O sistema permite que alunos visualizem a disponibilidade de cabines, escolham turnos e planos (mensal, trimestral, semestral), e realizem reservas online. Inclui também uma área administrativa para gestão financeira e acompanhamento das reservas.

## Funcionalidades Principais

- **Página Inicial:** Apresenta a Avante Sala de Estudos, os planos e preços.
- **Página de Reserva:**
    - Visualização das 34 cabines e sua disponibilidade (simulada no ambiente de desenvolvimento).
    - Seleção de 1 a 4 turnos (Manhã, Meio-dia, Tarde, Noite).
    - Escolha do plano (Mensal, Trimestral, Semestral).
    - Cálculo automático do preço.
    - Formulário para dados pessoais e de pagamento (simulado).
    - Confirmação da reserva (simulada no ambiente de desenvolvimento).
- **Área Administrativa (`/admin`):**
    - Acesso protegido por senha (senha de demonstração: `admin123`).
    - Painel com estatísticas: total de reservas, valor total, custo retido total, lucro total, previsão de custo retido.
    - Tabela detalhada com todas as reservas realizadas.
    - Tabela com detalhamento de gastos possíveis por centro de custo (baseado na média mensal fornecida).
    - Tabela de referência com preços, custos retidos, lucro e margem para cada plano/turno.
- **Design Responsivo:** O site se adapta a diferentes tamanhos de tela (desktop, tablet, celular).

## Tecnologias Utilizadas

- **Frontend:** Next.js (React Framework)
- **Estilização:** Tailwind CSS
- **Banco de Dados (Produção):** Cloudflare D1 (requer configuração adicional no `wrangler.toml` e implantação via Cloudflare)
- **Banco de Dados (Desenvolvimento/Teste):** Simulado em memória (`src/lib/db.ts`)

## Como Executar Localmente (Desenvolvimento)

1.  **Instalar Dependências:**
    ```bash
    npm install
    # ou
    pnpm install
    ```
2.  **Iniciar Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    # ou
    pnpm dev
    ```
    O sistema estará acessível em `http://localhost:3000` (ou outra porta, se a 3000 estiver em uso).

## Implantação (Produção)

A implantação via `deploy_apply_deployment` falhou devido a problemas com o template Cloudflare Workers. Opções:

1.  **Hospedagem Estática:**
    - Gerar os arquivos estáticos do site:
      ```bash
      npm run build
      # ou
      pnpm build
      ```
    - Os arquivos estarão na pasta `.next/` ou `out/` (dependendo da configuração).
    - Fazer upload desses arquivos para um serviço de hospedagem web (Hostgator, Locaweb, Vercel, Netlify, etc.).
    - **Observação:** A funcionalidade de banco de dados (reservas, admin) não funcionará completamente em um build estático puro sem um backend separado ou adaptação para serviços como Vercel Serverless Functions.

2.  **Cloudflare Workers (Requer Correção):**
    - A integração com o banco de dados D1 (`src/lib/db.ts`) precisa ser ajustada para usar corretamente o `getCloudflareContext` ou uma alternativa compatível com o ambiente de produção do Cloudflare.
    - O arquivo `wrangler.toml` precisa ser configurado com os detalhes do banco de dados D1 de produção.
    - A implantação pode ser feita usando o comando `wrangler deploy` ou tentando novamente a ferramenta `deploy_apply_deployment` após as correções.

## Arquivos do Projeto

- O código-fonte completo está na pasta `/home/ubuntu/projetos/sistema-reservas-cabines`.

## Próximos Passos Sugeridos

- Implementar um sistema de autenticação seguro para a área administrativa.
- Integrar um gateway de pagamento real (Stripe, PagSeguro, Mercado Pago) para processar os pagamentos das reservas.
- Configurar o envio de e-mails de confirmação de reserva.
- Ajustar a implementação do banco de dados para funcionar corretamente em produção (Cloudflare D1 ou outra solução).
- Configurar a implantação definitiva em um serviço de hospedagem.
