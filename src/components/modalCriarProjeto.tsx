import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import { format, parse } from "date-fns";
import { Textarea } from "./ui/textarea";
import { priodidadeList, statusList } from "@/utils/statusList";
import { toast } from "sonner"
import { getCurrentDate } from "@/utils/nowDate";
import { useState } from "react";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    refetch: () => void;
}

export const CriarProjeto: React.FC<Props> = ({ open, setOpen, refetch }) => {
    const dataAtual = getCurrentDate();

    const formSchema = z.object({
        nome_projeto: z.string()
            .min(1, { message: "O Nome do projeto é obrigatório." })
            .max(100, { message: "O Nome do projeto deve ter no máximo 100 caracteres." }),
        desc_projeto: z.string()
            .min(1, { message: "A Descrição é obrigatória" })
            .max(200, { message: "A Descrição deve ter no máximo 200 caracteres." }),
        status: z.string().min(1, { message: "Selecione um status" }),
        prioridade: z.string().min(1, { message: "Selecione uma prioridade" }),

        data_inicio: z.string().optional(),
        data_finalizacao: z.string().optional(),
    }).refine((data) => {
        if (data.status !== "BACKLOG" && !data.data_inicio) {
            return false;
        }
        return true;
    }, {
        message: "A Data de Início é obrigatória.",
        path: ["data_inicio"],
    }).refine((data) => {
        if (data.status !== "BACKLOG" && !data.data_finalizacao) {
            return false;
        }
        return true;
    }, {
        message: "A Data de Finalização é obrigatória.",
        path: ["data_finalizacao"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome_projeto: "",
            desc_projeto: "",
            status: "",
            data_inicio: "",
            data_finalizacao: "",
            prioridade: ""
        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await JX.salvar(
                {
                    NOME_PROJETO: values.nome_projeto,
                    STATUS: values.status,
                    DATA_INICIO: values.data_inicio,
                    DATA_FINALIZACAO: values.data_finalizacao,
                    DESCRICAO: values.desc_projeto,
                    PRIORIDADE: values.prioridade,
                    DATA_CRIACAO: dataAtual,
                },
                "AD_PROJETOSTI",
                []
            )

            if (response.status == 1) {
                toast.success("Projeto criado com sucesso!")
                refetch();
                setOpen(false);
                form.reset();
            } else {
                const error = response.statusMessage || "erro ao criar projeto.";
                toast.error(`Ocorreu um erro ao criar projeto: ${error}`);
            }

        } catch (err) {
            toast.error("Ocorreu um erro ao criar o projeto.");
        } finally {
            setLoading(false);
        }

    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-auto max-w-fit p-6">
                <DialogHeader>
                    <DialogTitle>Novo Projeto</DialogTitle>
                    <DialogDescription>
                        Preencha as informações abaixo para cadastrar um novo projeto.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-4 ">
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="nome_projeto"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Nome do Projeto</FormLabel>
                                        <FormControl>
                                            <Input className="border-gray-800 rounded-lg" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2 mt-2">

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="border-gray-800 rounded-lg">
                                                        <SelectValue placeholder="Selecionar Status" />
                                                    </SelectTrigger>
                                                    <SelectContent >
                                                        <SelectGroup>
                                                            <SelectLabel>Status</SelectLabel>
                                                            {statusList.map((status) => (
                                                                <SelectItem key={status.value} value={status.value}>
                                                                    {status.text}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="prioridade"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Prioridade</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="border-gray-800 rounded-lg">
                                                        <SelectValue placeholder="Selecionar a Prioridade" />
                                                    </SelectTrigger>
                                                    <SelectContent >
                                                        <SelectGroup>
                                                            <SelectLabel>Prioridade</SelectLabel>
                                                            {priodidadeList.map((prioridade) => (
                                                                <SelectItem key={prioridade.value} value={prioridade.value}>
                                                                    {prioridade.text}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                <FormField
                                    control={form.control}
                                    name="data_inicio"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col flex-1">
                                            <FormLabel className="mb-1">Data de Início</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-[280px] justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                        >
                                                            <CalendarIcon className="mr-2" />
                                                            {field.value ? field.value : <span>Selecionar Data</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? parse(field.value, "dd/MM/yyyy", new Date()) : undefined}
                                                            onSelect={(selectedDate) => {
                                                                if (selectedDate) {
                                                                    const formattedDate = format(selectedDate, "dd/MM/yyyy");
                                                                    field.onChange(formattedDate);
                                                                }
                                                            }}
                                                            locale={ptBR}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="data_finalizacao"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col flex-1">
                                            <FormLabel className="mb-1">Data de Finalização</FormLabel>
                                            <FormControl>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-[280px] justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                        >
                                                            <CalendarIcon className="mr-2" />
                                                            {field.value ? field.value : <span>Selecionar Data</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? parse(field.value, "dd/MM/yyyy", new Date()) : undefined}
                                                            onSelect={(selectedDate) => {
                                                                if (selectedDate) {
                                                                    const formattedDate = format(selectedDate, "dd/MM/yyyy");
                                                                    field.onChange(formattedDate);
                                                                }
                                                            }}
                                                            locale={ptBR}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>


                            <div className="flex flex-col gap-4 mt-2">
                                <FormField
                                    control={form.control}
                                    name="desc_projeto"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Descrição</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="" {...field} className="h-20  border border-stone-700" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="mt-10 ">
                                <Button type="button" variant="outline" className="border border-slate-600" onClick={() => setOpen(false)}>Fechar</Button>
                                <Button disabled={loading} type="submit">Salvar</Button>

                            </DialogFooter>
                        </form>
                    </FormProvider>
                </div>

            </DialogContent>
        </Dialog >
    );
};
