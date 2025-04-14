import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Check, PlusCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  type?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  type,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const facets = column?.getFacetedUniqueValues();
  const currentFilterValue = column?.getFilterValue() as string[];
  const selectedValues = new Set(currentFilterValue);

  const uniqueOptions =
    facets &&
    Array.from(facets.keys()).map((value) => ({
      label: value,
      value,
      count: facets.get(value) || 0,
    }));

  return (
    <div className={cn("flex items-center space-x-2 ", className)}>
      <span>{title}</span>
      <DropdownMenu >
        <DropdownMenuTrigger className="bg-transparent" asChild>
          <Button
            variant="ghost"
            size="icon"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" >
          {type === "data" ? (
            <DatePicker
              value={
                column.getFilterValue() as [
                  string | undefined,
                  string | undefined,
                ]
              }
              onDateChange={(range) => {
                column.setFilterValue(range); 
              }}
            />
          ) : type === "option" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle />
                  {title}
                  {selectedValues?.size > 0 && (
                    <>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal lg:hidden"
                      >
                        {selectedValues.size}
                      </Badge>
                      <div className="hidden space-x-1 lg:flex">
                        {selectedValues.size > 2 ? (
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal"
                          >
                            {selectedValues.size} selecionados
                          </Badge>
                        ) : (
                          Array.from(selectedValues).map((value) => (
                            <Badge
                              variant="secondary"
                              key={value}
                              className="rounded-sm px-1 font-normal"
                            >
                              {value}
                            </Badge>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder={title} />
                  <CommandList>
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    <CommandGroup>
                      {uniqueOptions?.map((option) => {
                        const isSelected = selectedValues.has(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              if (isSelected) {
                                selectedValues.delete(option.value);
                              } else {
                                selectedValues.add(option.value);
                              }
                              const filterValues = Array.from(selectedValues);
                              column?.setFilterValue(
                                filterValues.length ? filterValues : undefined
                              );
                            }}
                          >
                            <div
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50 [&_svg]:invisible"
                              )}
                            >
                              <Check />
                            </div>
                            <span>{option.label}</span>
                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                              {option.count}
                            </span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    {selectedValues.size > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => column?.setFilterValue(undefined)}
                            className="justify-center text-center"
                          >
                            Limpar filtros
                          </CommandItem>
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              placeholder="Pesquiar..."
              className="max-w-sm"
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
            />
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Crescente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Decrescente
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Esconder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}