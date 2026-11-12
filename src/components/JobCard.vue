<script setup lang="ts">
import { Bookmark, Building2, MapPin, ExternalLink, Calendar, Wifi } from 'lucide-vue-next';
import type { Job } from '../types/job';

defineProps<{
  job: Job;
  isSaved: boolean;
}>();

// Delega a mutação de estado ao componente pai/store mantendo o card puramente apresentacional
const emit = defineEmits<{
  (e: 'toggle-save', job: Job): void;
}>();
</script>

<template>
  <article
    class="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
  >
    <div>
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2 text-sm font-medium text-slate-600">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 class="h-4 w-4" />
          </div>
          <span class="line-clamp-1">{{ job.company }}</span>
        </div>

        <button
          type="button"
          @click="emit('toggle-save', job)"
          :title="isSaved ? 'Remover dos salvos' : 'Salvar vaga no Kanban'"
          class="rounded-lg p-2 transition-colors"
          :class="
            isSaved
              ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          "
        >
          <Bookmark class="h-5 w-5" :class="{ 'fill-current': isSaved }" />
        </button>
      </div>

      <h3 class="mt-3 text-lg font-bold leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors">
        {{ job.title }}
      </h3>

      <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span class="flex items-center gap-1">
          <MapPin class="h-3.5 w-3.5 text-slate-400" />
          {{ job.location }}
        </span>

        <span
          v-if="job.remote"
          class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-700"
        >
          <Wifi class="h-3 w-3" />
          Remoto
        </span>
      </div>

      <div class="mt-4 flex flex-wrap gap-1.5">
        <span
          v-for="tag in job.tags"
          :key="tag"
          class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
      <span class="flex items-center gap-1.5 text-slate-400">
        <Calendar class="h-3.5 w-3.5" />
        {{ job.createdAt }}
      </span>

      <a
        :href="job.url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700"
      >
        Ver vaga
        <ExternalLink class="h-3.5 w-3.5" />
      </a>
    </div>
  </article>
</template>