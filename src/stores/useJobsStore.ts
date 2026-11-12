import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Job, SavedJob, JobStatus } from '../types/job';
import { fetchTechJobs } from '../services/jobsApi';

// Chave versionada para evitar conflitos caso o schema do objeto mude futuramente
const STORAGE_KEY = 'devradar_saved_jobs_v1';

export const useJobsStore = defineStore('jobs', () => {
    const jobs = ref<Job[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const searchQuery = ref('');
    const onlyRemote = ref(false);
    const savedJobs = ref<SavedJob[]>(loadFromStorage());

    function loadFromStorage(): SavedJob[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    // Sincronização reativa: persiste qualquer alteração (adição, remoção ou troca de status) no LocalStorage
    watch(
        savedJobs,
        (newVal) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
        },
        { deep: true }
    );

    async function loadJobs() {
        loading.value = true;
        error.value = null;
        try {
            jobs.value = await fetchTechJobs();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Erro desconhecido ao carregar vagas.';
        } finally {
            loading.value = false;
        }
    }

    // Filtragem combinada em memória para resposta instantânea durante a digitação
    const filteredJobs = computed(() => {
        return jobs.value.filter((job) => {
            const matchesRemote = !onlyRemote.value || job.remote;
            const query = searchQuery.value.trim().toLowerCase();

            if (!query) return matchesRemote;

            const inTitle = job.title.toLowerCase().includes(query);
            const inCompany = job.company.toLowerCase().includes(query);
            const inTags = job.tags.some((tag) => tag.toLowerCase().includes(query));

            return matchesRemote && (inTitle || inCompany || inTags);
        });
    });

    // Agrega e ordena a frequência das tags para alimentar o gráfico de tendências
    const topTechnologies = computed(() => {
        const counts: Record<string, number> = {};

        jobs.value.forEach((job) => {
            job.tags.forEach((tag) => {
                const cleanTag = tag.trim();
                // Ignora a tag genérica 'Tech' atribuída como fallback no adapter
                if (cleanTag && cleanTag.toLowerCase() !== 'tech') {
                    counts[cleanTag] = (counts[cleanTag] || 0) + 1;
                }
            });
        });

        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);

        return {
            labels: sorted.map(([name]) => name),
            values: sorted.map(([, count]) => count),
        };
    });

    function isJobSaved(jobId: string): boolean {
        return savedJobs.value.some((item) => item.id === jobId);
    }

    function toggleSaveJob(job: Job) {
        const index = savedJobs.value.findIndex((item) => item.id === job.id);
        if (index >= 0) {
            savedJobs.value.splice(index, 1);
        } else {
            savedJobs.value.unshift({
                ...job,
                status: 'saved',
                savedAt: new Date().toLocaleDateString('pt-BR'),
            });
        }
    }

    function updateJobStatus(jobId: string, newStatus: JobStatus) {
        const job = savedJobs.value.find((item) => item.id === jobId);
        if (job) {
            job.status = newStatus;
        }
    }

    function removeSavedJob(jobId: string) {
        savedJobs.value = savedJobs.value.filter((item) => item.id !== jobId);
    }

    return {
        jobs,
        loading,
        error,
        searchQuery,
        onlyRemote,
        savedJobs,
        filteredJobs,
        topTechnologies,
        loadJobs,
        isJobSaved,
        toggleSaveJob,
        updateJobStatus,
        removeSavedJob,
    };
});