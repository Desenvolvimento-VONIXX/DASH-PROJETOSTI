import { useQuery } from "@tanstack/react-query";

const fetchDetailsEtapa = async (idProjeto?: number | null, idCronogama?: number | null) => {
    const response = await JX.consultar(
        `SELECT 
              ID AS id, 
            ID_CRO AS id_cronograma, 
            NOME_TAREFA AS nome_tarefa, 
            FASE AS fase, 
            SANKHYA.OPTION_LABEL('AD_CRONOGRAMAPROJETOS', 'FASE', FASE) AS fase2, 
            AREA AS area, 
            FORMAT(DT_ESTIMADA_INICIO, 'dd/MM/yyyy') AS data_est_inicio, 
            FORMAT(DT_ESTIMADA_TERMINO, 'dd/MM/yyyy') AS data_est_termino, 
            FORMAT(DATA_INICIO, 'dd/MM/yyyy') AS data_inicio, 
            FORMAT(DATA_TERMINO, 'dd/MM/yyyy') AS data_termino, 
            STATUS AS status, 
            SANKHYA.OPTION_LABEL('AD_CRONOGRAMAPROJETOS', 'STATUS', STATUS) AS status2, 
            RESPONSAVEL AS responsavel, 
            SPRINT AS sprint 
            FROM AD_CRONOGRAMAPROJETOS 
            WHERE ID_CRO = ${idCronogama} AND ID = ${idProjeto} `
    );
    return response[0];
};

export function useGetDetailsEtapa(idProjeto?: number | null, idCronogama?: number | null) {
    return useQuery({
        queryKey: ["etapas", idProjeto, idCronogama],
        queryFn: () => fetchDetailsEtapa(idProjeto, idCronogama),
        retry: false,
        enabled: !!idProjeto && !!idCronogama,
    });
}
