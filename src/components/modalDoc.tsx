import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Loading } from "./loading";
import { useGetDetailsProjeto } from "@/hook/getDetailsProjeto";
import { FileDown, Trash2, Upload } from "lucide-react";
import { sanitizeFileName } from "@/utils/sanitizeFileName";
import { generateUUID } from "@/utils/generateUUID";
import axios from "axios";
import { hexToAscii } from "@/utils/hexToAscii";
import { useRef } from "react";
import { truncateFileName } from "@/utils/truncateFileName";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idProjeto: number | null;
}

export const ModalDoc: React.FC<Props> = ({ open, setOpen, idProjeto }) => {
    const { data: projeto, isLoading, isError, refetch } = useGetDetailsProjeto(idProjeto);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const baixarAnexo = (fileName: string) => {
        const downloadUrl = `${window.location.origin}/mge/download.mge?fileName=${encodeURIComponent(fileName)}&fileNameIsEncoded=S`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "documento");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBaixarTodosAnexos = () => {
        if (!projeto?.ANEXOS) {
            console.error("Não foi encontrado o anexo para essa atividade.");
            return;
        }

        const decodedText = hexToAscii(projeto.ANEXOS);
        const stringOriginal = decodedText.replace('__start_fileinformation__', '').replace('__end_fileinformation__', '');
        const fileInfoArray = JSON.parse(stringOriginal);

        if (Array.isArray(fileInfoArray) && fileInfoArray.length > 0) {
            fileInfoArray.forEach(fileInfo => {
                const caminhoCompleto = `Repo://Sistema/Arquivos//AD_PROJETOSTI/${fileInfo.internalName}`;
                const base64 = btoa(caminhoCompleto);
                baixarAnexo(base64);
            });
        } else {
            console.error("Array vazio ou inválido.");
        }
    };

    const extrairInternalName = (caminhoCompleto: string) => {
        const partes = caminhoCompleto.split('/');
        return partes[partes.length - 1];
    };


    const excluirAnexo = async (caminhoCompleto: string) => {
        if (!idProjeto) return;
        try {
            const internalName = extrairInternalName(caminhoCompleto);
            await JX.novoSalvar(
                { ANEXOS: `"${'$file.remove{internalName=' + internalName + '}'}"` },
                "AD_PROJETOSTI",
                { ID: idProjeto }
            ).then(() => {
                refetch();
            }).catch((error: any) => {
                console.error("Erro ao excluir anexo:", error);
            });
        } catch (error) {
            console.error("Erro ao excluir anexo:", error);
        }
    };


    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const anexaArquivos = async (files: File[], id: number) => {
        console.log("Id Atividade", id);

        if (!files || files.length === 0) return;
        const newFiles: { file: File; sessionKey: string }[] = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("arquivo", file);
            const sessionKeyValue = encodeURIComponent(
                `${sanitizeFileName(file.name)}_${generateUUID()}`
            );

            try {
                await axios.post(
                    `${window.location.origin}/mge/sessionUpload.mge?sessionkey=${sessionKeyValue}&fitem=S&salvar=S&useCache=N`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                console.log(`Upload concluído para: ${file.name} com o sessionKey: ${sessionKeyValue}`);

                newFiles.push({ file, sessionKey: sessionKeyValue });

                const sessionKeyList = `\\\"$file.save{sessionkey=${sessionKeyValue}}\\\"`;

                if (idProjeto) {
                    await JX.novoSalvar(
                        { ANEXOS: sessionKeyList },
                        "AD_PROJETOSTI",
                        { ID: idProjeto }
                    ).then(() => {
                        refetch();
                    });
                }
            } catch (error) {
                console.error(`Erro no upload do arquivo ${file.name}:`, error);
            }
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Documentos</DialogTitle>
                </DialogHeader>

                {isError ? (
                    <p className="flex items-center justify-center text-center">
                        Não foi possível carregar os dados.
                    </p>
                ) : isLoading ? (
                    <div className="flex justify-center items-center text-center">
                        <Loading w={40} h={40} />
                    </div>
                ) : (
                    <>
                        <div className="flex gap-1 mt-1 p-1">
                            <Button className="gap-1" variant="outline" onClick={handleBaixarTodosAnexos}>
                                <FileDown /> Baixar Todos
                            </Button>
                            <Button variant="outline" onClick={handleFileSelect}>
                                <Upload /> Incluir Arquivos
                            </Button>
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => anexaArquivos(Array.from(e.target.files || []), idProjeto!)}
                            />
                        </div>

                        <div className="mt-1">
                            {projeto?.ANEXOS ? (
                                (() => {
                                    const decodedText = hexToAscii(projeto.ANEXOS);
                                    const stringOriginal = decodedText
                                        .replace('__start_fileinformation__', '')
                                        .replace('__end_fileinformation__', '');

                                    let fileInfoArray = [];

                                    try {
                                        fileInfoArray = JSON.parse(stringOriginal);
                                    } catch (error) {
                                        console.error('Erro ao analisar os anexos:', error);
                                    }


                                    if (Array.isArray(fileInfoArray) && fileInfoArray.length > 0) {
                                        return (
                                            <ScrollArea className="h-50 p-1">
                                                <ul>
                                                    {fileInfoArray.map((fileInfo: any, index: any) => {
                                                        const caminhoCompleto = `Repo://Sistema/Arquivos//AD_PROJETOSTI/${fileInfo.internalName}`;
                                                        const base64 = btoa(caminhoCompleto);

                                                        return (
                                                            <li key={index} className="flex justify-between items-center border-b p-2">
                                                                <span className="truncate w-full">
                                                                    {truncateFileName(fileInfo.name, 20)}
                                                                </span>
                                                                <div className="flex gap-1">
                                                                    <Button
                                                                        className="gap-1"
                                                                        variant="outline"
                                                                        onClick={() => baixarAnexo(base64)}
                                                                    >
                                                                        <FileDown />
                                                                    </Button>
                                                                    <Button
                                                                        className="gap-1"
                                                                        variant="outline"
                                                                        onClick={() => excluirAnexo(caminhoCompleto)}
                                                                    >
                                                                        <Trash2 />
                                                                    </Button>

                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </ScrollArea>
                                        );
                                    } else {
                                        console.error('Não foi possível processar os anexos: array inválido ou vazio.');
                                        return <p className="p-1">Não há anexos disponíveis.</p>;
                                    }
                                })()
                            ) : (
                                <p className="p-1">Não há anexos disponíveis.</p>
                            )}
                        </div>
                    </>
                )}

                <DialogFooter className="mt-10">
                    <Button
                        type="button"
                        variant="outline"
                        className="border border-slate-600"
                        onClick={() => setOpen(false)}
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >

    );
};
