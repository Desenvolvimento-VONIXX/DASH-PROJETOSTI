import { useQuery } from "@tanstack/react-query";

const fetchEtapasDetailsProjeto = async (idProjeto?: number | null) => {
    const response = await JX.consultar(
        ` SELECT 
            ID AS id, 
            ID_CRO AS id_cronograma, 
            NOME_TAREFA AS nome_tarefa, 
            FASE AS fase, 
            SANKHYA.OPTION_LABEL('AD_CRONOGRAMAPROJETOS', 'FASE', FASE) AS fase2, 
            AREA AS area, 
            FORMAT(DT_ESTIMADA_INICIO, 'yyyy/MM/dd') AS data_est_inicio, 
            FORMAT(DT_ESTIMADA_TERMINO, 'yyyy/MM/dd') AS data_est_termino, 
            FORMAT(DATA_INICIO, 'yyyy/MM/dd') AS data_inicio, 
            FORMAT(DATA_TERMINO, 'yyyy/MM/dd') AS data_termino, 
            STATUS AS status, 
            SANKHYA.OPTION_LABEL('AD_CRONOGRAMAPROJETOS', 'STATUS', STATUS) AS status2, 
            RESPONSAVEL AS responsavel, 
            SPRINT AS sprint 
            FROM AD_CRONOGRAMAPROJETOS 
            WHERE ID = ${idProjeto}`
    );
    return response;
};

export function useGetEtapasProjeto(idProjeto?: number | null) {
    return useQuery({
        queryKey: ["etapas_projeto", idProjeto],
        queryFn: () => fetchEtapasDetailsProjeto(idProjeto),
        retry: false,
        enabled: !!idProjeto,
    });
}
