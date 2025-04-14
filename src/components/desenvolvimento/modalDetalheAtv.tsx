import { Loading } from "../loading";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { useGetAtvDev } from "@/hook/desenvolvimento/getDetailsAtv";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idProjeto: number;
    idAtividade: number | null;
}

export const ModalDetalhesAtv: React.FC<Props> = ({ open, setOpen, idProjeto, idAtividade }) => {
    const { data: atividade, isLoading } = useGetAtvDev(idProjeto, idAtividade);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Detalhes da Atividade</SheetTitle>
                    <SheetDescription>
                        Informações da Atividade #{idAtividade}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-2">
                    {isLoading ? (
                        <div className="mt-5 flex items-center justify-center text-center ">
                            <Loading w={40} h={40} />
                        </div>
                    ) : atividade ? (
                        <>
                            <div className="mt-5">
                                {atividade.TIPO_PROJETO && (
                                    <div className="flex gap-1 items-center mt-1">

                                        <span className="text-md font-medium text-gray-700">Tipo de Tarefa:</span>
                                        <span className="text-md text-gray-900">{atividade.TIPO_PROJETO}</span>
                                    </div>
                                )}
                                {atividade.DESC_PROJETO && (
                                    <div className="flex gap-1 items-center mt-1">

                                        <span className="text-md font-medium text-gray-700">Nome da Atividade:</span>
                                        <span className="text-md text-gray-900">{atividade.DESC_PROJETO}</span>
                                    </div>
                                )}
                                {atividade.DESENVOLVEDOR && ( 
                                    <div className="flex gap-1 items-center mt-1">
                                        <span className="text-md font-medium text-gray-700">Desenvolvedor:</span>
                                        <span className="text-md text-gray-900">{atividade.DESENVOLVEDOR}</span>
                                    </div>
                                )}

                                {atividade.NUMERO_CHAMADO && (
                                    <div className="flex gap-1 items-center mt-1">
                                        <span className="text-md font-medium text-gray-700">Número do Chamado:</span>
                                        <span className="text-md text-gray-900">{atividade.NUMERO_CHAMADO}</span>
                                    </div>
                                )}
                                {atividade.PRAZO && (
                                    <div className="flex gap-1 items-center mt-1">
                                        <span className="text-md font-medium text-gray-700">Prazo:</span>
                                        <span className="text-md text-gray-900">{atividade.PRAZO}</span>
                                    </div>
                                )}
                                {atividade.DATAINICIO && (
                                    <div className="flex gap-1 items-center mt-1">
                                        <span className="text-md font-medium text-gray-700">Data Início:</span>
                                        <span className="text-md text-gray-900">{atividade.DATAINICIO}</span>
                                    </div>
                                )}
                                {atividade.DATAFIM && (
                                    <div className="flex gap-1 items-center mt-1">
                                        <span className="text-md font-medium text-gray-700">Data Finalização:</span>
                                        <span className="text-md text-gray-900">{atividade.DATAFIM}</span>
                                    </div>
                                )}
                                {atividade.OBSERVACAO && (
                                    <div className="flex gap-1 items-center mt-1">
                                        <span className="text-md font-medium text-gray-700">Observação:</span>
                                        <span className="text-md text-gray-900">{atividade.OBSERVACAO}</span>
                                    </div>
                                )}

                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Detalhes do projeto não encontrados.</p>
                    )}
                </div>

            </SheetContent>
        </Sheet>
    );
};
