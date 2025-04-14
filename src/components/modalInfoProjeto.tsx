import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGetDetailsProjeto } from "@/hook/getDetailsProjeto";
import { ScrollArea } from "./ui/scroll-area";
import { useGetLog } from "@/hook/getLogProjetos";
import { Loading } from "./loading";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idProjeto: number | null;
}

interface Log {
    id_log: number;
    id: number;
    nome_projeto: string;
    desc_projeto: string;
    status: string;
    status2: string;
    data_inicio: string;
    data_finalizacao: string;
    data_alteracao: string;
    nome_usu: string;
    CODUSU: number;
}

export const InfoProjeto: React.FC<Props> = ({ open, setOpen, idProjeto }) => {
    const { data: projeto, isLoading: isLoadingInfo } = useGetDetailsProjeto(idProjeto);
    const { data: logAlteracao, isLoading: isLoadingLog } = useGetLog(idProjeto);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-auto max-w-fit p-6">
                <DialogHeader>
                    <DialogTitle>Detalhes do Projeto #{idProjeto}</DialogTitle>
                    <DialogDescription>
                        Informações detalhadas sobre o projeto.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[50vh] p-2">
                    <div className="flex flex-col space-y-2">
                        {isLoadingInfo || isLoadingLog ? (
                            <div className="flex items-center justify-center text-center ">
                                <Loading w={40} h={40} />
                            </div>
                        ) : projeto ? (
                            <>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                    <div className="flex gap-1">
                                        <span className="text-sm font-medium text-gray-700">Nome do Projeto:</span>
                                        <span className="text-sm text-gray-900">{projeto.nome_projeto}</span>
                                    </div>

                                    <div className="flex gap-1">
                                        <span className="text-sm font-medium text-gray-700">Status:</span>
                                        <span className="text-sm text-gray-900">{projeto.status}</span>
                                    </div>

                                    <div className="flex gap-1">
                                        <span className="text-sm font-medium text-gray-700">Data Início:</span>
                                        <span className="text-sm text-gray-900">{projeto.data_inicio}</span>
                                    </div>

                                    <div className="flex gap-1">
                                        <span className="text-sm font-medium text-gray-700">Data Finalização:</span>
                                        <span className="text-sm text-gray-900">{projeto.data_finalizacao}</span>
                                    </div>

                                    <div className="col-span-2">
                                        <span className="text-sm font-medium text-gray-700">Descrição:</span>
                                        <p className="text-sm text-gray-900 leading-relaxed">
                                            {projeto.desc_projeto}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">Detalhes do projeto não encontrados.</p>
                        )}
                    </div>

                    {logAlteracao && logAlteracao.length > 0 && (
                        <div className="mt-5">
                            <h1 className="text-lg font-semibold text-gray-800 mb-1">Log de Alterações</h1>
                            <div className="p-2">
                                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                                    {logAlteracao.map((log: Log) => (
                                        <li className="mb-10 ms-4" key={log.id_log}>
                                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                                {log.data_alteracao}
                                            </time>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{log.nome_projeto}</h3>
                                            <p className="mb-1 text-base font-normal text-gray-500 dark:text-gray-400">{log.desc_projeto}</p>
                                            <p className="mb-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                                <strong>Status: </strong>{log.status}
                                            </p>
                                            <p className="mb-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                                <strong>Data Início: </strong>{log.data_inicio}
                                            </p>
                                            <p className="mb-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                                <strong>Data Finalização: </strong>{log.data_finalizacao}
                                            </p>
                                            <p className="mb-1 text-base font-normal text-gray-500 dark:text-gray-400">
                                                <strong>Alterado por: </strong>{log.nome_usu}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter className="mt-10 ">
                    <Button type="button" variant="outline" className="border border-slate-600" onClick={() => setOpen(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
