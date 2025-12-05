import * as React from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MultiTextInputProps {
  value: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  maxItems?: number;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function MultiTextInput({
  value,
  onAdd,
  onRemove,
  onUpdate,
  maxItems = 5,
  className,
  error,
  disabled,
  placeholder = "Add an item...",
}: MultiTextInputProps) {
  const [currentInput, setCurrentInput] = React.useState("");

  const handleAdd = React.useCallback(() => {
    if (currentInput.trim() && value.length < maxItems) {
      onAdd(currentInput.trim());
      setCurrentInput("");
    }
  }, [currentInput, maxItems, onAdd, value.length]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd]
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentInput(e.target.value);
    },
    []
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="group flex items-center gap-2"
          >
            <Input
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              disabled={disabled}
              className={cn(error ? "border-destructive" : "")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 opacity-0 group-hover:opacity-100 focus:opacity-100"
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        ))}
      </div>
      {value.length < maxItems && (
        <div className="flex items-center gap-2">
          <Input
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(error ? "border-destructive" : "")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleAdd}
            disabled={disabled ?? !currentInput.trim()}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add item</span>
          </Button>
        </div>
      )}
    </div>
  );
} 
