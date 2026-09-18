"use client";

import { cn } from "@/lib/utils";
import { Text } from "@/components/atoms/Typography";

export interface VariantOption {
  name: string;
  values: string[];
}

export interface VariantSelectorProps {
  options: VariantOption[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
  className?: string;
}

function VariantSelector({
  options,
  selectedOptions,
  onOptionChange,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {options.map((option) => (
        <div key={option.name}>
          <Text
            as="span"
            size="xs"
            color="muted"
            className="mb-2.5 block uppercase tracking-widest"
          >
            {option.name}
            {selectedOptions[option.name] && (
              <span className="ml-2 text-bone">
                — {selectedOptions[option.name]}
              </span>
            )}
          </Text>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onOptionChange(option.name, value)}
                  className={cn(
                    "min-w-[3rem] border px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors duration-150",
                    isSelected
                      ? "border-bone bg-bone text-iron-950"
                      : "border-iron-600 text-iron-300 hover:border-iron-400"
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export { VariantSelector };
