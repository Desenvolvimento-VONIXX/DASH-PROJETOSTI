import { CircleAlert } from 'lucide-react';
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idProjeto: number;
    idCronogama: number | null;
    refetch: () => void;
}

export const DeleteEtapa: React.FC<Props> = ({ open, setOpen, idProjeto, idCronogama, refetch }) => {
    const handleDelete = async () => {
        try {
            if (idProjeto && idCronogama) {
                await JX.deletar('AD_CRONOGRAMAPROJETOS', [{ ID: idProjeto, ID_CRO: idCronogama }])
                    .then((response: any) => {
                        if (response.status == 1) {
                            toast.success("Atividade excluída com sucesso!")
                            refetch();
                            setOpen(false);
                        } else {
                            const error = response.statusMessage || "erro ao excluir a atividade.";
                            toast.error(`Ocorreu um erro ao excluir a atividade: ${error}`);
                        }
                    })
            }

        } catch (error) {
            toast.error("Ocorreu um erro ao excluir a atividade.");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-md p-6 rounded-lg shadow-lg bg-white">
                <AlertDialogHeader className="flex flex-col items-center">
                    <CircleAlert className="w-12 h-12 text-red-600" />
                    <AlertDialogTitle className="text-lg font-semibold text-gray-800 mt-4">Tem certeza que deseja excluir a atividade? <br />
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 text-center">
                        Essa ação não pode ser desfeita e removerá permanentemente os dados do sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center space-x-4 mt-4">
                    <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" onClick={() => setOpen(false)}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={handleDelete}>
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
