import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker"; // Importa o tipo DateRange

type DatePickerProps = {
  onDateChange: (range: [string | undefined, string | undefined]) => void; // Passar um DateRange ou undefined
  value?: [string | undefined, string | undefined];
  className?: string;
};

export function DatePicker({
  onDateChange,
  value,
  className,
}: DatePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: value?.[0] ? new Date(value[0]) : undefined,
    to: value?.[1] ? new Date(value[1]) : undefined,
  });
  const handleSelect = (range: DateRange | undefined) => {
    // Verifique se o range é válido
    if (range) {
      const { from, to } = range;
      const from2 = from ? from.toISOString().split("T")[0] : undefined;
      const to2 = to ? to.toISOString().split("T")[0] : undefined;

      // Certifique-se de que estamos passando um objeto DateRange com from e to
      setDate(range);
      onDateChange([from2, to2]); // Atualiza o filtro com o objeto DateRange
    } else {
      // Caso não tenha selecionado um intervalo, passe undefined
      setDate(undefined);
      onDateChange([undefined, undefined]);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date?.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Selecione um intervalo de datas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
