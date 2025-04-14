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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loading } from "../loading";
import { useGetDetailsEtapaExecucao } from "@/hook/etapa-execucao/getDetailsAtividade";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idProjeto: number;
    idAtividade: number | null;
    refetch: () => void;
} 

export const EditAtividadeDesenvolvimento: React.FC<Props> = ({ open, setOpen, idProjeto, idAtividade, refetch }) => {
    const { data: atividadeDev, refetch: refetchDetails, isLoading } = useGetDetailsEtapaExecucao(idProjeto, idAtividade);

    const formSchema = z.object({
        sprint: z.string().optional(),
        data_inicio_estimada: z.string().optional(),
        data_fim_estimada: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sprint: "",
            data_inicio_estimada: "",
            data_fim_estimada: "",
        }
    });

    useEffect(() => {
        if (atividadeDev) {
            form.reset({
                sprint: atividadeDev.sprint || "",
                data_inicio_estimada: atividadeDev.data_est_inicio || "",
                data_fim_estimada: atividadeDev.data_est_termino || "",
            });
        }
    }, [atividadeDev]);


    const [loading, setLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const response = await JX.salvar(
                {
                    DT_EST_INICIO: values.data_inicio_estimada,
                    DT_EST_TERMINO: values.data_fim_estimada,
                    SPRINT_PROJETO: values.sprint,
                },
                "AD_ABERTURAPROJETOS",
                [
                    {
                        IDABERTURA: idAtividade
                    }
                ]
            )

            if (Number(response[0].status) === 1) {
                toast.success("Atividade alterada com sucesso!")
                setOpen(false);
                form.reset();
                refetch();
                refetchDetails(); 
            } else {
                const error = response[0].statusMessage || "erro ao editar atividade.";
                toast.error(`Ocorreu um erro ao editar atividade: ${error}`);
            }

        } catch (err) {
            toast.error("Ocorreu um erro ao editar atividade.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen text-center">
                <Loading w={40} h={40} />
            </div>
        );
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="min-w-[35%]">
                    <SheetHeader>
                        <SheetTitle>Editar Atividade</SheetTitle>
                        <SheetDescription>
                            Atualizar informações da atividade.
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

                                <Button className="mt-10 w-full" disabled={loading} type="submit">Salvar</Button>

                            </form>
                        </FormProvider>
                    </div>

                </SheetContent>
            </Sheet>
        </>
    )
}