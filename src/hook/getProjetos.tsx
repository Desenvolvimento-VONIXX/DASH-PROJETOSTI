import { useQuery } from "@tanstack/react-query";

interface Projeto {
    id: number;
    nome_projeto: string;
    desc_projeto: string;
    status: string;
    status2: string;
    prioridade: string,
    prioridade2: string,
    data_inicio: string;
    data_finalizacao: string;
}

const fetchProjetos = async (): Promise<Projeto[]> => {
    const response = await JX.consultar(`
        SELECT 
        ID AS id, 
        NOME_PROJETO AS nome_projeto, 
        DESCRICAO AS desc_projeto, 
        SANKHYA.OPTION_LABEL('AD_PROJETOSTI', 'STATUS', STATUS) AS status, 
        STATUS AS status2, 
        SANKHYA.OPTION_LABEL('AD_PROJETOSTI', 'PRIORIDADE', PRIORIDADE) AS prioridade, 
        STATUS AS prioridade2, 
        FORMAT(DATA_INICIO, 'yyyy/MM/dd') AS data_inicio, 
        FORMAT(DATA_FINALIZACAO, 'yyyy/MM/dd') AS data_finalizacao, 
        (SELECT CAST(ROUND(CASE WHEN (COUNT(*) + (SELECT COUNT(*) FROM AD_ABERTURAPROJETOS WHERE ID_PRO_NOVO = PTI.ID)) = 0 THEN 0 ELSE (COUNT(CASE WHEN STATUS = 'CONCLUIDO' THEN 1 END) + (SELECT COUNT(*) FROM AD_ABERTURAPROJETOS WHERE ID_PRO_NOVO = PTI.ID AND STATUSPRO = 'FINALIZADO')) * 100.0 / (COUNT(*) + (SELECT COUNT(*) FROM AD_ABERTURAPROJETOS WHERE ID_PRO_NOVO = PTI.ID)) END, 2) AS DECIMAL(5,2)) FROM AD_CRONOGRAMAPROJETOS WHERE ID = PTI.ID) AS PORCENTAGEM 
        FROM AD_PROJETOSTI PTI 
        ORDER BY 
        CASE STATUS 
        WHEN 'BACKLOG' THEN 1
        WHEN 'ANDAMENTO' THEN 2
        WHEN 'TESTE' THEN 3
        WHEN 'DESENV' THEN 4
        WHEN 'IMPED' THEN 5
        WHEN 'REVISAO' THEN 6
        WHEN 'CONCLUIDO' THEN 7
        WHEN 'CANCELADO' THEN 8
        ELSE 9
    END,
        ID DESC`
    );
    return response;

};

export const useProjetos = () => {
    return useQuery<Projeto[], Error>({
        queryKey: ["projetos"],
        queryFn: fetchProjetos,
        retry: false,
    });
};
