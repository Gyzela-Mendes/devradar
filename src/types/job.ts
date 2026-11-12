// Estados possíveis do fluxo no Kanban; garante segurança de tipos nas transições de coluna
export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer';

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    remote: boolean;
    tags: string[];
    url: string;
    createdAt: string;
    salary?: string;
}

// Estende a interface base adicionando metadados exclusivos do controle interno do usuário
export interface SavedJob extends Job {
    status: JobStatus;
    savedAt: string;
}
