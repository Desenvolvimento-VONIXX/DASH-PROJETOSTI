import { useQuery } from "@tanstack/react-query";

const fetchDetailsEtapaExecucao = async (idProjeto?: number | null, idAtividade?: number | null) => {
    const response = await JX.consultar(
        `SELECT 
        SPRINT_PROJETO AS sprint, 
        FORMAT(DT_EST_INICIO, 'yyyy/MM/dd') AS data_est_inicio, 
        FORMAT(DT_EST_TERMINO, 'yyyy/MM/dd') AS data_est_termino 
        FROM AD_ABERTURAPROJETOS 
        INNER JOIN TSIUSU USU ON USU.CODUSU = AD_ABERTURAPROJETOS.RESPONSAVEL 
        WHERE ID_PRO_NOVO = ${idProjeto} AND IDABERTURA = ${idAtividade}`
    );
    return response[0];
};

export function useGetDetailsEtapaExecucao(idProjeto?: number | null, idAtividade?: number | null) {
    return useQuery({
        queryKey: ["etapas_execucao", idProjeto, idAtividade],
        queryFn: () => fetchDetailsEtapaExecucao(idProjeto, idAtividade),
        retry: false,
        enabled: !!idProjeto && !!idAtividade,
    });
}
