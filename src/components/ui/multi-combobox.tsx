import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface Option<T extends string> {
  value: T;
  label: string;
}

interface MultiComboboxProps<T extends string> {
  value: T[];
  onChange: (value: T[]) => void;
  options: Option<T>[];
  placeholder?: string;
  emptyText?: string;
  maxItems?: number;
  className?: string;
  error?: boolean;
}

export function MultiCombobox<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  emptyText = "No items found.",
  maxItems,
  className,
  error,
}: MultiComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const option = options.find((o) => o.value === currentValue);
      if (!option) return;

      if (maxItems && value.length >= maxItems) {
        setOpen(false);
        return;
      }

      if (!value.includes(option.value)) {
        onChange([...value, option.value]);
      }
      setOpen(false);
    },
    [maxItems, onChange, options, value]
  );

  const handleRemove = React.useCallback(
    (optionValue: T) => {
      onChange(value.filter((v) => v !== optionValue));
    },
    [onChange, value]
  );

  const selectedOptions = options.filter((option) => value.includes(option.value));
  const availableOptions = options.filter((option) => !value.includes(option.value));

  return (
    <div className={className}>
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <Badge key={option.value} variant="secondary" className="gap-1">
            {option.label}
            <button
              type="button"
              className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleRemove(option.value)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {option.label}</span>
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error ? "border-destructive" : ""
            )}
            disabled={maxItems ? value.length >= maxItems : false}
          >
            {maxItems && value.length >= maxItems
              ? `Maximum ${maxItems} items selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {availableOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 
