import { useQuery } from "@tanstack/react-query";

const fetchLog = async (idProjeto?: number | null) => {
    const response = await JX.consultar(
        `SELECT 
    LOGTI.ID_LOG AS id_log, 
    LOGTI.ID AS id, 
    LOGTI.NOME_PROJETO AS nome_projeto, 
    LOGTI.DESCRICAO AS desc_projeto, 
    SANKHYA.OPTION_LABEL('AD_PROJETOSTI', 'STATUS', LOGTI.STATUS) AS status, 
    STATUS AS status2, 
    FORMAT(LOGTI.DATA_INICIO, 'dd/MM/yyyy') AS data_inicio, 
    FORMAT(LOGTI.DATA_FINALIZACAO, 'dd/MM/yyyy') AS data_finalizacao, 
    FORMAT(LOGTI.DT_ALTERACAO, 'dd/MM/yyyy HH:mm') AS data_alteracao, 
    LOGTI.CODUSU AS CODUSU, 
    USU.NOMEUSU AS nome_usu 
    FROM AD_LOGPROJETOSTI LOGTI 
    INNER JOIN TSIUSU USU ON USU.CODUSU = LOGTI.CODUSU 
    WHERE LOGTI.ID = ${idProjeto} ORDER BY LOGTI.DT_ALTERACAO DESC`
    );
    return response;
};

export function useGetLog(idProjeto?: number | null) {
    return useQuery({
        queryKey: ["log", idProjeto],
        queryFn: () => fetchLog(idProjeto),
        retry: false,
        enabled: !!idProjeto,
    });
}
