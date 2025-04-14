import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MoveLeft, Plus, RefreshCcw, FileJson, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AddEtapa } from "@/components/etapas/addEtapa";
import { fasesList } from "@/utils/statusList";
import { Loading } from "@/components/loading";
import { useGetDetailsProjeto } from "@/hook/getDetailsProjeto";
import { useGetEtapasProjeto } from "@/hook/etapas/getEtapasProjeto";
import { TabelaEtapas } from "@/components/etapas/table-etapas";
import { getColumns, EtapasProjeto } from "@/components/etapas/columns-etapas";
import { DeleteEtapa } from "@/components/etapas/delete-etapa";
import { EditEtapa } from "@/components/etapas/edit-etapa";
import { useGetEtapasExecucao } from "@/hook/etapa-execucao/getEtapaExecucao";
import { getColumnsExecucao } from "@/components/etapa-execucao/columns-execucao";
import { TabelaEtapasExecucao } from "@/components/etapa-execucao/table-execucao";
import { EditAtividadeDesenvolvimento } from "@/components/etapa-execucao/editAtividadeDesenvolvimento";
import { useCodUsu } from "@/hook/getUsuLogado";
import { getCurrentDate } from "@/utils/nowDate";
import { toast } from "sonner";

export const Route = createFileRoute("/cronograma/$id")({ component: Cronograma });

