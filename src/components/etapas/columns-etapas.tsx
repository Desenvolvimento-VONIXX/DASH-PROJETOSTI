import { ColumnDef, Row } from "@tanstack/react-table";
import { betweenDates } from "@/utils/filter";
import { formatDate } from "@/utils/formatDate";
import { DataTableColumnHeader } from "../dt-col-header";
import { statusEtapasColors } from "@/utils/statusList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, FilePenLine, Trash } from "lucide-react";

export type EtapasProjeto = {
    id: number;
    id_cronograma: number;
    nome_tarefa: string;
    fase: string;
    fase2: string;
    area: string;
    data_est_inicio: string;
    data_est_termino: string;
    data_inicio: string;
    data_termino: string;
    status: string;
    status2: string;
    responsavel: string;
    sprint: string;
};

export const filterFns = {
    betweenDates: (
        row: Row<EtapasProjeto>,
        columnId: string,
        filterValue: [string | null, string | null] | undefined
    ) => {
        const rowValue = new Date(row.getValue(columnId));
        const [start, end] = filterValue || [];
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;

        if (startDate && rowValue < startDate) return false;
        if (endDate && rowValue > endDate) return false;

        return true;
    },
};


export const getColumns = (
    handleEdit: (id: number) => void,
    handleDelete: (id: number) => void,
): ColumnDef<EtapasProjeto>[] => [

        {
            accessorKey: "sprint",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Sprint" />
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "nome_tarefa",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Tarefas" />
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "area",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Área/Subárea" />
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "data_est_inicio",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dt. Est Início" className="whitespace-nowrap" type="data" />
            ),
            cell: ({ row }) => formatDate(row.getValue("data_est_inicio")),
            filterFn: betweenDates,
        },
        {
            accessorKey: "data_inicio",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dt. Início" className="whitespace-nowrap" type="data" />
            ),
            cell: ({ row }) => formatDate(row.getValue("data_inicio")),
            filterFn: betweenDates,
        },
        {
            accessorKey: "data_est_termino",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dt. Est Termino" className="whitespace-nowrap" type="data" />
            ),
            cell: ({ row }) => formatDate(row.getValue("data_est_termino")),
            filterFn: betweenDates,
        },
        {
            accessorKey: "data_termino",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dt. Termino" className="whitespace-nowrap" type="data" />
            ),
            cell: ({ row }) => formatDate(row.getValue("data_termino")),
            filterFn: betweenDates,
        },
        {
            accessorKey: "status2",
            cell: ({ getValue }) => {
                const status = getValue() as string;
                const color = statusEtapasColors[status] || "text-gray-700 bg-gray-200";

                return <span className={`px-3 rounded-md text-center ${color} whitespace-nowrap `}>{status}</span>;
            },
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" type="option" />
            ),
            filterFn: "arrIncludesSome",
        },
        {
            accessorKey: "responsavel",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Responsável" />
            ),
            filterFn: "includesString",
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex gap-1 justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-6 px-2 py-1 text-sm">
                                <Ellipsis />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-w-20">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleEdit(row.original.id_cronograma)}>
                                    <FilePenLine />
                                    <span>Editar</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(row.original.id_cronograma)}>
                                    <Trash />
                                    <span>Excluir</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            ),
        },

    ];
