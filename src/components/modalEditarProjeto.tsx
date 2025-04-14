import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { priodidadeList, statusList } from "@/utils/statusList";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Textarea } from "./ui/textarea";
import { useGetDetailsProjeto } from "@/hook/getDetailsProjeto";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentDate } from "@/utils/nowDate";
import { useGetLog } from "@/hook/getLogProjetos";
import { useCodUsu } from "@/hook/getUsuLogado";
import { Loading } from "./loading";

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    idProjeto: number | null;
    refetch: () => void;
}

export const EditarProjeto: React.FC<Props> = ({ open, setOpen, idProjeto, refetch }) => {
    const dataAtual = getCurrentDate();

    const { data: projeto, refetch: refetchDetails, isLoading, isSuccess } = useGetDetailsProjeto(idProjeto);

    const { refetch: refetchLog } = useGetLog(idProjeto);
    const { data: codUsu } = useCodUsu();

    const formSchema = z.object({
        nome_projeto: z.string()
            .min(1, { message: "O Nome do projeto é obrigatório." })
            .max(100, { message: "O Nome do projeto deve ter no máximo 100 caracteres." }),
        desc_projeto: z.string()
            .min(1, { message: "A Descrição é obrigatória" })
            .max(200, { message: "A Descrição deve ter no máximo 200 caracteres." }),
        status: z.string().min(1, { message: "Selecione um status" }),
        data_inicio: z.string().optional(),
        data_finalizacao: z.string().optional(),
        prioridade: z.string().min(1, { message: "Selecione uma Prioridade" }),

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
            prioridade: "",

        }
    });

    useEffect(() => {
        if (projeto) {
            form.setValue("nome_projeto", projeto.nome_projeto || "");
            form.setValue("desc_projeto", projeto.desc_projeto || "");
            form.setValue("status", projeto?.status2?.trim() || "");
            form.setValue("prioridade", projeto?.prioridade2?.trim() || "");
            form.setValue("data_inicio", projeto.data_inicio || "");
            form.setValue("data_finalizacao", projeto.data_finalizacao || "");
        }
    }, [projeto, isSuccess]);


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

                },
                "AD_PROJETOSTI",
                [
                    {
                        ID: idProjeto
                    }
                ]
            );

            if (Number(response[0].status) === 1) {
                salvaLog();
                toast.success("Infrmações salvas com sucesso!")
                refetch();
                form.reset();
                refetchDetails();
                refetchLog();
                setOpen(false);

            } else {
                const error = response[0].statusMessage || "erro ao editar projeto.";
                toast.error(`Ocorreu um erro ao editar as informações do projeto: ${error}`);
            }

        } catch (err) {
            toast.error("Ocorreu um erro ao editar as inforemações do projeto.");
        } finally {
            setLoading(false);
        }
    };


    const salvaLog = async () => {
        await JX.salvar(
            {
                NOME_PROJETO: projeto.nome_projeto,
                DATA_INICIO: projeto.data_inicio,
                DATA_FINALIZACAO: projeto.data_finalizacao,
                STATUS: projeto.status2,
                DESCRICAO: projeto.desc_projeto,
                DT_ALTERACAO: dataAtual,
                ID: idProjeto,
                CODUSU: codUsu
            },
            "AD_LOGPROJETOSTI",
            []
        ).then(() => {
            console.log("Log salvo com sucesso");
        }).catch(() => {
            console.log("Erro ao salvar log");
        });
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-auto max-w-fit p-6">
                <DialogHeader>
                    <DialogTitle>Editar Projeto #{idProjeto}</DialogTitle>
                    <DialogDescription>
                        Atualize os detalhes do projeto conforme necessário e salve as alterações.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 ">
                    {isLoading ? (
                        <div className="flex items-center justify-center text-center ">
                            <Loading w={40} h={40} />
                        </div>
                    ) : (
                        <Form {...form}>
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
                                                    <select
                                                        className="border-gray-800 rounded-lg w-full border h-9"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    >
                                                        <option value="" disabled>
                                                            Selecionar Status
                                                        </option>
                                                        {statusList.map((status) => (
                                                            <option key={status.value} value={status.value}>
                                                                {status.text}
                                                            </option>
                                                        ))}
                                                    </select>
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
                                                    <select
                                                        className="border-gray-800 rounded-lg w-full border h-9"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    >
                                                        <option value="" disabled>
                                                            Selecionar uma Prioridade
                                                        </option>
                                                        {priodidadeList.map((prioridade) => (
                                                            <option key={prioridade.value} value={prioridade.value}>
                                                                {prioridade.text}
                                                            </option>
                                                        ))}
                                                    </select>
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
                        </Form>
                    )}

                </div>


            </DialogContent>
        </Dialog>
    )
}