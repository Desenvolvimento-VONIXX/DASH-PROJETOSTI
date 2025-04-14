import { Button } from "@/components/ui/button"
import { Plus, RefreshCcw } from 'lucide-react';
import { getColumns, Projeto } from "@/components/columns-projeto";
import { useEffect, useState } from "react";
import { CriarProjeto } from "@/components/modalCriarProjeto";
import { DeleteProjeto } from "@/components/modalDeleteProjeto";
import { EditarProjeto } from "@/components/modalEditarProjeto";
import { useProjetos } from "@/hook/getProjetos";
import { InfoProjeto } from "@/components/modalInfoProjeto";
import { TabelaProjetos } from "@/components/table-projetos";
import { ModalDoc } from "@/components/modalDoc";

export const Projetos = () => {
    const { data: projetos, refetch: refetchProjetos, isLoading } = useProjetos();

    const [data, setData] = useState<Projeto[]>([]);


    const [selectedProjeto, setSelectedProjeto] = useState<number | null>(null);

    const [openModalCreate, setModalCreate] = useState(false);
    const [openDeleteProjeto, setOpenDeleteProjeto] = useState(false);
    const [openEditarProjeto, setOpenEditarProjeto] = useState(false);
    const [openModalInfoProjeto, setOpenInfoProjeto] = useState(false);
    const [openModalDDocumentos, setModalDoc] = useState(false);



    // const handleDelete = (id: number) => {
    //     setSelectedProjeto(id);
    //     setOpenDeleteProjeto(true)
    // };
 
    const handleVer = (id: number) => {
        setSelectedProjeto(id);
        setOpenInfoProjeto(true)
    };

    const handleDoc = (id: number) => {
        setSelectedProjeto(id);
        setModalDoc(true)
    }

    const handleEdit = (id: number) => {
        setSelectedProjeto(id);
        setOpenEditarProjeto(true);
    };

    const columns = getColumns(handleEdit, handleVer, handleDoc);

    useEffect(() => {
        if (projetos) {
            setData(projetos);
        } else {
            setData([]);
        }
    }, [projetos]); 

    return (
        <>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2 mb-7">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800">Gestão de Projetos - TI</h2>
                    <div className="mt-5 mr-5 right-0 px-4 py-2 rounded z-50 fixed flex items-center space-x-2">
                        <Button className="px-4 py-2 rounded-2xl z-50" onClick={() => window.location.reload()} >
                            <RefreshCcw />
                        </Button>
                        <Button className="px-4 py-2 rounded-2xl z-50" onClick={() => setModalCreate(true)}>
                            <Plus />
                            Criar Projeto
                        </Button> 
                    </div>
                </div>
                <div >
                    <TabelaProjetos columns={columns} data={data} isLoadingProjetos={isLoading} />
                </div>
            </div>


            <CriarProjeto open={openModalCreate} setOpen={setModalCreate} refetch={refetchProjetos} />
            <DeleteProjeto open={openDeleteProjeto} setOpen={setOpenDeleteProjeto} idProjeto={selectedProjeto} refetch={refetchProjetos} />
            <EditarProjeto open={openEditarProjeto} setOpen={setOpenEditarProjeto} idProjeto={selectedProjeto} refetch={refetchProjetos}  />
            <InfoProjeto open={openModalInfoProjeto} setOpen={setOpenInfoProjeto} idProjeto={selectedProjeto} />
            <ModalDoc open={openModalDDocumentos} setOpen={setModalDoc} idProjeto={selectedProjeto}/>
        </>



    )
}
