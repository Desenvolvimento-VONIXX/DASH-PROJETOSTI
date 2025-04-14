import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { CalendarClock, Ellipsis, Eye, FilePenLine, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "./ui/dropdown-menu";
import { prioridadeColors, statusColors } from "@/utils/statusList";
import { Link } from "@tanstack/react-router";
import { DataTableColumnHeader } from "./dt-col-header";
import { betweenDates } from "@/utils/filter";
import { formatDate } from "@/utils/formatDate";


export type Projeto = {
    id: number;
    nome_projeto: string;
    desc_projeto: string;
    status: string;
    status2: string;
    data_inicio: string;
    data_finalizacao: string;
    PORCENTAGEM?: number;
};

export const filterFns = {
    betweenDates: (
        row: Row<Projeto>,
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
    handleVer: (id: number) => void,
    handleDoc: (id: number) => void

): ColumnDef<Projeto>[] => [

        {
            accessorKey: "prioridade",
            enableColumnFilter: false,
            header: () => null,
            cell: ({ getValue }) => {
                const prioridade = getValue() as string;
                const color = prioridadeColors[prioridade];

                return (
                    <div className="flex items-center justify-center">
                        <span
                            className={`w-3 h-3 rounded-full ${color}`}
                            title={prioridade} 
                        />
                    </div>
                );
            }
        },

        {
            accessorKey: "PORCENTAGEM",
            header: () => (
                <span className="font-semibold text-lg">%</span>
            ),
            cell: ({ row }) => {
                const porcentagem = row.getValue("PORCENTAGEM");
                return (

                    <span className="leading-none text-[13px] font-bold text-gray-500">
                        {porcentagem !== null ? `${porcentagem}%` : '0%'}
                    </span>
                );
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" />
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "nome_projeto",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nome do Projeto" />
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "desc_projeto",
            cell: ({ getValue }) => {
                const text = getValue<string>();
                return text.length > 50 ? text.substring(0, 50) + "..." : text;
            },
            size: 50,
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Descrição" />
            ),
            filterFn: "includesString",
        },

        {
            accessorKey: "data_inicio",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dt. Inicio" className="whitespace-nowrap" type="data" />
            ),
            cell: ({ row }) => formatDate(row.getValue("data_inicio")),
            filterFn: betweenDates,
        },
        {
            accessorKey: "data_finalizacao",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dt. Finalização" className="whitespace-nowrap" type="data"
                />
            ),

            cell: ({ row }) => formatDate(row.getValue("data_finalizacao")),

            filterFn: betweenDates,
        },
        {
            accessorKey: "status",
            cell: ({ getValue }) => {
                const status = getValue() as string;
                const color = statusColors[status] || "text-gray-700 bg-gray-200";

                return <span className={`px-3 rounded-md text-center ${color} whitespace-nowrap `}>{status}</span>;
            },
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" type="option" />
            ),
            filterFn: "arrIncludesSome",
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (

                <div className="flex gap-1 justify-end">
                    <Button variant="outline" className="flex items-center gap-2 h-8 w-8 px-2 py-1 text-sm" onClick={() => handleDoc(row.original.id)}>
                        <FileText />
                    </Button>

                    <Link to="/cronograma/$id" params={{ id: row.original.id.toString() }}>
                        <Button variant="outline" className="flex items-center gap-2  h-8  px-2 py-1 text-sm">
                            <CalendarClock /> Cronograma
                        </Button>
                    </Link>

                    <Link to="/desenvolvimento/$id" params={{ id: row.original.id.toString() }}>
                        <Button variant="outline" className="flex items-center gap-2  h-8  px-2 py-1 text-sm">
                            <Eye /> Desenvolvimento
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="px-2 py-1 text-sm h-8  w-8">
                                <Ellipsis />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleVer(row.original.id)}>
                                    <Eye />
                                    <span>Ver Projeto</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
                                    <FilePenLine />
                                    <span>Editar</span>
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>
                                    <Trash />
                                    <span>Excluir</span>
                                </DropdownMenuItem> */}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            ),
        },
    ];
