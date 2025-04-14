import { useQuery } from "@tanstack/react-query";

const fetchEtapasExecucao = async (idProjeto?: number | null) => {
    const response = await JX.consultar(
        ` SELECT 
        ID_PRO_NOVO AS id,
        IDABERTURA AS id_atv, 
        SPRINT_PROJETO AS sprint, 
        NOMEPRO AS nome_tarefa, 
        USU.NOMEUSU AS responsavel, 
        AREA AS area, 
        FASE AS fase, 
        SANKHYA.OPTION_LABEL('AD_ABERTURAPROJETOS', 'FASE', FASE) AS fase2, 
        STATUSPRO as status, 
        SANKHYA.OPTION_LABEL('AD_ABERTURAPROJETOS', 'STATUSPRO', STATUSPRO) AS status2, 
        FORMAT(DT_EST_INICIO, 'yyyy/MM/dd') AS data_est_inicio, 
        FORMAT(DT_EST_TERMINO, 'yyyy/MM/dd') AS data_est_termino, 
        FORMAT(DATAINICIO, 'yyyy/MM/dd') AS data_inicio, 
        FORMAT(DATAFIMTAREFA, 'yyyy/MM/dd') AS data_termino  
        FROM AD_ABERTURAPROJETOS 
        INNER JOIN TSIUSU USU ON USU.CODUSU = AD_ABERTURAPROJETOS.RESPONSAVEL 
        WHERE ID_PRO_NOVO = ${idProjeto}`
    );
    return response;
};

export function useGetEtapasExecucao(idProjeto?: number | null) {
    return useQuery({
        queryKey: ["etapas_desenvolvimento", idProjeto],
        queryFn: () => fetchEtapasExecucao(idProjeto),
        retry: false,
        enabled: !!idProjeto,
    });
}
