export const statusList = [
    { value: "BACKLOG", text: "Backlog" },
    { value: "ANDAMENTO", text: "Em andamento" },
    { value: "IMPED", text: "Impedimento" },
    { value: "CONCLUIDO", text: "Concluído" },
    { value: "REVISAO", text: "Revisão" },
    { value: "CANCELADO", text: "Cancelado" },
    { value: "TESTE", text: "Teste" },
    { value: "DESENV", text: "Desenvolvimento" },
    { value: "APROVDEV", text: "Aprovação - Dev" },
    { value: "FILADEV", text: "Fila - Dev" },
    { value: "APROVSOL", text: "Aprovação - Solicitante" },


]

export const statusColors: Record<string, string> = {
    "Backlog": "text-blue-700 bg-blue-200",
    "Em andamento": "text-yellow-700 bg-yellow-100",
    "Impedimento": "text-orange-700 bg-orange-100",
    "Concluído": "text-green-700 bg-green-100",
    "Revisão": "text-gray-700 bg-gray-100",
    "Cancelado": "text-red-700 bg-red-100",
    "Em teste": "text-purple-700 bg-purple-100",
    "Desenvolvimento": "text-white bg-gray-800",
    "Aprovação - Dev": "text-indigo-800 bg-indigo-200",
    "Fila - Dev": "text-amber-800 bg-amber-200",
    "Aprovação - Solicitante": "text-slate-800 bg-slate-200", 
};

export const priodidadeList = [
    { value: "BAIXA", text: "Baixa" },
    { value: "MEDIA", text: "Média" },
    { value: "ALTA", text: "Alta" }
]

export const prioridadeColors: Record<string, string> = {
    "Baixa": "bg-green-400",
    "Média": "bg-yellow-400",
    "Alta": "bg-red-400",
};

export const fasesList = [
    { value: "FASE01", label: "Inicialização" },
    { value: "FASE02", label: "Planejamento" },
    { value: "FASE03", label: "Execução" },
    { value: "FASE04", label: "Monitoramento e Controle" },
    { value: "FASE05", label: "Encerramento" },
]


export const statusEtapasList = [
    { value: "PLANEJADO", label: "Planejado" },
    { value: "CONCLUIDO", label: "Concluído" },
    { value: "ANDAMENTO", label: "Em andamento" },
    { value: "IMEPED", label: "Impedido" },
    { value: "ATRASADO", label: "Atrasado" },
]

export const statusEtapasColors: Record<string, string> = {
    "Planejado": "text-gray-700 bg-gray-100",
    "Em andamento": "text-yellow-700 bg-yellow-100",
    "Impedido": "text-orange-700 bg-orange-100",
    "Concluído": "text-green-700 bg-green-100",
    "Atrasado": "text-red-700 bg-red-100",
};

export const statusEtapasExecucaoColors: Record<string, string> = {
    "A Fazer": "text-gray-700 bg-gray-100",
    "Em Andamento": "text-yellow-700 bg-yellow-100",
    "Parado": "text-orange-700 bg-orange-100",
    "Pausado": "text-orange-700 bg-orange-100",
    "Impedimento": "text-red-800 bg-red-200",
    "Finalizado": "text-green-700 bg-green-100",
    "Atrasado": "text-red-700 bg-red-100",
    "Em Teste": "text-blue-700 bg-blue-200",
    "Em Verificação": "text-purple-700 bg-purple-100",

};