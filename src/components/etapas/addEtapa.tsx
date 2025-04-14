import { z } from "zod";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { fasesList, statusEtapasList } from "@/utils/statusList";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    fase: string | undefined;
    idProjeto: number;
    refetchEtapas: () => void;
}

export const AddEtapa: React.FC<Props> = ({ open, onClose, fase, idProjeto, refetchEtapas }) => {

    const formSchema = z.object({
        sprint: z.string().optional(),
        nome_tarefa: z.string()
            .min(1, { message: "Nome da tarefa é obrigatório." })
            .max(100, { message: "O Nome do projeto deve ter no máximo 100 caracteres." }),
        area: z.string().min(1, { message: "Área é obrigatório." }),
        status: z.string(),
        data_inicio_estimada: z.string().optional(),
        data_fim_estimada: z.string().optional(),
        data_inicio: z.string().optional(),
        data_finalizacao: z.string().optional(),
        nome_responsavel: z.string().optional(),
        fase: z.string()
            .min(1, { message: "Fase é obrigatório" })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sprint: "",
            nome_tarefa: "",
            area: "",
            status: undefined,
            data_inicio_estimada: "",
            data_fim_estimada: "",
            data_inicio: "",
            data_finalizacao: "",
            nome_responsavel: "",
            fase: fase || undefined,

        }
    });

    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await JX.salvar(
                {
                    ID: idProjeto,
                    NOME_TAREFA: values.nome_tarefa,
                    FASE: values.fase,
                    AREA: values.area,
                    DT_ESTIMADA_INICIO: values.data_inicio_estimada,
                    DT_ESTIMADA_TERMINO: values.data_fim_estimada,
                    DATA_INICIO: values.data_inicio,
                    DATA_TERMINO: values.data_finalizacao,
                    STATUS: values.status,
                    RESPONSAVEL: values.nome_responsavel,
                    SPRINT: values.sprint,
                },
                "AD_CRONOGRAMAPROJETOS",
                []
            )

            if (response.status == 1) {
                toast.success("Etapa adicionada com sucesso!")
                onClose();
                form.reset();
                refetchEtapas();
            } else {
                const error = response.statusMessage || "erro ao adicionar etapa.";
                toast.error(`Ocorreu um erro ao adicionar etapa: ${error}`);
            }

        } catch (err) {
            toast.error("Ocorreu um erro ao adicionar etapa.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Sheet open={open} onOpenChange={onClose}>
                <SheetContent className="min-w-[35%]">
                    <SheetHeader>
                        <SheetTitle>Adicionar Etapa</SheetTitle>
                        <SheetDescription>
                            Planeje e organize uma nova etapa para este projeto.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex gap-2 mt-2">
                                    <FormField
                                        control={form.control}
                                        name="sprint"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Sprint</FormLabel>
                                                <FormControl>
                                                    <Input className="border-gray-800 " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nome_tarefa"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Nome da Tarefa</FormLabel>
                                                <FormControl>
                                                    <Input className="border-gray-800 " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex gap-2 mt-4">

                                    <FormField
                                        control={form.control}
                                        name="fase"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Fase</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="border-gray-800 rounded-lg">
                                                            <SelectValue placeholder="Selecionar Fase" />
                                                        </SelectTrigger>
                                                        <SelectContent >
                                                            <SelectGroup>
                                                                <SelectLabel>Status</SelectLabel>
                                                                {fasesList.map((fases) => (
                                                                    <SelectItem key={fases.value} value={fases.value}>
                                                                        {fases.label}
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
                                                                {statusEtapasList.map((fases) => (
                                                                    <SelectItem key={fases.value} value={fases.value}>
                                                                        {fases.label}
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

                                <div className="flex gap-2 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="nome_responsavel"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Responsável</FormLabel>
                                                <FormControl>
                                                    <Input className="border-gray-800 " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="area"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Área/Subárea</FormLabel>
                                                <FormControl>
                                                    <Input className="border-gray-800 " {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <div className="flex gap-2 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="data_inicio_estimada"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-1">
                                                <FormLabel className="mb-1">Data de Início Estimada</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className=" justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                            >
                                                                <CalendarIcon className="mr-2" />
                                                                {field.value ? field.value : <span>Data Inicial Estimada</span>}
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
                                        name="data_fim_estimada"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-1">
                                                <FormLabel className="mb-1">Data de Finalização Estimada</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className=" justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                            >
                                                                <CalendarIcon className="mr-2" />
                                                                {field.value ? field.value : <span>Data Final Estimada</span>}
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

                                <div className="flex gap-2 mt-4">
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
                                                                className=" justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                            >
                                                                <CalendarIcon className="mr-2" />
                                                                {field.value ? field.value : <span>Data Inicial</span>}
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
                                                                className=" justify-start text-left font-normal border border-stone-700 rounded-lg"
                                                            >
                                                                <CalendarIcon className="mr-2" />
                                                                {field.value ? field.value : <span>Data de Finalização</span>}
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

                                <Button className="mt-10 w-full" disabled={loading} type="submit">Salvar</Button>

                            </form>
                        </FormProvider>
                    </div>

                </SheetContent>
            </Sheet>
        </>
    )
}