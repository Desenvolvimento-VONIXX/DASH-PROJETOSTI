import { useQuery } from "@tanstack/react-query";

const fetchDetailAtv = async (idProjeto?: number | null, idAtividade?: number | null) => {

    const response = await JX.consultar(
        `SELECT 
        REC.ID_RECEBIDOS AS ID, 
        REC.IDABERTURA AS IDABERTURA, 
        REC.NOME_PROJETO AS DESC_PROJETO, 
        REC.TIPO_PROEJTO AS TIPO_PROJETO, 
        FORMAT(REC.DATAFIM_PROJETO, 'dd/MM/yyyy') AS PRAZO, 
        USU.NOMEUSU AS DESENVOLVEDOR, 
        ABR.DATAFIMTAREFA AS DATAFIM, 
        FORMAT(ABR.DATAINICIO, 'dd/MM/yyy') AS DATAINICIO, 
        FORMAT(ABR.DATAFIMTAREFA, 'dd/MM/yyy') AS DATAFIM, 
        REC.STATUS_PROJETO AS STATUS_TAREFA, 
        SOLI.NOMEUSU AS USU_SOCILICTANTE, 
        SOLI.CODUSU AS COD_USU_SOLICITANTE, 
        REC.DESCRICAO_PROJETO AS OBSERVACAO, 
        REC.NUMEROCHAMADO AS NUMERO_CHAMADO, 
        TST.STATUS_TESTE AS STATUS_TESTE, 
        TST.RELATORIO AS RELATORIO_TESTE, 
        USU_TESTER.NOMEUSU AS NOME_TESTER 
        FROM SANKHYA.AD_RECEBIDOS REC 
        INNER JOIN SANKHYA.TSIUSU USU ON USU.CODUSU = REC.DESENVOLVEDOR_ID 
        INNER JOIN SANKHYA.AD_ABERTURAPROJETOS ABR ON ABR.IDABERTURA = REC.IDABERTURA 
        LEFT JOIN SANKHYA.AD_TGFRCI RCI ON RCI.CODACI= REC.NUMEROCHAMADO 
        LEFT JOIN SANKHYA.TSIUSU SOLI ON SOLI.CODUSU = RCI.CODUSU 
        LEFT JOIN SANKHYA.TSIUSU USU_TESTER ON USU_TESTER.CODUSU = REC.ID_TESTER 
        LEFT JOIN SANKHYA.AD_ATIVIDADETESTE TST ON TST.ID_RECEBIDOS = REC.ID_RECEBIDOS 
        WHERE 
        ABR.ID_PRO_NOVO = ${idProjeto} 
        AND REC.ID_RECEBIDOS = ${idAtividade} 
        ORDER BY 
        REC.DATALANCAMENTO DESC`
    );
    return response[0];
};

export function useGetAtvDev(idProjeto?: number | null, idAtividade?: number | null) {
    return useQuery({
        queryKey: ["detail_atv", idProjeto, idAtividade],
        queryFn: () => fetchDetailAtv(idProjeto, idAtividade),
        retry: false,
        enabled: !!idProjeto && !!idAtividade,
    });
}
