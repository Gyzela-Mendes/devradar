# 🎯 DevRadar

> Agregador inteligente de vagas de tecnologia com foco em estética profissional, experiência do usuário fluida e tradução de dados em tempo real.

![Badge Vue.js](https://img.shields.io/badge/Vue.js-3.3+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Badge TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Badge Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Badge Pinia](https://img.shields.io/badge/Pinia-State_Management-F7DF1E?style=flat-square&logo=vue.js&logoColor=black)

---

## 🎨 Sobre o Projeto

O **DevRadar** foi desenvolvido para resolver uma dor comum de desenvolvedores em busca de oportunidades: a dispersão de vagas em plataformas internacionais e a falta de padronização nas informações.

A aplicação consome dados de vagas reais de tecnologia, normaliza e traduz os conteúdos para o português, e oferece uma ferramenta integrada de gerenciamento de candidaturas (Kanban) e tendências de mercado em tempo real.

---

## ✨ Principais Funcionalidades

- **Explorador de Vagas Inteligente**: Listagem dinâmica de oportunidades com busca em tempo real por cargo, tecnologia ou empresa.
- **Filtro de Modalidade**: Alternância rápida para visualizar apenas vagas remotas.
- **Normalização e Tradução PT-BR**: Conversão automática de títulos e localizações internacionais para o português corporativo.
- **Radar de Tecnologias (Gráficos)**: Visualização analítica em gráfico de barras horizontais (`Chart.js`) das áreas e tecnologias mais demandadas do momento.
- **Painel Kanban de Candidaturas**: Sistema integrado de acompanhamento de processos seletivos por etapas (Salvo, Aplicado, Entrevista, Proposta, etc.).
- **Design System Exclusivo**: Identidade visual refinada utilizando uma paleta sofisticada em tons de creme (`#FDFBF7`) e terracota (`#C86D51`).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um ecossistema moderno e robusto de desenvolvimento frontend:

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API / `<script setup>`)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Gerenciamento de Estado**: [Pinia](https://pinia.vuejs.org/)
- **Requisições HTTP**: [Axios](https://axios-http.com/)
- **Gráficos**: [Chart.js](https://www.chartjs.org/) & `vue-chartjs`
- **Ícones**: `lucide-vue-next`

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

```bash
# 1. Clone o repositório
git clone [https://github.com/SEU-USUARIO/devradar.git](https://github.com/SEU-USUARIO/devradar.git)

# 2. Acesse a pasta do projeto
cd devradar

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev