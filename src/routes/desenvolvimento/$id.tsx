import { createFileRoute } from "@tanstack/react-router";
import { Kanban } from "@/components/desenvolvimento/Kanban";
import { useGetAtividadeDesenvolvimento } from "@/hook/desenvolvimento/getAtividadesDesenvolvimento";

export const Route = createFileRoute("/desenvolvimento/$id")({
  component: Desenvolvimento,
});

function Desenvolvimento() {
  const { id } = Route.useParams();

  const { data: atividades } = useGetAtividadeDesenvolvimento(Number(id));
  
  return (
    <>
      <Kanban atividades={atividades} id={Number(id)} />
    </>
  )
};