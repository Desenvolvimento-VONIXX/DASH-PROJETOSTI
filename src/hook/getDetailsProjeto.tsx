import { useQuery } from "@tanstack/react-query";

const fetchDetailsProjeto = async (idProjeto?: number | null) => {
    const response = await JX.consultar(
        `SELECT 
        ID AS id, 
        NOME_PROJETO AS nome_projeto, 
        DESCRICAO AS desc_projeto, 
        SANKHYA.OPTION_LABEL('AD_PROJETOSTI', 'STATUS', STATUS) AS status, 
        STATUS AS status2, 
        SANKHYA.OPTION_LABEL('AD_PROJETOSTI', 'PRIORIDADE', PRIORIDADE) AS prioridade, 
        PRIORIDADE AS prioridade2, 
        FORMAT(DATA_INICIO, 'dd/MM/yyyy') AS data_inicio, 
        FORMAT(DATA_FINALIZACAO, 'dd/MM/yyyy') AS data_finalizacao, 
        ANEXOS AS ANEXOS 
        FROM AD_PROJETOSTI 
        WHERE ID = ${idProjeto}`
    );
    return response[0];
};

export function useGetDetailsProjeto(idProjeto?: number | null) {
    return useQuery({
        queryKey: ["detail-projetos", idProjeto],
        queryFn: () => fetchDetailsProjeto(idProjeto),
        retry: false,
        enabled: !!idProjeto,
    });
}
