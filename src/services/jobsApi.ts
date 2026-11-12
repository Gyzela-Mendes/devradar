import axios from 'axios';
import type { Job } from '../types/job';

interface ArbeitnowJob {
    slug: string;
    company_name: string;
    title: string;
    remote: boolean;
    url: string;
    tags: string[];
    location: string;
    created_at: number;
}

interface ArbeitnowResponse {
    data: ArbeitnowJob[];
}

// Banco de conversão inteligente para garantir títulos profissionais em português
function formatJobTitle(originalTitle: string): string {
    const titleLower = originalTitle.toLowerCase();

    if (titleLower.includes('frontend') || titleLower.includes('front-end')) {
        return 'Desenvolvedor(a) Frontend';
    }
    if (titleLower.includes('backend') || titleLower.includes('back-end')) {
        return 'Desenvolvedor(a) Backend';
    }
    if (titleLower.includes('fullstack') || titleLower.includes('full-stack')) {
        return 'Desenvolvedor(a) Full Stack';
    }
    if (titleLower.includes('react')) {
        return 'Desenvolvedor(a) React / Frontend';
    }
    if (titleLower.includes('vue')) {
        return 'Desenvolvedor(a) Vue.js';
    }
    if (titleLower.includes('python') || titleLower.includes('django')) {
        return 'Desenvolvedor(a) Python';
    }
    if (titleLower.includes('devops') || titleLower.includes('sre')) {
        return 'Engenheiro(a) DevOps / SRE';
    }
    if (titleLower.includes('data') || titleLower.includes('cientista')) {
        return 'Cientista / Engenheiro(a) de Dados';
    }
    if (titleLower.includes('product') || titleLower.includes('produto')) {
        return 'Gerente de Produto (Product Manager)';
    }
    if (titleLower.includes('sales') || titleLower.includes('vendas')) {
        return 'Analista de Vendas e Parcerias Tech';
    }

    // Se não encontrar uma correspondência exata, limpa termos em alemão/estrangeiros comuns
    return originalTitle
        .replace(/teilzeit/gi, 'Meio Período')
        .replace(/werkstudent/gi, 'Estagiário Tech')
        .replace(/junior/gi, 'Júnior')
        .replace(/senior/gi, 'Sênior');
}

function formatLocation(location: string, remote: boolean): string {
    if (remote) {
        return 'Remoto (Global)';
    }
    if (!location || location.trim() === '') {
        return 'Híbrido / Flexível';
    }

    // Substitui termos internacionais comuns por versões amigáveis
    return location
        .replace('Germany', 'Alemanha')
        .replace('Remote', 'Remoto')
        .replace('Worldwide', 'Global')
        .replace('Berlin', 'Berlim');
}

export async function fetchTechJobs(): Promise<Job[]> {
    try {
        const response = await axios.get<ArbeitnowResponse>(
            'https://www.arbeitnow.com/api/job-board-api'
        );

        return response.data.data.map((item) => {
            const isRemote = item.remote || item.location.toLowerCase().includes('remote');

            return {
                id: item.slug,
                title: formatJobTitle(item.title),
                company: item.company_name,
                location: formatLocation(item.location, isRemote),
                remote: isRemote,
                // Filtra tags limpas e garante relevância
                tags: item.tags && item.tags.length > 0
                    ? item.tags.slice(0, 4).map(t => t.charAt(0).toUpperCase() + t.slice(1))
                    : ['Tecnologia', 'Desenvolvimento'],
                url: item.url,
                createdAt: new Date(item.created_at * 1000).toLocaleDateString('pt-BR'),
            };
        });
    } catch (error) {
        console.error('Erro ao buscar vagas na API:', error);
        throw new Error('Não foi possível carregar as vagas no momento. Tente novamente.');
    }
}