<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useJobsStore } from './stores/useJobsStore';
import JobCard from './components/JobCard.vue';
import MarketChart from './components/MarketChart.vue';
import KanbanBoard from './components/KanbanBoard.vue';
import { Radar, Search, Briefcase, BookmarkCheck, RefreshCw, Filter, Sparkles } from 'lucide-vue-next';

const store = useJobsStore();
const currentTab = ref<'explore' | 'kanban'>('explore');

onMounted(() => {
  if (store.jobs.length === 0) {
    store.loadJobs();
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-[#2C221E] flex flex-col font-sans selection:bg-[#C86D51] selection:text-white">
    <!-- Navbar / Cabeçalho -->
    <header class="border-b border-[#EFECE6] bg-[#FDFBF7]/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
        <div class="flex items-center gap-3.5">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C86D51] text-white shadow-md shadow-[#C86D51]/20">
            <Radar class="h-6 w-6" />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight text-[#2C221E]">Dev<span class="text-[#C86D51]">Radar</span></h1>
            <p class="text-xs font-medium text-[#7A6B63]">Agregador Inteligente de Vagas Tech</p>
          </div>
        </div>

        <!-- Abas de Navegação -->
        <nav class="flex items-center gap-2 rounded-2xl bg-[#F4F0EB] p-1.5 border border-[#EBE5DE] shadow-xs">
          <button
            @click="currentTab = 'explore'"
            class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all"
            :class="currentTab === 'explore' ? 'bg-[#C86D51] text-white shadow-sm' : 'text-[#7A6B63] hover:text-[#2C221E]'"
          >
            <Briefcase class="h-4 w-4" />
            Explorar Vagas
          </button>
          <button
            @click="currentTab = 'kanban'"
            class="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all"
            :class="currentTab === 'kanban' ? 'bg-[#C86D51] text-white shadow-sm' : 'text-[#7A6B63] hover:text-[#2C221E]'"
          >
            <BookmarkCheck class="h-4 w-4" />
            Meu Kanban
            <span v-if="store.savedJobs.length > 0" class="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] text-white font-black">
              {{ store.savedJobs.length }}
            </span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Conteúdo Principal com Container Centralizado -->
    <main class="mx-auto max-w-7xl flex-1 px-6 py-10 sm:px-8 w-full space-y-8">
      <!-- ABA 1: EXPLORAR VAGAS -->
      <template v-if="currentTab === 'explore'">
        <!-- Banner e Gráfico -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 flex flex-col justify-center rounded-3xl bg-gradient-to-br from-[#2C221E] to-[#43342E] p-10 text-[#FDFBF7] shadow-xl">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#EEDCC5] w-fit mb-5 border border-white/10">
              <Sparkles class="h-4 w-4 text-[#C86D51]" />
              Mercado Tech em Tempo Real
            </div>
            <h2 class="text-3xl sm:text-4xl font-black tracking-tight leading-tight">Encontre sua próxima grande oportunidade</h2>
            <p class="mt-3 text-sm sm:text-base text-[#EFECE6]/80 max-w-2xl leading-relaxed">
              Monitore vagas de tecnologia reais, salve em seu painel Kanban personalizado e acompanhe quais tecnologias estão liderando o mercado.
            </p>
          </div>

          <div class="flex flex-col justify-center">
            <MarketChart :labels="store.topTechnologies.labels" :values="store.topTechnologies.values" />
          </div>
        </div>

        <!-- Barra de Busca e Filtros -->
        <div class="flex flex-col gap-4 rounded-2xl border border-[#EBE5DE] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A6B63]" />
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="Pesquisar por cargo, empresa ou tecnologia (ex: React, Vue, Python)..."
              class="w-full rounded-xl border border-[#EBE5DE] bg-[#FDFBF7] py-3 pl-11 pr-4 text-sm text-[#2C221E] placeholder-[#7A6B63]/60 focus:border-[#C86D51] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2.5 cursor-pointer text-sm font-semibold text-[#5D4E46] select-none">
              <input
                v-model="store.onlyRemote"
                type="checkbox"
                class="h-4 w-4 rounded border-[#EBE5DE] text-[#C86D51] focus:ring-[#C86D51]"
              />
              Apenas Remoto
            </label>

            <button
              @click="store.loadJobs()"
              :disabled="store.loading"
              class="inline-flex items-center gap-2 rounded-xl bg-[#C86D51] px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#B55D42] disabled:opacity-50 transition-colors"
            >
              <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': store.loading }" />
              Atualizar Vagas
            </button>
          </div>
        </div>

        <!-- Estados de Carregamento e Erros -->
        <div v-if="store.loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-8">
          <div v-for="n in 6" :key="n" class="h-52 rounded-2xl border border-[#EBE5DE] bg-white p-6 animate-pulse">
            <div class="h-4 bg-[#F4F0EB] rounded w-1/3 mb-4"></div>
            <div class="h-6 bg-[#F4F0EB] rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-[#F4F0EB] rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="store.error" class="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          <p class="font-bold text-base">Ops! Algo deu errado.</p>
          <p class="text-sm mt-1">{{ store.error }}</p>
        </div>

        <!-- Grid de Cards de Vagas -->
        <div v-else-if="store.filteredJobs.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <JobCard
            v-for="job in store.filteredJobs"
            :key="job.id"
            :job="job"
            :is-saved="store.isJobSaved(job.id)"
            @toggle-save="store.toggleSaveJob"
          />
        </div>

        <!-- Estado Vazio -->
        <div v-else class="rounded-3xl border border-dashed border-[#D6CEC4] bg-white py-20 text-center">
          <Filter class="mx-auto h-12 w-12 text-[#7A6B63] mb-3" />
          <h3 class="text-lg font-bold text-[#2C221E]">Nenhuma vaga encontrada</h3>
          <p class="text-sm text-[#7A6B63] mt-1">Tente ajustar sua busca ou desativar os filtros.</p>
        </div>
      </template>

      <!-- ABA 2: KANBAN -->
      <template v-else>
        <div class="mb-6">
          <h2 class="text-2xl font-black text-[#2C221E]">Painel de Candidaturas</h2>
          <p class="text-sm text-[#7A6B63]">Organize suas vagas salvas por etapas do processo seletivo</p>
        </div>
        <KanbanBoard />
      </template>
    </main>

    <!-- Rodapé -->
    <footer class="mt-auto border-t border-[#EFECE6] bg-white py-8 text-center text-xs font-medium text-[#7A6B63]">
      <p>DevRadar — Desenvolvido com Vue 3, TypeScript, Tailwind CSS e Pinia.</p>
    </footer>
  </div>
</template>