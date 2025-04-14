import { useQuery } from "@tanstack/react-query";

const fetchAtividadesDesenvolvimento = async (idProjeto?: number | null) => {

    const response = await JX.consultar(
        `SELECT
            REC.ID_RECEBIDOS AS ID, 
            REC.IDABERTURA AS IDABERTURA, 
            REC.NOME_PROJETO AS DESC_PROJETO, 
            REC.TIPO_PROEJTO AS TIPO_PROJETO, 
            FORMAT(REC.DATAFIM_PROJETO, 'dd/MM/yyy') AS PRAZO, 
            USU.NOMEUSU AS DESENVOLVEDOR, 
            FORMAT(ABR.DATAFIMTAREFA, 'dd/MM/yyy') AS DATAFIM, 
            FORMAT(ABR.DATAINICIO, 'dd/MM/yyy') AS DATAINICIO, 
            REC.STATUS_PROJETO AS STATUS_TAREFA, 
            REC.DESCRICAO_PROJETO AS OBSERVACAO, 
            REC.NUMEROCHAMADO AS NUMERO_CHAMADO
            FROM SANKHYA.AD_RECEBIDOS REC 
            INNER JOIN SANKHYA.TSIUSU USU ON USU.CODUSU = REC.DESENVOLVEDOR_ID 
            INNER JOIN SANKHYA.AD_ABERTURAPROJETOS ABR ON ABR.IDABERTURA = REC.IDABERTURA 
            WHERE 
            ABR.ID_PRO_NOVO = ${idProjeto} 
            ORDER BY 
            REC.DATALANCAMENTO DESC` 
    );
    return response;
};

export function useGetAtividadeDesenvolvimento(idProjeto?: number | null) {
    return useQuery({
        queryKey: ["atividades_dev", idProjeto],
        queryFn: () => fetchAtividadesDesenvolvimento(idProjeto),
        retry: false,
        enabled: !!idProjeto,
    });
}