function Cronograma() {
  const { id } = Route.useParams();
  const { data: codUsu } = useCodUsu();
  const dataAtual = getCurrentDate();

  const [openAddEtapa, setOpenAddEtapa] = useState(false);
  const [selectedFase, setSelectedFase] = useState<string | undefined>();

  const [selectedEtapa, setSelectedEtapa] = useState<number | null>(null);

  const [openDeleteEtapa, setOpenDeleteEtapa] = useState(false);
  const [openEditarEtapa, setOpenEditarEtapa] = useState(false);
  const [openEditarEtapaDev, setOpenEditarEtapaDev] = useState(false);

  const { data: projetoDetails, isLoading: loadingProjetos } = useGetDetailsProjeto(Number(id));
  const { data: etapasProjeto, isLoading: isLoadingEtapas, refetch: refetchEtapas } = useGetEtapasProjeto(Number(id));
  const { data: etapasExecucao, refetch: refetchEtapasDev } = useGetEtapasExecucao(Number(id));

  const [loginSinaliza, setLoginSinaliza] = useState(false);

  const handleCreateSprint = () => {
    setSelectedFase(undefined);
    setOpenAddEtapa(false);
  };


  const handleEdit = (id: number) => {
    setSelectedEtapa(id);
    setOpenEditarEtapa(true);
  };

  const handleDelete = (id: number) => {
    setSelectedEtapa(id);
    setOpenDeleteEtapa(true)
  };

  const handleEditExecucao = (id: number) => {
    setSelectedEtapa(id);
    setOpenEditarEtapaDev(true);
  };

  const columns = getColumns(handleEdit, handleDelete);
  const columnsExecucao = getColumnsExecucao(handleEditExecucao);


  if (loadingProjetos) {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-center">
        <Loading w={80} h={80} />
      </div>
    );
  }

  if (!projetoDetails || !etapasProjeto) {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-center">
        Cronograma não encontrado
      </div>
    );
  }


  const sinalizarDesenvolvimento = async () => {

    var usuRemetente = codUsu;
    var usuSinalizar = [0, 64, 1008]
    var titulo = "Novo projeto para a equipe de Desenvolvimento!";
    const msg = `Projeto ${projetoDetails.id} - *${projetoDetails.nome_projeto}* foi mapeado e está pronto para o desenvolvimento.`;
    setLoginSinaliza(true)
    try {
      const promises = usuSinalizar.map((idUsuario) => {
        return JX.salvar(
          {
            CODUSUREMETENTE: usuRemetente,
            CODUSU: idUsuario,
            TITULO: titulo,
            DESCRICAO: msg,
            DHCRIACAO: dataAtual,
            IDENTIFICADOR: "PERSONALIZADO",
            IMPORTANCIA: 0,
            TIPO: "P",
            SOLUCAO: ""
          },
          "AvisoSistema",
          []
        );
      });

      const responses = await Promise.all(promises);
      console.log(responses)

      if (Number(responses[0].status) === 1) {
        toast.success("A equipe de Desenvolvimento foi sinalizada!")
      } else {
        const error = responses[0].statusMessage || "erro ao sinalizar equipe de desenvolvimento.";
        toast.error(`Ocorreu um erro ao sinalizar a equipe de desenvolvimento: ${error}`);
      }

    } catch (err) {
      toast.error("Ocorreu um erro ao sinalizar ao time de Desenvolvimento.");
    } finally {
      setLoginSinaliza(false);
    }
  }

  return (
    <div className="flex flex-col mx-auto p-8 space-y-6">
      <div className="flex gap-1 items-center">
        <Link to="/">
          <Button className="flex items-center gap-2 px-4 py-2 border" variant={"outline"}>
            <MoveLeft size={18} /> Voltar
          </Button>
        </Link>
        <Button className="flex items-center gap-2 px-4 py-2 border "
          onClick={() => window.location.reload()}>
          <RefreshCcw size={18} className="" />
        </Button>
      </div>

      <h2 className="text-4xl font-bold text-gray-800  pb-3">{projetoDetails.nome_projeto}</h2>

      <Accordion
        type="multiple"
        defaultValue={fasesList.map((fase) => fase.value)}

        className="w-full"
      >
        {fasesList.map((fase) => {
          const filteredEtapas = etapasProjeto.filter((etapa: any) => etapa.fase2 === fase.label);

          return (
            <div key={fase.value} className="bg-white p-6 pt-0 rounded-lg shadow-md border mb-5 transition duration-300 hover:shadow-lg">
              <AccordionItem value={fase.value} className="border-b-0">
                <AccordionTrigger className="pr-2 bg-transparent text-lg font-semibold rounded-lg">{fase.label}</AccordionTrigger>
                <AccordionContent >
                  {filteredEtapas.length > 0 ? (
                    <>
                      <TabelaEtapas columns={columns} data={filteredEtapas} isLoadingEtapas={isLoadingEtapas} />

                      {fase.label === "Execução" && etapasExecucao && etapasExecucao.length > 0 &&
                        filteredEtapas.some((etapa: EtapasProjeto) =>
                          etapa.nome_tarefa
                            ?.toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .includes(
                              "inicio do desenvolvimento"
                                .toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                            )

                        ) && (

                          <div className="mt-5">
                            <p className="mb-5 text-[15px] font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 flex gap-1 text-center items-center">
                              <FileJson size={18} /> Desenvolvimento
                            </p>
                            <TabelaEtapasExecucao
                              columns={columnsExecucao}
                              data={etapasExecucao}
                            />

                          </div>
                        )}
                    </>

                  ) : (
                    <span className="text-gray-500 text-sm flex ">Nenhuma etapa cadastrada.</span>
                  )}
                </AccordionContent>
              </AccordionItem>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setOpenAddEtapa(true);
                    setSelectedFase(fase.value);
                  }}
                  variant="secondary"
                  className="mt-1 mb-1 flex items-center gap-1 bg-blue-700 text-white px-2 py-1 h-8 text-sm rounded-md hover:bg-blue-800 transition duration-300"
                >
                  <Plus size={12} />Adicionar Etapa
                </Button>

                {fase.label === "Execução" && (
                  <Button
                    onClick={() => sinalizarDesenvolvimento()}
                    disabled={loginSinaliza}
                    variant="secondary"
                    className="mt-1 mb-1 flex items-center gap-1 bg-gray-700 text-white px-2 py-1 h-8 text-sm rounded-md hover:bg-gray-800 transition duration-300"
                  >
                    <Bell size={12} /> Sinalizar Desenvolvimento
                  </Button>
                )}
              </div>

            </div>
          );
        })}
      </Accordion>

      {openAddEtapa && (
        <AddEtapa open={openAddEtapa} onClose={handleCreateSprint} fase={selectedFase} idProjeto={Number(id)} refetchEtapas={refetchEtapas} />
      )}
      <DeleteEtapa open={openDeleteEtapa} setOpen={setOpenDeleteEtapa} idProjeto={Number(id)} idCronogama={selectedEtapa} refetch={refetchEtapas} />
      <EditEtapa open={openEditarEtapa} setOpen={setOpenEditarEtapa} idProjeto={Number(id)} idCronograma={selectedEtapa} refetch={refetchEtapas} />
      <EditAtividadeDesenvolvimento open={openEditarEtapaDev} setOpen={setOpenEditarEtapaDev} idProjeto={Number(id)} idAtividade={selectedEtapa} refetch={refetchEtapasDev} />


    </div>
  );
}

