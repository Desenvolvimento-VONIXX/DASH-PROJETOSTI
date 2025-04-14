import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

interface Props {
    date?: string;
    setDate: (date: string) => void;
    label: string;
}

const DateFilter: React.FC<Props> = ({ date, setDate, label }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal border border-stone-700 rounded-lg",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2" />
                    {date ? date : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date ? parse(date, "dd/MM/yyyy", new Date()) : undefined} 
                    onSelect={(selectedDate) => {
                        if (selectedDate) {
                            setDate(format(selectedDate, "dd/MM/yyyy")); 
                        }
                    }}
                    locale={ptBR}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default DateFilter;
