<script setup lang="ts">
import { useJobsStore } from '../stores/useJobsStore';
import type { JobStatus } from '../types/job';
import { MapPin, ExternalLink, Trash2, ArrowRight, ArrowLeft } from 'lucide-vue-next';

const store = useJobsStore();

const columns: { id: JobStatus; title: string; color: string }[] = [
  { id: 'saved', title: 'Salvas', color: 'border-slate-300 bg-slate-50' },
  { id: 'applied', title: 'Candidatado', color: 'border-blue-300 bg-blue-50/50' },
  { id: 'interview', title: 'Entrevista', color: 'border-amber-300 bg-amber-50/50' },
  { id: 'offer', title: 'Proposta', color: 'border-emerald-300 bg-emerald-50/50' },
];

// Máquina de estados linear para transição segura entre colunas do funil
const statusFlow: JobStatus[] = ['saved', 'applied', 'interview', 'offer'];

function getNextStatus(current: JobStatus): JobStatus | null {
  const index = statusFlow.indexOf(current);
  return index < statusFlow.length - 1 ? statusFlow[index + 1] : null;
}

function getPrevStatus(current: JobStatus): JobStatus | null {
  const index = statusFlow.indexOf(current);
  return index > 0 ? statusFlow[index - 1] : null;
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="col in columns"
      :key="col.id"
      class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-bold text-slate-800">{{ col.title }}</h3>
        <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {{ store.savedJobs.filter((j) => j.status === col.id).length }}
        </span>
      </div>

      <div class="flex flex-1 flex-col gap-3 min-h-[350px]">
        <div
          v-for="job in store.savedJobs.filter((j) => j.status === col.id)"
          :key="job.id"
          class="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md"
        >
          <div>
            <div class="flex items-start justify-between gap-2">
              <span class="text-xs font-medium text-indigo-600 line-clamp-1">{{ job.company }}</span>
              <button
                type="button"
                @click="store.removeSavedJob(job.id)"
                class="text-slate-400 hover:text-rose-600 transition-colors"
                title="Remover do Kanban"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>

            <h4 class="mt-1 text-sm font-bold text-slate-900 leading-snug">
              {{ job.title }}
            </h4>

            <div class="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span class="flex items-center gap-1">
                <MapPin class="h-3 w-3 text-slate-400" />
                {{ job.location }}
              </span>
              <span v-if="job.remote" class="text-emerald-600 font-medium">Remoto</span>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <div class="flex items-center gap-1">
              <button
                v-if="getPrevStatus(job.status)"
                @click="store.updateJobStatus(job.id, getPrevStatus(job.status)!)"
                class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                title="Mover para trás"
              >
                <ArrowLeft class="h-3.5 w-3.5" />
              </button>
              <button
                v-if="getNextStatus(job.status)"
                @click="store.updateJobStatus(job.id, getNextStatus(job.status)!)"
                class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                title="Mover para frente"
              >
                <ArrowRight class="h-3.5 w-3.5" />
              </button>
            </div>

            <a
              :href="job.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Vaga <ExternalLink class="h-3 w-3" />
            </a>
          </div>
        </div>

        <div
          v-if="store.savedJobs.filter((j) => j.status === col.id).length === 0"
          class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400"
        >
          Nenhuma vaga aqui
        </div>
      </div>
    </div>
  </div>
</template>