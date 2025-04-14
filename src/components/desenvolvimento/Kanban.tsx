import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { MoveLeft, RefreshCcw, CircleCheckBig } from "lucide-react";
import { useGetDetailsProjeto } from "@/hook/getDetailsProjeto";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { ModalDetalhesAtv } from "./modalDetalheAtv";
import { getCurrentDate } from "@/utils/nowDate";
import { useCodUsu } from "@/hook/getUsuLogado";
import { toast } from "sonner";

interface Atividades {
    ID: number;
    IDABERTURA: number;
    DESC_PROJETO: string;
    TIPO_PROJETO: string;
    PRAZO: string;
    DESENVOLVEDOR: string;
    DATAFIM: string;
    DATAINICIO: string;
    STATUS_TAREFA: string;
    OBSERVACAO: string;
    NUMERO_CHAMADO: number
}

interface Props {
    atividades: Atividades[];
    id: number;
}

const statusMapAtividade: Record<string, string> = {
    "A FAZER": "A Fazer",
    "EM ANDAMENTO": "Em Andamento",
    "TESTE": "Em Teste",
    "FINALIZADO": "Finalizado",
    "IMPED": "Impedimento",
    "PAUSADO": "Pausado"
};

export const Kanban: React.FC<Props> = ({ atividades, id }) => {
    const { data: projetoDetails } = useGetDetailsProjeto(Number(id));
    const [selectedAtv, setSelectedAtv] = useState<number | null>(null);
    const [openModalDetalhes, setModalDetalhes] = useState(false);
    const dataAtual = getCurrentDate();
    const { data: codUsu } = useCodUsu();
    const { data: projeto, refetch } = useGetDetailsProjeto(id);

    const handleOpenModal = (id: number) => {
        setSelectedAtv(id);
        setModalDetalhes(true);
    };

    const [loading, setLoading] = useState(false);

    const concluirProjeto = async () => {
        setLoading(true);
        try {
            const response = await JX.salvar(
                {
                    STATUS: "CONCLUIDO",
                    DATA_FINALIZACAO: dataAtual,
                },
                "AD_PROJETOSTI",
                [
                    {
                        ID: id
                    }
                ]
            );

            if (Number(response[0].status) === 1) {
                salvaLog();
                refetch();
                toast.success("Projeto Concluído com sucesso!")
            } else {
                const error = response[0].statusMessage || "erro ao concluir projeto.";
                toast.error(`Ocorreu um erro ao concluir o projeto: ${error}`);
            }

        } catch (err) {
            toast.error("Ocorreu um erro ao concluir o projeto.");
        } finally {
            setLoading(false);
        }
    }

    const salvaLog = async () => {
        await JX.salvar(
            {
                NOME_PROJETO: projeto.nome_projeto,
                DATA_INICIO: projeto.data_inicio,
                DATA_FINALIZACAO: projeto.data_finalizacao,
                STATUS: projeto.status2,
                DESCRICAO: projeto.desc_projeto,
                DT_ALTERACAO: dataAtual,
                ID: id,
                CODUSU: codUsu
            },
            "AD_LOGPROJETOSTI",
            []
        ).then(() => {
            console.log("Log salvo com sucesso");
        }).catch(() => {
            console.log("Erro ao salvar log");
        });
    }


    if (!projetoDetails) return null;

    return (
        <>
            <div className="flex flex-col mx-auto p-5 space-y-6 ">
                <div className="flex gap-5 items-center mb-3 text-center">
                    <div className="flex gap-1">
                        <Link to="/">
                            <Button className="flex items-center gap-2 px-4 py-2 border" variant={"outline"}>
                                <MoveLeft size={18} /> Voltar
                            </Button>
                        </Link>

                        <Button className="flex items-center gap-2 px-4 py-2 border "
                            disabled={loading || projeto.status2 === 'CONCLUIDO'}
                            onClick={() => concluirProjeto()}
                            variant={"outline"}>
                            <CircleCheckBig size={18} />
                            Concluir Projeto
                        </Button>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-600 uppercase">
                        {projetoDetails?.nome_projeto || ""}
                    </h2>

                    <Button className="flex items-center gap-2 px-4 py-2 border ml-auto" onClick={() => window.location.reload()}>
                        <RefreshCcw size={18} />
                    </Button>
                </div>


                <div className="grid gap-2 grid-cols-1 sm:grid-cols-6 lg:grid-cols-6 mt-12">
                    {Object.keys(statusMapAtividade).map((statusKey) => (
                        <div key={statusKey} className="p-2 rounded-lg min-h-[82vh] border-2 border-gray-200 shadow-sm">
                            <h3 className="text-xl font-semibold mb-2 uppercase text-center">
                                {statusMapAtividade[statusKey]}
                            </h3>
                            <hr />

                            <ScrollArea className="h-[70vh] rounded-md m-1">

                                <div className="mt-4 space-y-3 p-1 cursor-auto " >
                                    {(atividades ?? [])
                                        .filter((atividade) => atividade.STATUS_TAREFA === statusKey)
                                        .map((atividade) => {
                                            const bgColor =
                                                statusKey === "A FAZER" ? "border-blue-400 bg-blue-100" :
                                                    statusKey === "EM ANDAMENTO" ? "border-yellow-400 bg-yellow-100" :
                                                        statusKey === "TESTE" ? "border-purple-400 bg-purple-100" :
                                                            statusKey === "FINALIZADO" ? "border-green-400 bg-green-100" :
                                                                "bg-gray-100";

                                            return (
                                                <div key={atividade.ID} className={`p-3 rounded-lg shadow border-l-4 ${bgColor}`} onClick={() => handleOpenModal(atividade.ID)}>
                                                    <p className="font-bold text-sm text-gray-600">{atividade.TIPO_PROJETO}</p>
                                                    <p className="text-xs text-gray-600">
                                                        Desenvolvedor: <strong className="text-gray-500">{atividade.DESENVOLVEDOR}</strong>
                                                    </p>
                                                    {atividade.DATAINICIO && (
                                                        <p className="text-xs text-gray-500">Dt. Início: {atividade.DATAINICIO}</p>
                                                    )}
                                                    {atividade.DATAFIM && (
                                                        <p className="text-xs text-gray-500">Dt. Finalização: {atividade.DATAFIM}</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </ScrollArea>
                        </div>
                    ))}
                </div>
            </div >

            <ModalDetalhesAtv
                open={openModalDetalhes}
                setOpen={() => setModalDetalhes(false)}
                idProjeto={id}
                idAtividade={selectedAtv}
            />

        </>

    );
};
