<script setup lang="ts">
import { computed } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  labels: string[];
  values: number[];
}>();

// Dicionário para traduzir os rótulos do gráfico para o português
function translateLabel(label: string): string {
  const translations: Record<string, string> = {
    'Engineering': 'Engenharia de Software',
    'Remote': 'Vagas Remotas',
    'Social Media Manager': 'Redes Sociais e Mídia',
    'Project Management': 'Gestão de Projetos',
    'and Network Administration': 'Redes e Infraestrutura',
    'Sales': 'Vendas e Comercial',
    'Development': 'Desenvolvimento',
    'Backend': 'Backend',
    'Frontend': 'Frontend',
    'Fullstack': 'Full Stack',
  };

  return translations[label] || label;
}

const translatedLabels = computed(() => props.labels.map(translateLabel));

const chartData = computed(() => ({
  labels: translatedLabels.value,
  datasets: [
    {
      label: 'Vagas encontradas',
      data: props.values,
      backgroundColor: '#C86D51', // Tom terracota elegante
      borderRadius: 6,
      barThickness: 20,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const, // Gráfico de barras horizontais
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => ` ${context.raw} vagas`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: '#F4F0EB',
      },
      ticks: {
        font: {
          family: 'sans-serif',
          size: 11,
        },
        color: '#7A6B63',
      },
    },
    y: {
      grid: {
        display: false,
      },
      // Aumento da largura e margem para o texto caber inteiro sem quebrar
      afterFit: (scaleInstance: any) => {
        scaleInstance.width = 160;
      },
      ticks: {
        font: {
          family: 'sans-serif',
          size: 11,
          weight: 600,
        },
        color: '#2C221E',
        autoSkip: false,
      },
    },
  },
};
</script>

<template>
  <div class="flex flex-col h-full rounded-2xl border border-[#EBE5DE] bg-white p-6 shadow-xs">
    <div class="mb-4">
      <h3 class="text-base font-bold text-[#2C221E]">Radar de Tecnologias em Alta</h3>
      <p class="text-xs text-[#7A6B63]">Principais áreas e habilidades mais exigidas nas vagas atuais</p>
    </div>
    <div class="relative flex-1 min-h-[220px]">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>